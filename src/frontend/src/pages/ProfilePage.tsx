import { ShayariCard } from "@/components/ShayariCard";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/context/ProfileContext";
import { poets, shayariList } from "@/data/mockData";
import { useActor } from "@/hooks/useActor";
import {
  CalendarDays,
  Camera,
  Globe,
  Grid3X3,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const { actor } = useActor();
  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const poet = poets[2];
  const myShayari = shayariList.filter((s) => s.poetId === poet.id);

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !actor || !profile) return;
    setUploadingPic(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      const { ExternalBlob } = await import("@/backend");
      const blob = ExternalBlob.fromBytes(uint8);
      const updatedProfile = { ...profile, profilePicture: blob };
      await actor.updateCallerProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to update profile picture");
    } finally {
      setUploadingPic(false);
    }
  };

  if (!profile) {
    return (
      <main className="max-w-xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
          data-ocid="profile.login.panel"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2D2015, #3D2A10)" }}
          >
            <UserPlus className="w-9 h-9 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Apna Profile
          </h2>
          <p className="text-muted-foreground">
            Please login to view your profile.
          </p>
        </motion.div>
      </main>
    );
  }

  const profilePicUrl = profile.profilePicture?.getDirectURL();
  const initials = profile.name.charAt(0).toUpperCase();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Cover */}
      <div
        className="relative h-48 rounded-2xl overflow-hidden mb-0"
        style={{
          background:
            "linear-gradient(135deg, #1B1F22 0%, #2D2015 40%, #3D2A10 70%, #1B1F22 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 60% 50%, oklch(0.72 0.10 75 / 0.2) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-4 right-4">
          <button
            type="button"
            data-ocid="profile.settings.button"
            className="p-2 rounded-lg bg-charcoal/60 border border-gold/20 text-muted-foreground hover:text-gold transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="relative px-4 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            {/* Avatar with upload */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-charcoal"
                style={{ boxShadow: "0 0 0 3px #C8A35A" }}
              >
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.2)",
                      color: "#C9A84C",
                    }}
                  >
                    {initials}
                  </div>
                )}
              </motion.div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                data-ocid="profile.pic.upload_button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C9A84C" }}
              >
                <Camera className="w-3.5 h-3.5" style={{ color: "#1B1F22" }} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>
            <div className="mb-2">
              <h1 className="font-display text-2xl font-bold text-white">
                {profile.name}
              </h1>
              <p className="text-gold text-sm">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Profile details */}
        <div className="flex flex-wrap gap-4 mt-5">
          {profile.dob && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5 text-gold" />
              <span>{profile.dob}</span>
            </div>
          )}
          {profile.gender && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{profile.gender}</span>
            </div>
          )}
          {profile.nationality && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>{profile.nationality}</span>
            </div>
          )}
        </div>

        {/* Hobbies */}
        {profile.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.hobbies.map((h) => (
              <Badge
                key={h}
                className="bg-gold/10 text-gold border border-gold/30 text-xs"
              >
                {h}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gold/20 mb-8" />

      <div className="flex items-center gap-2 mb-6">
        <Grid3X3 className="w-5 h-5 text-gold" />
        <h2 className="font-display text-xl font-bold text-white">
          Shayari Collection
        </h2>
      </div>

      {myShayari.length === 0 ? (
        <div
          data-ocid="profile.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          No shayari posted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myShayari.map((s, i) => (
            <ShayariCard key={s.id} shayari={s} poet={poet} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
