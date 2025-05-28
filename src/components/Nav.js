import React from 'react'
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiLogout } from "react-icons/ci";
import Link from "next/link";

export default function Nav({ user }) {
  const firstName = user?.name ? user.name.split(" ")[0] : "Guest";

  return (
    <div className="w-full py-4 px-4 bg-stone-200  flex items-center justify-between">
      <div className="text-base text-stone-700 leading-tight">
        <p className="font-medium">Welcome</p>
        <p className="font-medium">
          back,  <span className='text-lg font-bold text-stone-800'>  {firstName} 👋</span>
        </p>
      </div>

      <div className="relative w-10 h-10">
        <Link href="/Dashboard">
       <CiLogout className="text-3xl"/>
       </Link>
        {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" /> */}
      </div>
    </div>
  );
}
