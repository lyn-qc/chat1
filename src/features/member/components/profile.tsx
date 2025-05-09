import { Id } from "convex/_generated/dataModel"
import { UseGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
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
            <Avatar className="max-w-[160px] max-h-[160px] rounded-md mt-2 overflow-hidden">
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback className="bg-sky-500 text-white font-bold w-[160px] h-[160px] aspect-square flex items-center justify-center text-6xl">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col p-4">
                    <p className="text-xl font-bold">{member.user.name}</p>
            </div>
            <Separator></Separator>
            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">联系信息</p>
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon className="size-4"></MailIcon>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground">
                            Email Address
                        </p>
                        <Link href={`mailto:${member.user.email}`}
                         className="text-sm hover:underline text-[#1264a3]"
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
          </div>
  )
}
