import type { Poet, Shayari } from "@/data/mockData";
import { categoryColors } from "@/data/mockData";
import { Heart, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ShayariCardProps {
  shayari: Shayari;
  poet: Poet;
  index?: number;
}

export function ShayariCard({ shayari, poet, index = 0 }: ShayariCardProps) {
  const [liked, setLiked] = useState(shayari.liked);
  const [likeCount, setLikeCount] = useState(shayari.likes);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  const catClass = categoryColors[shayari.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card-dark p-5 flex flex-col gap-4 group hover:border-gold/60 transition-all duration-300"
      data-ocid={`shayari.item.${index + 1}`}
    >
      {/* Poet info */}
      <div className="flex items-center gap-3">
        <img
          src={poet.avatar}
          alt={poet.name}
          className="w-9 h-9 rounded-full object-cover gold-ring"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {poet.name}
          </p>
          <p className="text-xs text-muted-foreground">{poet.handle}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full border font-medium ${catClass}`}
        >
          {shayari.category}
        </span>
      </div>

      {/* Shayari text */}
      <div className="flex-1">
        <p
          className={`leading-relaxed text-foreground/90 ${
            shayari.language === "urdu"
              ? "urdu-text text-right"
              : "font-sans text-base leading-7"
          }`}
        >
          {shayari.text}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {shayari.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-gold/60 hover:text-gold cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-gold/10">
        <button
          type="button"
          onClick={handleLike}
          data-ocid={`shayari.toggle.${index + 1}`}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: liked ? "#D06A73" : "#B7BCC0" }}
        >
          <Heart
            className="w-4 h-4"
            fill={liked ? "#D06A73" : "none"}
            stroke={liked ? "#D06A73" : "currentColor"}
          />
          <span>{likeCount.toLocaleString()}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{shayari.shares}</span>
        </button>
        <span className="ml-auto text-xs text-muted-foreground/50">
          {shayari.createdAt}
        </span>
      </div>
    </motion.div>
  );
}
