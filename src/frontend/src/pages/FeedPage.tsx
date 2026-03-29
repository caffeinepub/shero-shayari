import { ShayariCard } from "@/components/ShayariCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Category, poets, shayariList } from "@/data/mockData";
import { motion } from "motion/react";
import { useState } from "react";

const categories: (Category | "All")[] = [
  "All",
  "Mohabbat",
  "Dard",
  "Zindagi",
  "Dosti",
  "Motivational",
];

export function FeedPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered =
    activeCategory === "All"
      ? shayariList
      : shayariList.filter((s) => s.category === activeCategory);

  function getPoet(poetId: string) {
    return poets.find((p) => p.id === poetId) ?? poets[0];
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Poetry Feed
        </h1>
        <p className="text-muted-foreground mb-8">
          Immerse yourself in the world of Urdu & Hindi poetry
        </p>
      </motion.div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as Category | "All")}
        className="mb-8"
      >
        <TabsList
          className="flex flex-wrap gap-1 h-auto bg-charcoal-card border border-gold/20 p-1 rounded-lg"
          data-ocid="feed.filter.tab"
        >
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-xs px-3 py-1.5 data-[state=active]:bg-gold data-[state=active]:text-charcoal rounded"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Feed */}
      <div className="space-y-5">
        {filtered.length === 0 ? (
          <div
            data-ocid="feed.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            No shayari found for this category yet.
          </div>
        ) : (
          filtered.map((s, i) => (
            <ShayariCard
              key={s.id}
              shayari={s}
              poet={getPoet(s.poetId)}
              index={i}
            />
          ))
        )}
      </div>
    </main>
  );
}
