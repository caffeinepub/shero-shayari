import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@dfinity/principal";
import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type Conversation, useGetAllConversations } from "../hooks/useQueries";
import ChatWindow from "./ChatWindow";

export default function ChatList() {
  const { identity } = useInternetIdentity();
  const { data: conversations = [], isLoading } = useGetAllConversations();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatPrincipal, setNewChatPrincipal] = useState("");
  const [principalError, setPrincipalError] = useState("");

  const handleStartNewChat = () => {
    try {
      const principal = Principal.fromText(newChatPrincipal.trim());
      if (
        identity &&
        principal.toString() === identity.getPrincipal().toString()
      ) {
        setPrincipalError("You cannot chat with yourself");
        return;
      }
      setSelectedConversation({
        participants: [identity!.getPrincipal(), principal],
        messages: [],
      });
      setIsNewChatOpen(false);
      setNewChatPrincipal("");
      setPrincipalError("");
    } catch (_error) {
      setPrincipalError("Invalid principal ID");
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!identity) return null;
    const myPrincipal = identity.getPrincipal().toString();
    return conv.participants.find((p) => p.toString() !== myPrincipal) || null;
  };

  const getLastMessage = (conv: Conversation) => {
    if (conv.messages.length === 0) return "No messages yet";
    const lastMsg = conv.messages[conv.messages.length - 1];
    return lastMsg.content.length > 50
      ? `${lastMsg.content.substring(0, 50)}...`
      : lastMsg.content;
  };

  if (selectedConversation) {
    const otherParticipant = getOtherParticipant(selectedConversation);
    return (
      <ChatWindow
        conversation={selectedConversation}
        otherParticipant={otherParticipant as Principal | null}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">User Principal ID</Label>
                <Input
                  id="principal"
                  value={newChatPrincipal}
                  onChange={(e) => {
                    setNewChatPrincipal(e.target.value);
                    setPrincipalError("");
                  }}
                  placeholder="Enter principal ID"
                />
                {principalError && (
                  <p className="text-sm text-destructive">{principalError}</p>
                )}
              </div>
              <Button
                onClick={handleStartNewChat}
                disabled={!newChatPrincipal.trim()}
                className="w-full"
              >
                Start Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {conversations.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No conversations yet. Start a new chat!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const otherParticipant = getOtherParticipant(conv);
            if (!otherParticipant) return null;

            return (
              <Card
                key={otherParticipant.toString()}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedConversation(conv)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-1 text-lg font-bold text-primary-foreground">
                    {otherParticipant.toString().substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {otherParticipant.toString()}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {getLastMessage(conv)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
