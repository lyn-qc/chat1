import { useProfileMemberId } from "@/features/member/store/use-profile-member-id"
import { useParentMessageId } from "@/features/message/store/use-parent-message-id"



export default function usePanel() {
  const [parentMessageId,setParentMessageId] = useParentMessageId()
  const [profileMemberId,setProfileMemberId]= useProfileMemberId()
  const onOpenProfile = (memberId:string) => {
    setProfileMemberId(memberId)
    setParentMessageId(null)
  }
  const onOpenMessage = (messageId:string) => {
    
    setParentMessageId(messageId)
    setProfileMemberId(null)
  }
  const onCloseMessage = () => {
    setParentMessageId(null)
    setProfileMemberId(null)
  }
  
  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
    onOpenProfile,
    profileMemberId
  }
}
