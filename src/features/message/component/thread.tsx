import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetMessageo } from "@/features/message/api/use-get-message";
import { useGetMessage } from "@/features/message/api/use-get-messages";
import { useCurrentMember } from "@/features/member/api/use-current-member";
import { useCreateMessage } from "@/features/message/api/use-create-message";
import { useGenerateUpload } from "@/features/upload/api/use-generate-upload-url";

import { Id } from "../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const formateDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isToday(date)) return "今天"
  if (isYesterday(date)) return "昨天"
  return format(date, 'yyyy年MM月dd日')
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUpload();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessageo({
    id: messageId,
  });
  const { results, status, loadMore } = useGetMessage({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("URL not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>,
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="sm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="sm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">回复</p>
        <Button onClick={onClose} size="sm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formateDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];
              const isCompact =
                previousMessage &&
                previousMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(previousMessage._creationTime),
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  authorImage={message.user.image}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updateAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                >
                </Message>
              );
            })}
          </div>
        ))}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 },
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          key={message._id}
          id={message._id}
          memberId={message.memberId}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          authorImage={message.user.image}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updateAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        >
        </Message>
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={isPending}
          placeholder="Reply.."
        />
      </div>
    </div>
  );
};
