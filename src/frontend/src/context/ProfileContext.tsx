import type { Profile } from "@/backend";
import { useActor } from "@/hooks/useActor";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProfileContextValue {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  setProfile: () => {},
  isLoading: true,
  refetch: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      const p = await actor.getCallerUserProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!isFetching && actor) {
      fetchProfile();
    } else if (!isFetching && !actor) {
      setIsLoading(false);
    }
  }, [actor, isFetching, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, isLoading, refetch: fetchProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
