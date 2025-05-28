import { Home, User, Settings } from "lucide-react";
import Link from "next/link";

export default function BottomNavBar({ tripid }) {
  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-stone-800 border-stone-300 rounded-t-2xl z-50 flex justify-around items-center py-4 px-4 md:hidden">
      <Link href={`/Dashboard/Trips/${tripid}`}>
        <div className="flex flex-col items-center text-stone-300 hover:text-stone-900 transition">
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </div>
      </Link>

      <Link href={`/Dashboard/Trips/${tripid}/Personal`}>
        <div className="flex flex-col items-center text-stone-300 hover:text-stone-900 transition">
          <User size={22} />
          <span className="text-xs mt-1">Personal</span>
        </div>
      </Link>

      <Link href={`/Dashboard/Trips/${tripid}/Details`}>
        <div className="flex flex-col items-center text-stone-300 hover:text-stone-900 transition">
          <Settings size={22} />
          <span className="text-xs mt-1">Settings</span>
        </div>
      </Link>
    </div>
  );
}
