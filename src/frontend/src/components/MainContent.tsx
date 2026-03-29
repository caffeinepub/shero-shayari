import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import ChatList from "./ChatList";
import PostsGrid from "./PostsGrid";
import ProfileView from "./ProfileView";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileView />
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <PostsGrid />
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          <ChatList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
