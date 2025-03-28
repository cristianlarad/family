import React from "react";
import SendMessage from "@/components/messages/SendMessage";
import FetchMessages from "@/components/messages/FerchMessages";
import Perfil from "@/components/Interface/Perfil";

const ChatPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="sticky p-3 rounded-lg shadow-2xs border-1  bg-muted z-30 top-0">
          <Perfil />
        </div>
        <FetchMessages />
        <div className="sticky p-3 rounded-lg shadow-2xs border-1  bg-muted z-30 bottom-0">
          <SendMessage />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
