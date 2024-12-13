import { Message } from "ai";

export interface ChatHandler {
  setKey: (
    key: number,
  ) => void;
  Key: number;
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    ops?: {
      data?: any;
    },
  ) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsChatEdit?: (isChatEdit: boolean) => void;
  isChatEdit?: boolean;
  reload?: () => void;
  stop?: () => void;
  onFileUpload?: (file: File) => Promise<void>;
  onFileError?: (errMsg: string) => void;
}
