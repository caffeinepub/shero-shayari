import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, LogIn } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to PerfectFriend</CardTitle>
          <CardDescription className="text-base">
            Please log in to access your profile and connect with friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={loginStatus === "logging-in"}
            className="w-full rounded-full"
            size="lg"
          >
            {loginStatus === "logging-in" ? (
              "Logging in..."
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Login with Internet Identity
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your data is secured on the Internet Computer blockchain
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
