import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/app/helper/axiosInstance";

// Define types for messages and responses
interface Message {
  id: string;
  content: string;
  role: "function" | "user" | "system" | "data" | "assistant" | "tool";
  createdAt?: Date;
  annotations?: any[];
}

interface UseCustomChat {
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reload: () => void;
  stop: () => void;
  setIsChatEdit: (isChatEdit: boolean) => void;
  isChatEdit: boolean;
  Key: number;
  setKey: (key: number) => void;
}

export function useCustomChat(): UseCustomChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatEdit, setIsChatEdit] = useState<boolean>(false);
  const [Key, setKey] = useState(0);

  const accessToken = localStorage.getItem("access_token");

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "chatmate/api/query/process_chat/",
        { query: input },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: response.data.body.id, content: response.data.body.query_text, createdAt: response.data.body.created_at, role: "user" },
        { id: response.data.body.id, content: response.data.body.response_text, createdAt: response.data.body.created_at, role: "system" },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error submitting chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [input, accessToken]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`chatmate/api/query/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const fetchedMessages = res.data.body.flatMap((message: any) => [
          { id: message.id, content: message.query_text, role: "user", createdAt: new Date(message.created_at) },
          { id: message.id, content: message.response_text, role: "system", createdAt: new Date(message.created_at) },
        ]);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [isChatEdit, accessToken]);

  const reload = useCallback(() => {
    setKey((Key) => Key + 1);
  }, []);

  return {
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
  };
}
