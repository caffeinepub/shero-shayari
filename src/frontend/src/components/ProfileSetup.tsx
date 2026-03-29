import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import type { Profile } from "../backend";
import {
  useAddHobby,
  useGetAllHobbies,
  useSaveCallerUserProfile,
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

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState("");

  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  const { data: allHobbies = [] } = useGetAllHobbies();
  const { mutate: addHobby } = useAddHobby();

  const availableHobbies = Array.from(
    new Set([...PREDEFINED_HOBBIES, ...allHobbies]),
  );

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby],
    );
  };

  const handleAddCustomHobby = () => {
    if (newHobby.trim() && !availableHobbies.includes(newHobby.trim())) {
      addHobby(newHobby.trim());
      setSelectedHobbies((prev) => [...prev, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: Profile = {
      name: name.trim(),
      dob: dob.trim(),
      email: email.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
      facebook: facebook.trim(),
      hobbies: selectedHobbies,
      posts: [],
      bio: "",
      nationality: "",
      gender: "",
      isActive: true,
      passwordHash: "",
    };

    saveProfile(profile);
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="container max-w-3xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-1">
            <UserPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Create Your Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-4">
              <Label>Social Media Links</Label>
              <div className="space-y-3">
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram username"
                />
                <Input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter/X username"
                />
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook profile"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Hobbies & Interests</Label>
              <div className="flex flex-wrap gap-2">
                {availableHobbies.map((hobby) => (
                  <div key={hobby} className="flex items-center space-x-2">
                    <Checkbox
                      id={hobby}
                      checked={selectedHobbies.includes(hobby)}
                      onCheckedChange={() => toggleHobby(hobby)}
                    />
                    <label
                      htmlFor={hobby}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {selectedHobbies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedHobbies.map((hobby) => (
                    <Badge key={hobby} variant="secondary">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
