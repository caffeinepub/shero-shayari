import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Principal } from "@dfinity/principal";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Conversation,
  type Message,
  useGetConversation,
  useSendMessage,
} from "../hooks/useQueries";

interface ChatWindowProps {
  conversation: Conversation;
  otherParticipant: Principal | null;
  onBack: () => void;
}

export default function ChatWindow({
  conversation,
  otherParticipant,
  onBack,
}: ChatWindowProps) {
  const { identity } = useInternetIdentity();
  const { data: liveConversation } = useGetConversation(otherParticipant);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = liveConversation || conversation;
  const messageCount = currentConversation.messages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !otherParticipant) return;

    sendMessage(
      { recipient: otherParticipant, content: messageText.trim() },
      {
        onSuccess: () => {
          setMessageText("");
        },
      },
    );
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isMyMessage = (message: Message) => {
    if (!identity) return false;
    return message.sender.toString() === identity.getPrincipal().toString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-1 text-sm font-bold text-primary-foreground">
              {otherParticipant?.toString().substring(0, 2).toUpperCase()}
            </div>
            <CardTitle className="text-lg truncate">
              {otherParticipant?.toString()}
            </CardTitle>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {currentConversation.messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              currentConversation.messages.map((message) => {
                const isMine = isMyMessage(message);
                return (
                  <div
                    key={`${message.sender.toString()}-${message.timestamp}`}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMine
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <CardContent className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              disabled={isPending}
            />
            <Button type="submit" disabled={!messageText.trim() || isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
