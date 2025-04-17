import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface ThreadBarProps {
    count?: number;
    timestamp?: number;
    image?: string
    onClick?: () => void;
}

export default function ThreadBar({
    count,
    timestamp,
    image,
    onClick
}: ThreadBarProps) {
    if (!count || !timestamp) return null
    return (
        <button
            onClick={onClick}
            className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/threadbar transition max-w-[600px]"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0">
                    <AvatarImage src={image} />
                    <AvatarFallback>
                        M
                    </AvatarFallback>
                </Avatar>
                <span className='text-xs text-sky-700 hover:underline font-bold truncate'>
                    {count > 0 && `${count} 个回复`}
                </span>
                <span className='text-xs text-muted-foreground truncate group-hover/threadbar:hidden block'>
                    {`最后的回复: ${formatDistanceToNow(timestamp, {
                        addSuffix: true,
                        locale: zhCN
                    })}`}
                </span>
                <span className='text-xs text-muted-foreground truncate group-hover/threadbar:block hidden'>
                    查看回复
                </span>
                <ChevronRight className='size-4 text-muted-foreground ml-auto opacity-0 group-hover/threadbar:opacity-100 transition shrink-0'></ChevronRight>
            </div>
        </button>
    )
}
