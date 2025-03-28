import Grupo from "@/components/Interface/Grupo";
import FetchMessagesGrupo from "@/components/messages/FetchMessagesGrupo";
import SendMessageGrupo from "@/components/messages/SendMessageGrupo";

const ChatGrupo = () => {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-4">
          <div className="sticky p-3 rounded-lg shadow-2xs border-1  bg-muted z-30 top-0">
            <Grupo />
          </div>
          <FetchMessagesGrupo />
          <div className="sticky p-3 rounded-lg shadow-2xs border-1  bg-muted z-30 bottom-0">
            <SendMessageGrupo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGrupo;
