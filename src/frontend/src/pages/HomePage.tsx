import { ShayariCard } from "@/components/ShayariCard";
import { poets, shayariList } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { Feather, PenLine, Star, Users } from "lucide-react";
import { motion } from "motion/react";

export function HomePage() {
  const featuredShayari = shayariList.slice(0, 6);
  const popularPoets = poets.slice(0, 3);

  function getPoet(poetId: string) {
    return poets.find((p) => p.id === poetId) ?? poets[0];
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/generated/hero-poet.dim_800x600.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/75 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <Feather className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm tracking-widest uppercase font-medium">
                Poetry Platform
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-none tracking-tight mb-6">
              SHERO
              <br />
              <span className="text-gold">SHAYARI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed mb-8">
              Where the heart speaks in verse. Share your ghazals, nazms, and
              dohas. Discover the timeless beauty of Urdu and Hindi poetry.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/feed">
                <button
                  type="button"
                  data-ocid="hero.get_started.button"
                  className="px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "#B6914D", color: "#1B1F22" }}
                >
                  Get Started
                </button>
              </Link>
              <Link to="/compose">
                <button
                  type="button"
                  data-ocid="hero.compose.button"
                  className="px-8 py-3 rounded-lg font-semibold text-sm border border-gold/50 text-gold hover:bg-gold/10 transition-all"
                >
                  Write Shayari
                </button>
              </Link>
            </div>

            <div className="flex gap-8 mt-10">
              {[
                { n: "50K+", l: "Poems" },
                { n: "12K+", l: "Poets" },
                { n: "200K+", l: "Readers" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-bold text-gold">{s.n}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Home Feed */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-white">
            Home Feed
          </h2>
          <Link
            to="/feed"
            className="text-sm text-gold hover:text-gold/80 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredShayari.map((s, i) => (
            <ShayariCard
              key={s.id}
              shayari={s}
              poet={getPoet(s.poetId)}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Lower section */}
      <section className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Popular Poet Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popularPoets.map((poet, i) => (
                <motion.div
                  key={poet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`poet.item.${i + 1}`}
                >
                  <Link to="/profile">
                    <div className="card-dark p-5 text-center hover:border-gold/60 transition-all cursor-pointer group">
                      <img
                        src={poet.avatar}
                        alt={poet.name}
                        className="w-14 h-14 rounded-full object-cover gold-ring mx-auto mb-3 group-hover:scale-105 transition-transform"
                      />
                      <p className="font-semibold text-sm text-foreground truncate">
                        {poet.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {poet.handle}
                      </p>
                      <p className="text-xs text-gold mt-2">
                        {poet.followers.toLocaleString()} followers
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card-dark p-6 flex items-center gap-5 hover:border-gold/60 transition-all">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <PenLine className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-white mb-1">
                Compose Your Shayari
              </h3>
              <p className="text-sm text-muted-foreground">
                Share your feelings through the art of poetry. Write in Urdu or
                Hindi.
              </p>
            </div>
            <Link to="/compose">
              <button
                type="button"
                data-ocid="compose.open_modal_button"
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: "#CFA2A8", color: "#1B1F22" }}
              >
                Compose
              </button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            User Profile
          </h2>
          <div className="card-dark p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={poets[2].avatar}
                alt={poets[2].name}
                className="w-20 h-20 rounded-full object-cover mx-auto"
                style={{ boxShadow: "0 0 0 3px #C8A35A, 0 0 0 5px #1B1F22" }}
              />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              {poets[2].name}
            </h3>
            <p className="text-sm text-gold mb-2">{poets[2].handle}</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {poets[2].bio}
            </p>
            <div className="flex justify-center gap-6 mb-5">
              <div>
                <p className="text-xl font-bold text-white">{poets[2].posts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="w-px bg-gold/20" />
              <div>
                <p className="text-xl font-bold text-white">
                  {poets[2].followers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="w-px bg-gold/20" />
              <div>
                <p className="text-xl font-bold text-white">
                  {poets[2].following}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <Link to="/profile">
              <button
                type="button"
                data-ocid="profile.view.button"
                className="w-full py-2 rounded-lg text-sm font-semibold border border-gold/50 text-gold hover:bg-gold/10 transition-colors"
              >
                <Users className="w-4 h-4 inline mr-2" />
                View Profile
              </button>
            </Link>
          </div>

          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "#mohabbat",
                "#dard",
                "#zindagi",
                "#dosti",
                "#urdu",
                "#hindi",
                "#shayari",
                "#ghazal",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-gold/30 text-gold/80 hover:bg-gold/10 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
