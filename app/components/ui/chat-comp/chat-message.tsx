import { Check, Copy, Edit, Save, X, Loader } from "lucide-react"; // Import Loader icon for loading state
import { Message } from "ai";
import { Fragment, useState } from "react";
import { Button } from "../utility/button";
import ChatAvatar from "./chat-avatar";
import { ChatImage } from "./chat-image";
import { ChatSources } from "./chat-sources";
import {
  AnnotationData,
  ImageData,
  MessageAnnotation,
  MessageAnnotationType,
  SourceData,
} from "./index";
import Markdown from "./markdown";
import { useCopyToClipboard } from "./use-copy-to-clipboard";
import axiosInstance from "@/app/helper/axiosInstance";

type ContentDiplayConfig = {
  order: number;
  component: JSX.Element | null;
};

function getAnnotationData<T extends AnnotationData>(
  annotations: MessageAnnotation[],
  type: MessageAnnotationType,
): T | undefined {
  return annotations.find((a) => a.type === type)?.data as T | undefined;
}

function ChatMessageContent({ message }: { message: Message }) {
  const annotations = message.annotations as MessageAnnotation[] | undefined;
  if (!annotations?.length) return <Markdown content={message.content} />;

  const imageData = getAnnotationData<ImageData>(
    annotations,
    MessageAnnotationType.IMAGE,
  );
  const sourceData = getAnnotationData<SourceData>(
    annotations,
    MessageAnnotationType.SOURCES,
  );

  const contents: ContentDiplayConfig[] = [
    {
      order: -1,
      component: imageData ? <ChatImage data={imageData} /> : null,
    },
    {
      order: 0,
      component: <Markdown content={message.content} />,
    },
    {
      order: 1,
      component: sourceData ? <ChatSources data={sourceData} /> : null,
    },
  ];

  return (
    <div className="flex-1 gap-4 flex flex-col">
      {contents
        .sort((a, b) => a.order - b.order)
        .map((content, index) => (
          <Fragment key={index}>{content.component}</Fragment>
        ))}
    </div>
  );
}

type ChatMessageProps = {
  chatMessage: Message;
  setIsChatEdit: (isChatEdit: boolean) => void;
  isChatEdit: boolean;
};

export default function ChatMessage({
  chatMessage,
  setIsChatEdit,
  isChatEdit,
}: ChatMessageProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(chatMessage.id);
  const [newQuery, setNewQuery] = useState(chatMessage.content);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    try {
      await axiosInstance.put(`chatmate/api/query/${id}/edit_query/`, { query: newQuery }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setIsChatEdit(!isChatEdit);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing message:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setId(chatMessage.id);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewQuery(chatMessage.content); // Revert to the original content
  };

  return (
    <div className="flex items-start gap-4 pr-5 pt-5">
      <ChatAvatar role={chatMessage.role} />
      <div className="group flex flex-1 justify-between gap-2">
        {isEditing ? (
          <input
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        ) : (
          <ChatMessageContent message={chatMessage} />
        )}
        <div className="flex space-x-2">
          <Button
            onClick={() => copyToClipboard(chatMessage.content)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          {chatMessage.role === "user" && (
            <>
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSubmit}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    disabled={isLoading} // Disable button when loading
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin" /> // Show loading spinner
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
