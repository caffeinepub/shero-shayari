import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/data/mockData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, PenLine, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const categories: Category[] = [
  "Mohabbat",
  "Dard",
  "Zindagi",
  "Dosti",
  "Motivational",
];

export function ComposePage() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [language, setLanguage] = useState<"urdu" | "hindi">("urdu");
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !category) {
      toast.error("Please fill in both the shayari text and category.");
      return;
    }
    toast.success("Your shayari has been shared! ✨");
    setTimeout(() => navigate({ to: "/feed" }), 1200);
  }

  if (!identity) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
          data-ocid="compose.login.panel"
        >
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <PenLine className="w-8 h-8 text-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Shayari Share Karein
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Shayari share karne ke liye pehle login karein
          </p>
          <button
            type="button"
            onClick={login}
            data-ocid="compose.login.button"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ backgroundColor: "#C8A35A", color: "#1B1F22" }}
          >
            <LogIn className="w-4 h-4" />
            Login karein
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Compose Shayari
            </h1>
            <p className="text-muted-foreground text-sm">
              Pour your heart into words
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="card-dark p-8 space-y-6"
        data-ocid="compose.modal"
      >
        {/* Language toggle */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Language
          </p>
          <div className="flex gap-3">
            {(["urdu", "hindi"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                data-ocid={`compose.${lang}.toggle`}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                  language === lang
                    ? "bg-gold/20 border-gold text-gold"
                    : "border-gold/20 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {lang === "urdu" ? "اردو Urdu" : "हिंदी Hindi"}
              </button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div>
          <label
            htmlFor="shayari-text"
            className="block text-sm font-medium text-muted-foreground mb-3"
          >
            Your Shayari
          </label>
          <Textarea
            id="shayari-text"
            data-ocid="compose.textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              language === "urdu"
                ? "اپنی شاعری یہاں لکھیں..."
                : "अपनी शायरी यहाँ लिखें..."
            }
            className={`min-h-[160px] bg-charcoal border border-gold/30 focus:border-gold text-foreground placeholder:text-muted-foreground/50 text-base resize-none ${
              language === "urdu" ? "urdu-text text-right" : "font-sans"
            }`}
            dir={language === "urdu" ? "rtl" : "ltr"}
          />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {text.length} characters
          </p>
        </div>

        {/* Category */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Category
          </p>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as Category)}
          >
            <SelectTrigger
              data-ocid="compose.select"
              className="bg-charcoal border-gold/30 focus:border-gold text-foreground"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal-card border-gold/30">
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="text-foreground hover:bg-gold/10"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="compose-tags"
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            Add Tags (optional)
          </label>
          <input
            id="compose-tags"
            data-ocid="compose.input"
            type="text"
            placeholder="#mohabbat #dil #shayari"
            className="w-full px-4 py-2.5 text-sm bg-charcoal border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          data-ocid="compose.submit_button"
          className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: "#C8A35A", color: "#1B1F22" }}
        >
          <Send className="w-4 h-4" />
          Share Shayari
        </button>
      </motion.form>
    </main>
  );
}
