import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useApproveJoinRequest = () => {
    return useMutation(api.workspaces.approveRequest)
} 