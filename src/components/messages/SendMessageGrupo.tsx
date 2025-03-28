import type React from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/database/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, PaperclipIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SendMessageGrupo = () => {
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);

    const insert = await supabase.from("message").insert({
      grupo: true,
      envioID: currentUser?.id,
      envioUser: currentUser,
      content: newMessage,
      created_at: new Date().toISOString(),
    });

    if (insert.error) {
      console.error("Error al enviar mensaje:", insert.error);
    }

    setNewMessage("");
    setIsSending(false);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex bg-muted rounded-lg items-center px-2 gap-x-2"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <PaperclipIcon className="h-5 w-5" />
              <span className="sr-only">Adjuntar archivo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adjuntar archivo</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="pr-12 py-6  bg-muted/50 border-muted focus-visible:ring-primary/20"
          disabled={isSending}
        />
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={isSending || !newMessage.trim()}
        className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
      >
        <SendIcon className="h-5 w-5" />
        <span className="sr-only">Enviar</span>
      </Button>
    </form>
  );
};

export default SendMessageGrupo;
