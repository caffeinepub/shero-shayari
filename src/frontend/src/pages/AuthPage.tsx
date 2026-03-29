import type { ExternalBlob, Profile } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/context/ProfileContext";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  Camera,
  Loader2,
  LogIn,
  PenLine,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

async function hashPassword(password: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SHAYARI_QUOTES = [
  {
    text: "दिल की गहराइयों से निकलती है शायरी,\nजो लफ़्ज़ों में बयान होती है।",
    author: "— Mirza Ghalib",
  },
  {
    text: "इश्क़ पर ज़ोर नहीं, है ये वो आतिश 'ग़ालिब'\nजो लगाए न लगे और बुझाए न बुझे।",
    author: "— Mirza Ghalib",
  },
  {
    text: "हज़ारों ख्वाहिशें ऐसी कि हर ख्वाहिश पे दम निकले\nबहुत निकले मेरे अरमान लेकिन फिर भी कम निकले।",
    author: "— Mirza Ghalib",
  },
];

export function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null,
  );
  const [profilePicBlob, setProfilePicBlob] = useState<ExternalBlob | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();
  const { setProfile } = useProfile();
  const {
    identity,
    login: iiLogin,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const quote =
    SHAYARI_QUOTES[Math.floor(Math.random() * SHAYARI_QUOTES.length)];

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    nationality: "",
    bio: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const { ExternalBlob } = await import("@/backend");
    setProfilePicBlob(ExternalBlob.fromBytes(uint8));
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please connect with Internet Identity first");
      return;
    }
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassword(form.password);
      const newProfile: Profile = {
        name: form.name,
        email: form.email,
        passwordHash,
        dob: form.dob,
        gender: form.gender,
        nationality: form.nationality,
        bio: form.bio,
        twitter: "",
        instagram: "",
        facebook: "",
        isActive: true,
        posts: [],
        hobbies: [],
        profilePicture: profilePicBlob ?? undefined,
      };
      await actor.registerUser(newProfile);
      const saved = await actor.getCallerUserProfile();
      setProfile(saved);
      toast.success("Welcome to Shero Shayari! 🌹");
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please connect with Internet Identity first");
      return;
    }
    setLoginError("");
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassword(form.password);
      const success = await actor.loginWithEmail(form.email, passwordHash);
      if (success) {
        const p = await actor.getCallerUserProfile();
        setProfile(p);
        toast.success("Login successful! 🌹");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (err: any) {
      setLoginError(err?.message ?? "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-stretch"
      style={{ backgroundColor: "#1B1F22" }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1B1F22 0%, #2D2015 40%, #3A2910 70%, #1B1F22 100%)",
        }}
      >
        {/* Ornamental glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.15) 0%, transparent 60%)",
          }}
        />
        {/* Geometric lines */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 400 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="200"
            cy="350"
            r="200"
            stroke="#C9A84C"
            strokeWidth="0.5"
          />
          <circle
            cx="200"
            cy="350"
            r="150"
            stroke="#C9A84C"
            strokeWidth="0.5"
          />
          <circle
            cx="200"
            cy="350"
            r="100"
            stroke="#C9A84C"
            strokeWidth="0.3"
          />
          <line
            x1="0"
            y1="350"
            x2="400"
            y2="350"
            stroke="#C9A84C"
            strokeWidth="0.3"
          />
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="700"
            stroke="#C9A84C"
            strokeWidth="0.3"
          />
        </svg>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(201,168,76,0.2)",
              border: "1px solid rgba(201,168,76,0.4)",
            }}
          >
            <PenLine className="w-5 h-5" style={{ color: "#C9A84C" }} />
          </div>
          <span
            className="font-display text-xl font-bold tracking-wide"
            style={{ color: "#C9A84C" }}
          >
            Shero Shayari
          </span>
        </div>

        {/* Quote block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10"
        >
          <div
            className="w-8 h-1 rounded mb-6"
            style={{ backgroundColor: "#C9A84C" }}
          />
          <p
            className="font-urdu text-xl leading-loose mb-4"
            style={{ color: "rgba(201,168,76,0.9)", direction: "rtl" }}
          >
            {quote.text}
          </p>
          <p className="text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
            {quote.author}
          </p>
        </motion.div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Poets & dreamers welcome
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <PenLine className="w-5 h-5" style={{ color: "#C9A84C" }} />
          <span
            className="font-display text-lg font-bold"
            style={{ color: "#C9A84C" }}
          >
            Shero Shayari
          </span>
        </div>

        {/* II Connect prompt */}
        {!identity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mb-6 p-4 rounded-xl border text-sm text-center"
            style={{
              backgroundColor: "rgba(201,168,76,0.08)",
              borderColor: "rgba(201,168,76,0.3)",
              color: "rgba(201,168,76,0.9)",
            }}
          >
            <p className="mb-3 font-medium">
              Pehle Internet Identity se connect karein
            </p>
            <Button
              onClick={iiLogin}
              disabled={isInitializing || isLoggingIn}
              size="sm"
              className="font-semibold"
              style={{ backgroundColor: "#C9A84C", color: "#1B1F22" }}
              data-ocid="auth.connect_ii.button"
            >
              {isInitializing || isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Connect Identity
            </Button>
          </motion.div>
        )}

        {/* Tab toggle */}
        <div
          className="w-full max-w-md flex rounded-xl p-1 mb-8"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setLoginError("");
              }}
              data-ocid={`auth.${m}.tab`}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: mode === m ? "#C9A84C" : "transparent",
                color: mode === m ? "#1B1F22" : "rgba(255,255,255,0.5)",
              }}
            >
              {m === "signup" ? "Sign Up" : "Login"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === "signup" ? (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSignUp}
              className="w-full max-w-md space-y-5"
              data-ocid="auth.signup.panel"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-1">
                  Poet ke roop mein aayein
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Apna account banaiye aur shayari share karein
                </p>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="auth.profile_pic.upload_button"
                  className="relative w-20 h-20 rounded-full overflow-hidden transition-all hover:opacity-90"
                  style={{
                    border: "2px solid rgba(201,168,76,0.5)",
                    background: profilePicPreview
                      ? undefined
                      : "rgba(201,168,76,0.1)",
                  }}
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <Camera
                        className="w-6 h-6"
                        style={{ color: "#C9A84C" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "rgba(201,168,76,0.7)" }}
                      >
                        Photo
                      </span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Full Name *
                </Label>
                <Input
                  required
                  placeholder="Aapka naam"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  data-ocid="auth.name.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Email *
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="aap@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  data-ocid="auth.email.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Password *
                </Label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  data-ocid="auth.password.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Confirm Password *
                </Label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                  }
                  data-ocid="auth.confirm_password.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Date of Birth
                  </Label>
                  <Input
                    type="date"
                    value={form.dob}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dob: e.target.value }))
                    }
                    data-ocid="auth.dob.input"
                    className="bg-white/5 border-white/10 text-white focus:border-gold/50 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Gender
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                  >
                    <SelectTrigger
                      data-ocid="auth.gender.select"
                      className="bg-white/5 border-white/10 text-white focus:border-gold/50"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-white/10">
                      {["Male", "Female", "Other", "Prefer not to say"].map(
                        (g) => (
                          <SelectItem
                            key={g}
                            value={g}
                            className="text-white focus:bg-gold/20 focus:text-gold"
                          >
                            {g}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nationality */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Nationality
                </Label>
                <Input
                  placeholder="e.g. Indian, Pakistani"
                  value={form.nationality}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nationality: e.target.value }))
                  }
                  data-ocid="auth.nationality.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Bio{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>
                    ({form.bio.length}/200)
                  </span>
                </Label>
                <Textarea
                  placeholder="Apne baare mein kuch likhein..."
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      bio: e.target.value.slice(0, 200),
                    }))
                  }
                  data-ocid="auth.bio.textarea"
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !identity}
                data-ocid="auth.signup.submit_button"
                className="w-full py-3 font-bold text-sm tracking-wide"
                style={{ backgroundColor: "#C9A84C", color: "#1B1F22" }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

              <p
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  data-ocid="auth.goto_login.button"
                  className="font-medium hover:underline"
                  style={{ color: "#C9A84C" }}
                >
                  Login
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleLogin}
              className="w-full max-w-md space-y-5"
              data-ocid="auth.login.panel"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-1">
                  Khush Amdeed
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Apni shayari duniya mein wapas aayein
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Email
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="aap@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  data-ocid="auth.login_email.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Password
                </Label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  data-ocid="auth.login_password.input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50"
                />
              </div>

              {loginError && (
                <div
                  data-ocid="auth.login.error_state"
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(208,106,115,0.15)",
                    color: "#D06A73",
                    border: "1px solid rgba(208,106,115,0.3)",
                  }}
                >
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !identity}
                data-ocid="auth.login.submit_button"
                className="w-full py-3 font-bold text-sm tracking-wide"
                style={{ backgroundColor: "#C9A84C", color: "#1B1F22" }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <p
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Account nahi hai?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  data-ocid="auth.goto_signup.button"
                  className="font-medium hover:underline"
                  style={{ color: "#C9A84C" }}
                >
                  Sign Up
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
