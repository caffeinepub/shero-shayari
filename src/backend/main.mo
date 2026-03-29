import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  // Include prefabricated components
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Profile = {
    name : Text;
    dob : Text;
    email : Text;
    passwordHash : Text;
    gender : Text;
    nationality : Text;
    bio : Text;
    profilePicture : ?Storage.ExternalBlob;
    hobbies : [Text];
    instagram : Text;
    twitter : Text;
    facebook : Text;
    posts : [Post];
    isActive : Bool;
  };

  public type Post = {
    id : Nat;
    caption : Text;
    blob : Storage.ExternalBlob;
    likes : Nat;
    timestamp : Time.Time;
  };

  // Persistent storage
  let profiles = Map.empty<Principal, Profile>();
  let emailToPrincipal = Map.empty<Text, Principal>();
  let posts = Map.empty<Nat, Post>();
  let postOwners = Map.empty<Nat, Principal>(); // Track post ownership
  let allPosts = List.empty<Post>();
  var postCounter = 0;
  let allHobbiesSet = Set.empty<Text>();

  // Helper functions
  func filterPostsArray(postsArray : [Post], postId : Nat) : [Post] {
    postsArray.filter(func(p) { p.id != postId });
  };

  // User profile management
  public shared ({ caller }) func registerUser(newProfile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register profiles");
    };
    switch (profiles.get(caller)) {
      case (null) {
        if (emailToPrincipal.containsKey(newProfile.email)) {
          Runtime.trap("Email already in use");
        };
        let profileWithActive = { newProfile with isActive = true };
        profiles.add(caller, profileWithActive);
        emailToPrincipal.add(newProfile.email, caller);

        // Add new hobbies to system-wide set
        for (hobby in newProfile.hobbies.values()) {
          allHobbiesSet.add(hobby);
        };
      };
      case (?_) { Runtime.trap("Profile already exists. To update, use updateProfile") };
    };
  };

  public shared ({ caller }) func updateCallerProfile(updatedProfile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No existing profile found for caller") };
      case (?oldProfile) {
        // Merge old and new hobbies into system-wide hobby set
        for (hobby in updatedProfile.hobbies.values()) {
          allHobbiesSet.add(hobby);
        };
        let profileWithActive = { updatedProfile with isActive = true };
        profiles.add(caller, profileWithActive);
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    // Only authenticated users can view profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    // Only authenticated users can view their own profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getAllHobbies() : async [Text] {
    // Public endpoint - no authorization required
    allHobbiesSet.toArray();
  };

  // Authentication
  public query ({ caller }) func loginWithEmail(email : Text, passwordHash : Text) : async Bool {
    // This is the authentication mechanism itself, so no auth check needed
    // However, we need to verify the email/password combination
    switch (emailToPrincipal.get(email)) {
      case (null) { false };
      case (?userPrincipal) {
        // Check if the stored principal matches the caller
        if (userPrincipal != caller) {
          false;
        } else {
          switch (profiles.get(userPrincipal)) {
            case (null) { false };
            case (?profile) { profile.passwordHash == passwordHash };
          };
        };
      };
    };
  };

  // Post management
  public shared ({ caller }) func addPost(caption : Text, blob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add posts");
    };
    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile not found");
    };

    let newPost : Post = {
      id = postCounter;
      caption;
      blob;
      likes = 0;
      timestamp = Time.now();
    };

    posts.add(postCounter, newPost);
    postOwners.add(postCounter, caller); // Track ownership
    allPosts.add(newPost);

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedPosts = profile.posts.concat([newPost]);
        updateUserProfilePosts(caller, updatedPosts);
      };
    };

    postCounter += 1;
    newPost.id;
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };

    // Verify ownership
    switch (postOwners.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only delete your own posts");
        };
      };
    };

    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile not found");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let filteredPosts = profile.posts.filter(func(post) { post.id != postId });
        updateUserProfilePosts(caller, filteredPosts);
        posts.remove(postId);
        postOwners.remove(postId);

        // Use the new filterPostsArray helper to handle mutable lists
        let filteredArray = filterPostsArray(allPosts.toArray(), postId);
        allPosts.clear();
        allPosts.addAll(filteredArray.values());
      };
    };
  };

  public shared ({ caller }) func editPost(postId : Nat, newCaption : Text, newBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can edit posts");
    };

    // Verify ownership
    switch (postOwners.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only edit your own posts");
        };
      };
    };

    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile not found");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedPosts = profile.posts.map(
          func(post) {
            if (post.id == postId) {
              { post with caption = newCaption; blob = newBlob };
            } else {
              post;
            };
          }
        );
        updateUserProfilePosts(caller, updatedPosts);
        switch (posts.get(postId)) {
          case (?post) {
            posts.add(postId, { post with caption = newCaption; blob = newBlob });
          };
          case (null) {};
        };
      };
    };
  };

  func updateUserProfilePosts(user : Principal, updatedPosts : [Post]) {
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedProfile = { profile with posts = updatedPosts };
        profiles.add(user, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getProfileGrid(user : Principal) : async [Post] {
    // Only authenticated users can view profile grids
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profile grids");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile.posts };
    };
  };

  // Hobby management
  public shared ({ caller }) func authAddHobby(hobby : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add hobbies");
    };
    allHobbiesSet.add(hobby);
  };
};
