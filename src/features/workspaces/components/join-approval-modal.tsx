"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { useGetPendingRequests } from '../api/use-get-pending-requests'
import { useApproveJoinRequest } from '../api/use-approve-join-request'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useConfirm } from '@/hooks/use-confirm'

export const JoinApprovalModal = () => {
    // const { data, isLoading } = useGetPendingRequests()
    // const { mutate: approve, isPending } = useApproveJoinRequest()
    const [ConfirmDialog, confirm] = useConfirm(
        "确认批准加入请求?",
        "用户将获得工作区访问权限"
    )

    return (
        <>
            <ConfirmDialog />
            <Dialog open>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>待处理的加入请求</DialogTitle>
                    </DialogHeader>

                    {/* {isLoading ? (
                        <Loader className="mx-auto animate-spin" />
                    ) : (
                        <div className="space-y-4">
                            {data?.map(request => (
                                <div key={request._id} className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                        <p>{request.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(request._creationTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        disabled={isPending}
                                        onClick={async () => {
                                            const ok = await confirm()
                                            if (ok) approve({ requestId: request._id })
                                        }}
                                    >
                                        批准
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )} */}
                </DialogContent>
            </Dialog>
        </>
    )
} 