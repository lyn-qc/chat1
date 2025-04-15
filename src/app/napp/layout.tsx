'use client'
import React from 'react'
import styles from './Big.module.css'
import { useRouter } from 'next/navigation'
import { Modals } from '@/features/workspaces/components/modals'
import { Toaster } from '@/components/ui/sonner'

export default function BigLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className='h-[100vh]'>

            <main className='w-[100%]'>
                <div className={styles.main}>

                    <div className={styles.main_bottom}>
                        <Toaster />
                        <Modals></Modals>
                        {children}
                    </div>
                </div>


            </main>

        </div>
    )
}