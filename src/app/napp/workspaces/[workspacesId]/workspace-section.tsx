
import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React from 'react'
import {useToggle} from 'react-use'
import { FaCaretDown } from 'react-icons/fa'
import { cn } from '@/lib/utils'
interface WorkspaceSectionProps {
  children:React.ReactNode,
  label:string,
  hint:string,
  onNew?:()=>void
}
export default function WorkspaceSection({
  children,
  label,
  hint,
  onNew
}: WorkspaceSectionProps) {
  const [on,toggle] = useToggle(true)
  return (
    <div className='flex flex-col mt-3 px-2 p-3 gap-y-1.5 w-full'>
      <div className='flex justify-between items-center group w-full'>
       <div>
       <Button 
         variant="transparent" 
         className='text-sm p-0.5 text-gray-500 shrink-0 size-6'
         onClick={toggle}
        >
          <FaCaretDown className={cn("size-4 transition-transform",
            !on && "-rotate-90"
          )}></FaCaretDown>
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className='group px-1.5 text-sm text-gray-500 h-[28px] justify-start overflow-hidden items-center'
        >
          <span className='truncate'>{label}</span>
        </Button>
       </div>
        {
          onNew && (
            <Hint label={hint} side='top' align='center'>
              <Button
               onClick={onNew}
               variant="transparent"
               size="sm"
               className='opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-gray-500 size-6 shrink-0'
              >
                <PlusIcon className='size-5'></PlusIcon>
              </Button>
            </Hint>
          )
        }
      </div>
      {on&&children}
    </div>
  )
}
