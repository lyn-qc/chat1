import { UseGetMember } from "@/features/member/api/use-get-member"
import { useGetMessage } from "@/features/message/api/use-get-messages"
import { useMemberId } from "@/hooks/use-member-id"
import { Id } from "convex/_generated/dataModel"
import { Loader } from "lucide-react"
import Header from "./header"
import MChatInput from "./chat-input"
import MessageList from "../../channel/[channelId]/message-list"

interface ConverstationProps {
    id:Id<"conversations">
}
export default function Converstation({ id }: ConverstationProps) {
    const memberId = useMemberId()
    const {data:member, isLoading:memberLoading} =UseGetMember({id:memberId})
    const {results, status,loadMore} = useGetMessage({
        conversationId:id,
    })

    if(memberLoading || status === "LoadingFirstPage") return (
        <div className='flex flex-col bg-blue-50 h-full items-center justify-center'>
        <Loader className='size-5 aniamte-spin text-aqua-500'></Loader>
      </div>
    )
  return (
    <div className="flex flex-col h-full">
       <Header 
        memberImage={member?.user.image}
        memberName={member?.user.name}
        onClick={() => {
        }}
       ></Header>
       <MessageList
         data={results}
         variant="conversation"
         memberImage={member?.user.image}
         loadMore={loadMore}
         memberName={member?.user.name}
         isLoadingMore={status === "LoadingMore"}
         // @ts-ignore
         canLoadMore={status === "CanLoadMore"}
       >
       </MessageList>
       <MChatInput
        conversationId={id}
       />
      
    </div>
  )
}
