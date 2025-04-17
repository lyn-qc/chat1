import { Id } from "convex/_generated/dataModel"
import { UseGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
interface ProfileProps {
  memberId:Id<"members">;
  onClose: () => void;
}

export default function Profile({
  memberId,
  onClose
}: ProfileProps) {
    const {data: member, isLoading: loadingMember} = UseGetMember({id:memberId})
    const avatarFallback = member?.user.name?.[0] ?? "M"
     if (loadingMember) {
        return (
          <div className="h-full flex flex-col">
            <div className="h-[49px] flex justify-between items-center px-4 border-b">
              <p className="text-lg font-bold">个人资料</p>
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
    
      if (!member) {
        return (
          <div className="h-full flex flex-col">
            <div className="h-[49px] flex justify-between items-center px-4 border-b">
              <p className="text-lg font-bold">个人资料</p>
              <Button onClick={onClose} size="sm" variant="ghost">
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
              <AlertTriangle className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">未找到个人资料</p>
            </div>
          </div>
        );
      }
  return (
    <div className="h-full flex flex-col">
            <div className="h-[49px] flex justify-between items-center px-4 border-b">
              <p className="text-lg font-bold">个人资料</p>
              <Button onClick={onClose} size="sm" variant="ghost">
                <XIcon className="size-5 stroke-[1.5]" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center">
            <Avatar className="max-w-[260px] max-h-[260px] rounded-md mt-2 overflow-hidden">
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback className="bg-sky-500 text-white font-bold w-[260px] h-[260px] aspect-square flex items-center justify-center text-6xl">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>
          </div>
  )
}
