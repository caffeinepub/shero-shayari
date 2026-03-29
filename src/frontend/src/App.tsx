import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { AuthPage } from "@/pages/AuthPage";
import { ComposePage } from "@/pages/ComposePage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { FeedPage } from "@/pages/FeedPage";
import { HomePage } from "@/pages/HomePage";
import { ProfilePage } from "@/pages/ProfilePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const rootRoute = createRootRoute({
  component: () => (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#1B1F22" }}
    >
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster theme="dark" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feed",
  component: FeedPage,
});
const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const composeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compose",
  component: ComposePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  feedRoute,
  discoverRoute,
  profileRoute,
  composeRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function SplashScreen() {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#1B1F22",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Radial gold glow */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", position: "relative" }}
      >
        {/* Urdu title */}
        <div
          style={{
            fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
            fontSize: "clamp(52px, 10vw, 88px)",
            color: "#C9A84C",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            textShadow:
              "0 0 40px rgba(201,168,76,0.45), 0 2px 12px rgba(0,0,0,0.6)",
            direction: "rtl",
            marginBottom: "8px",
          }}
        >
          شیرو شاعری
        </div>

        {/* English subtitle */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(18px, 3vw, 26px)",
            color: "#C9A84C",
            letterSpacing: "0.18em",
            fontWeight: 400,
            textTransform: "uppercase",
            opacity: 0.85,
            marginBottom: "20px",
          }}
        >
          Shero Shaiyri
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            width: "220px",
            margin: "0 auto 18px",
            transformOrigin: "center",
          }}
        />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "rgba(201,168,76,0.55)",
            letterSpacing: "0.12em",
            fontStyle: "italic",
          }}
        >
          Alfaazon ki duniya
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { identity } = useInternetIdentity();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      {!showSplash &&
        (isLoading ? (
          <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "#1B1F22" }}
          >
            <div className="text-center">
              <Loader2
                className="w-8 h-8 animate-spin mx-auto mb-3"
                style={{ color: "#C9A84C" }}
              />
              <p className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>
                Loading...
              </p>
            </div>
          </div>
        ) : !identity || !profile ? (
          <>
            <AuthPage />
            <Toaster theme="dark" />
          </>
        ) : (
          <RouterProvider router={router} />
        ))}
    </>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}
