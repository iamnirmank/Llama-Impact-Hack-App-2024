"use client";
import { useCustomChat } from "../../../helper/customUseChat";
import { ChatInput, ChatMessages } from "../chat-comp";
import "./chat-section.css";

// Main chat section component
const MainChatSection = ({
  sidebarOpen,
  messages,
  isLoading,
  reload,
  stop,
  setIsChatEdit,
  isChatEdit,
  input,
  handleSubmit,
  handleInputChange,
  setKey,
  Key,
}: any) => (
  <div className={`chat-section flex-1 flex flex-col space-y-4 p-4 bg-white shadow-lg rounded-lg relative transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-100 pl-4" : "ml-0 pl-0"}`}>
    <ChatMessages
      messages={messages}
      isLoading={isLoading}
      reload={reload}
      stop={stop}
      setIsChatEdit={setIsChatEdit}
      isChatEdit={isChatEdit}
    />
    <ChatInput
      setKey={setKey}
      Key={Key}
      input={input}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      isLoading={isLoading}
      multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-turbo"}
    />
  </div>
);

export default function ChatSection() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    setIsChatEdit,
    isChatEdit,
    Key,
    setKey,
  } = useCustomChat();

  return (
    <div className="flex h-screen bg-gray-100">
      <MainChatSection
        messages={messages}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
        setIsChatEdit={setIsChatEdit}
        isChatEdit={isChatEdit}
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        setKey={setKey}
        Key={Key}
      />
    </div>
  );
}
