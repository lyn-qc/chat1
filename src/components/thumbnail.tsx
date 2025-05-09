/* eslint-disable @next/next/no-img-element */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
interface ThumbnailProps {
    url: string|null|undefined;
}

export default function Thumbnail({ url }: ThumbnailProps) {
    if (!url) {
        return null
    }
    return(
        <Dialog>
            <DialogTrigger>
                <DialogTitle></DialogTitle>
                <div className="relative overflow-hidden max-w-[260px] border rounded-lg my-2 cursor-zoom-in">
                    <img src={url} alt="图片" className="rounded-md object-cover size-full" />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
                <img src={url} alt="图片" className="rounded-md object-cover size-full" />
            </DialogContent>
        </Dialog>
    )
}