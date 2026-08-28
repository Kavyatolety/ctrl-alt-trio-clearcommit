import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
const geistSans=Geist({variable:'--font-geist-sans',subsets:['latin']});
const geistMono=Geist_Mono({variable:'--font-geist-mono',subsets:['latin']});
export const metadata:Metadata={title:'ClearCommit — Meeting commitments, made visible',description:'Extract owners, deadlines, confidence, and evidence from messy meeting transcripts.',openGraph:{title:'ClearCommit',description:'Meeting commitments, made visible.',images:['/og.png']},twitter:{card:'summary_large_image',title:'ClearCommit',description:'Meeting commitments, made visible.',images:['/og.png']}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}

