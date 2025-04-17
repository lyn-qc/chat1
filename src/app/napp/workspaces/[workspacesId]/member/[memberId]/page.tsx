"use client"
import { useCreateOrGetConverstation } from "@/features/reactions/api/use-create-or-get-converstation"
import { useMemberId } from "@/hooks/use-member-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Id } from "convex/_generated/dataModel"
import { AlertTriangle, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Converstation from "./converstation"


export default function MemberIdPage() {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()
    const [converstationId,setConverstationId] = useState<Id<"conversations">|null>(null)
    const {data,mutate,isPending} = useCreateOrGetConverstation()
    useEffect(()=>{
      mutate({workspaceId,memberId},{
        onSuccess:(data)=>{
          setConverstationId(data)
        },
        onError:(error)=>{
          toast.error("创建对话失败")
        }
      })
    },[mutate,workspaceId,memberId])
    if (isPending) {
      return (
        <div className='flex flex-col bg-blue-50 h-full items-center justify-center'>
        <Loader className='size-5 aniamte-spin text-aqua-500'></Loader>
      </div>
      )
    }
    if (!converstationId ) {
     return (
      <div className='flex flex-col gap-y-2 bg-blue-50 h-full items-center justify-center'>
      <AlertTriangle className='size-5 text-white'></AlertTriangle>
      <p className='text-white text-sm'>未找到对话</p>
    </div>
     )
    }
  return (
    <Converstation id={converstationId}></Converstation>
  )
}
