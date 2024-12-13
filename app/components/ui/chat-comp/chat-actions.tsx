import { PauseCircle, RefreshCw } from "lucide-react";
import { Button } from "../utility/button";
import { ChatHandler } from "./chat.interface";

interface ChatActionsProps extends Pick<ChatHandler, "stop" | "reload"> {
  showReload?: boolean;
  showStop?: boolean;
}

const ChatActions: React.FC<ChatActionsProps> = ({ stop, reload, showReload, showStop }) => (
  <div className="space-x-4">
    {showStop && (
      <Button variant="outline" size="sm" onClick={stop}>
        <PauseCircle className="mr-2 h-4 w-4" />
        Stop loading
      </Button>
    )}
    {showReload && (
      <Button variant="outline" size="sm" onClick={reload}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Reload Chats
      </Button>
    )}
  </div>
);

export default ChatActions;
