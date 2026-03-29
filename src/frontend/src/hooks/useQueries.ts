import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExternalBlob, Post, Profile } from "../backend";
import { useActor } from "./useActor";

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Profile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Profile | null>({
    queryKey: ["userProfile", userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      return actor.getUserProfile(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });
}

export function useUpdateCallerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCallerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

// Hobbies Queries
export function useGetAllHobbies() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["allHobbies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHobbies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHobby() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hobby: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.authAddHobby(hobby);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allHobbies"] });
    },
  });
}

// Post Queries
export function useGetProfileGrid(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ["profileGrid", userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      return actor.getProfileGrid(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useAddPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caption,
      blob,
    }: { caption: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPost(caption, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profileGrid"] });
      toast.success("Post added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add post: ${error.message}`);
    },
  });
}

export function useEditPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      caption,
      blob,
    }: { postId: bigint; caption: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.editPost(postId, caption, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profileGrid"] });
      toast.success("Post updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profileGrid"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });
}

// Chat stubs — backend does not support chat yet
export interface Message {
  sender: { toString(): string };
  content: string;
  timestamp: bigint;
}

export interface Conversation {
  participants: { toString(): string }[];
  messages: Message[];
}

export function useGetAllConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["allConversations"],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetConversation(_partnerPrincipal: Principal | null) {
  return useQuery<Conversation | null>({
    queryKey: ["conversation", _partnerPrincipal?.toString()],
    queryFn: async () => null,
    enabled: false,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (_: { recipient: Principal; content: string }) => {},
    onError: () => {
      toast.error("Chat not supported yet");
    },
  });
}
