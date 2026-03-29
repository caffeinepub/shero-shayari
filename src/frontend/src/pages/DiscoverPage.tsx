import { ShayariCard } from "@/components/ShayariCard";
import { poets, shayariList } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function DiscoverPage() {
  function getPoet(poetId: string) {
    return poets.find((p) => p.id === poetId) ?? poets[0];
  }

  const trending = [...shayariList]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Discover
        </h1>
        <p className="text-muted-foreground mb-12">
          Explore trending poets and most-loved shayari
        </p>
      </motion.div>

      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Featured Poets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {poets.map((poet, i) => (
            <motion.div
              key={poet.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`discover.poet.item.${i + 1}`}
            >
              <Link to="/profile">
                <div className="card-dark p-6 text-center hover:border-gold/60 transition-all cursor-pointer group">
                  <img
                    src={poet.avatar}
                    alt={poet.name}
                    className="w-16 h-16 rounded-full object-cover gold-ring mx-auto mb-4 group-hover:scale-105 transition-transform"
                  />
                  <p className="font-semibold text-foreground mb-0.5">
                    {poet.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {poet.handle}
                  </p>
                  <p className="text-sm text-gold">
                    {poet.followers.toLocaleString()} followers
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full py-1.5 text-xs rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                    data-ocid={`discover.poet.button.${i + 1}`}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Trending Shayari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trending.map((s, i) => (
            <ShayariCard
              key={s.id}
              shayari={s}
              poet={getPoet(s.poetId)}
              index={i}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
