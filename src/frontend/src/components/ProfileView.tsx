import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Edit,
  Facebook,
  Instagram,
  Mail,
  Plus,
  Save,
  Twitter,
  X,
} from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import type { Profile } from "../backend";
import {
  useAddHobby,
  useGetAllHobbies,
  useGetCallerUserProfile,
  useUpdateCallerProfile,
} from "../hooks/useQueries";

const PREDEFINED_HOBBIES = [
  "Reading",
  "Gaming",
  "Cooking",
  "Photography",
  "Travel",
  "Music",
  "Sports",
  "Art",
  "Dancing",
  "Hiking",
  "Yoga",
  "Coding",
];

export default function ProfileView() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { mutate: updateProfile, isPending } = useUpdateCallerProfile();
  const { data: allHobbies = [] } = useGetAllHobbies();
  const { mutate: addHobby } = useAddHobby();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [newHobby, setNewHobby] = useState("");

  const availableHobbies = Array.from(
    new Set([...PREDEFINED_HOBBIES, ...allHobbies]),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedProfile) {
      updateProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const toggleHobby = (hobby: string) => {
    if (!editedProfile) return;
    const hobbies = editedProfile.hobbies.includes(hobby)
      ? editedProfile.hobbies.filter((h) => h !== hobby)
      : [...editedProfile.hobbies, hobby];
    setEditedProfile({ ...editedProfile, hobbies });
  };

  const handleAddCustomHobby = () => {
    if (newHobby.trim() && !availableHobbies.includes(newHobby.trim())) {
      addHobby(newHobby.trim());
      if (editedProfile) {
        setEditedProfile({
          ...editedProfile,
          hobbies: [...editedProfile.hobbies, newHobby.trim()],
        });
      }
      setNewHobby("");
    }
  };

  const currentProfile = isEditing && editedProfile ? editedProfile : profile;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">My Profile</CardTitle>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isPending} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-1 text-3xl font-bold text-primary-foreground">
              {currentProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <Input
                  value={editedProfile?.name || ""}
                  onChange={(e) =>
                    setEditedProfile(
                      editedProfile
                        ? { ...editedProfile, name: e.target.value }
                        : null,
                    )
                  }
                  className="text-2xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedProfile?.dob || ""}
                  onChange={(e) =>
                    setEditedProfile(
                      editedProfile
                        ? { ...editedProfile, dob: e.target.value }
                        : null,
                    )
                  }
                />
              ) : (
                <p className="text-sm">
                  {currentProfile.dob || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedProfile?.email || ""}
                  onChange={(e) =>
                    setEditedProfile(
                      editedProfile
                        ? { ...editedProfile, email: e.target.value }
                        : null,
                    )
                  }
                />
              ) : (
                <p className="text-sm">
                  {currentProfile.email || "Not provided"}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-semibold">Social Media</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SiInstagram className="h-5 w-5 text-pink-500" />
                {isEditing ? (
                  <Input
                    value={editedProfile?.instagram || ""}
                    onChange={(e) =>
                      setEditedProfile(
                        editedProfile
                          ? { ...editedProfile, instagram: e.target.value }
                          : null,
                      )
                    }
                    placeholder="Instagram username"
                  />
                ) : (
                  <span className="text-sm">
                    {currentProfile.instagram || "Not provided"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <SiX className="h-5 w-5" />
                {isEditing ? (
                  <Input
                    value={editedProfile?.twitter || ""}
                    onChange={(e) =>
                      setEditedProfile(
                        editedProfile
                          ? { ...editedProfile, twitter: e.target.value }
                          : null,
                      )
                    }
                    placeholder="Twitter/X username"
                  />
                ) : (
                  <span className="text-sm">
                    {currentProfile.twitter || "Not provided"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <SiFacebook className="h-5 w-5 text-blue-600" />
                {isEditing ? (
                  <Input
                    value={editedProfile?.facebook || ""}
                    onChange={(e) =>
                      setEditedProfile(
                        editedProfile
                          ? { ...editedProfile, facebook: e.target.value }
                          : null,
                      )
                    }
                    placeholder="Facebook profile"
                  />
                ) : (
                  <span className="text-sm">
                    {currentProfile.facebook || "Not provided"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Hobbies & Interests
            </Label>
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availableHobbies.map((hobby) => (
                    <div key={hobby} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${hobby}`}
                        checked={editedProfile?.hobbies.includes(hobby)}
                        onCheckedChange={() => toggleHobby(hobby)}
                      />
                      <label
                        htmlFor={`edit-${hobby}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {hobby}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Add custom hobby"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomHobby();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomHobby}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentProfile.hobbies.length > 0 ? (
                  currentProfile.hobbies.map((hobby) => (
                    <Badge key={hobby} variant="secondary">
                      {hobby}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hobbies added yet
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
