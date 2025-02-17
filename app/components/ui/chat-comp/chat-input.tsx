import { useState } from "react";
import { Button } from "../utility/button";
import FileUploader from "../utility/file-uploader";
import { Input } from "../utility/input";
import UploadImagePreview from "../utility/upload-image-preview";
import { ChatHandler } from "./chat.interface";
import axiosInstance from "@/app/helper/axiosInstance";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | "setKey"
    | "Key"
    | "isLoading"
    | "input"
    | "onFileUpload"
    | "onFileError"
    | "handleSubmit"
    | "handleInputChange"
  > & {
    multiModal?: boolean;
  },
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (imageUrl) {
      props.handleSubmit(e, {
        data: { imageUrl: imageUrl },
      });
      setImageUrl(null);
      return;
    }
    props.handleSubmit(e);
  };

  const onRemovePreviewImage = () => setImageUrl(null);

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    setImageUrl(base64);
  };

  const handleUploadFile = async (file: File) => {
    try {
      if (props.multiModal && file.type.startsWith("image/")) {
        return await handleUploadImageFile(file);
      }

      const formData = new FormData();
      formData.append("title", file.name);
      formData.append("file", file);

      const response = await axiosInstance.post('chatmate/api/document/upload_file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization : `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      props.onFileUpload?.(response.data);
      props.setKey((props.Key || 0) + 1); 
    } catch (error: any) {
      props.onFileError?.(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-white p-4 shadow-xl space-y-4"
    >
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={onRemovePreviewImage} />
      )}
      <div className="flex w-full items-start justify-between gap-4 ">
        <Input
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        <FileUploader
          onFileUpload={handleUploadFile}
          onFileError={props.onFileError}
        />
        <Button type="submit" disabled={props.isLoading}>
          Send message
        </Button>
      </div>
    </form>
  );
}
