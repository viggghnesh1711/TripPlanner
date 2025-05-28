'use client';
import { Home, Users, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";

export default function BottomNavBar({ tripid }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: <Home size={22} />, href: `/Dashboard/Trips/${tripid}/Details` },
    { name: "Group", icon: <Users size={22} />, href: `/Dashboard/Trips/${tripid}` },
    { name: "Personal", icon: <User size={22} />, href: `/Dashboard/Trips/${tripid}/Personal` },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-stone-900/80 backdrop-blur-md border-t border-stone-600 rounded-t-2xl flex justify-around items-center py-3 px-6 shadow-[0_-3px_10px_rgba(0,0,0,0.25)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link key={tab.name} href={tab.href} className="relative group">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
                isActive ? "text-white" : "text-stone-400"
              }`}
            >
              {tab.icon}
              <span className="text-xs">{tab.name}</span>

              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 h-1 w-1 rounded-full bg-lime-400"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
