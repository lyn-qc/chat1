import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useGetPendingRequests = () => {
    return useQuery(api.workspaces.getPendingRequests)
} 