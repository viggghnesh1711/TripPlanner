"use client"
import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // Optional, if you're using lucide-react icons
import TripForm from "./TripForm";
import { db } from '../lib/firebase'; 
import Link from "next/link";
import { collection,getDoc, addDoc,doc,updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { Calendar, User } from "lucide-react"
import { motion } from "framer-motion";

export default function SearchTabs({user}) {
  const [activeTab, setActiveTab] = useState("joined");
  const [trips,setTrips] =  useState("");
  
useEffect(() => {
  const fetchTrips = async () => {
    if (!user?.trips || user.trips.length === 0) return;

    const tripDataArray = [];

    for (const tripId of user.trips) {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        tripDataArray.push({ id: tripSnap.id, ...tripSnap.data() });
      }
    }

    setTrips(tripDataArray);
  };

  fetchTrips();
}, [user?.trips]);

  useEffect(()=>{
    console.log("got it :",trips.admin)

  },[trips])

  return (
    <div className="px-4 py-8 w-full h-dull flex flex-col gap-5 ">
    <div className="w-full mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-10 py-3 rounded-xl bg-stone-100 shadow-sm focus:outline-none"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setActiveTab("joined")}
          className={`px-4 py-2 rounded-full text-xs font-medium ${
            activeTab === "joined" ? "bg-stone-800 text-stone-200" : "bg-stone-100 text-stone-800"
          } shadow`}
        >
          Joined
        </button>
        <button
          onClick={() => setActiveTab("created")}
          className={`px-4 py-2 rounded-full text-xs font-medium ${
            activeTab === "created" ? "bg-stone-800 text-stone-200" : "bg-stone-100 text-stone-800"
          } shadow`}
        >
          Created
        </button>
      </div>
    </div>
    <TripForm user={user}/>
 {trips && trips.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {trips.map((trip, i) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={`/Dashboard/Trips/${trip.id}`}>
            <div className="group relative p-5 rounded-2xl bg-white/30 shadow-2xl backdrop-blur-md border border-stone-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-stone-900 group-hover:text-blue-600 transition-colors">
                  {trip.name}
                </h2>
                <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  ₹{trip.budget}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 line-clamp-3 mb-6">
                {trip.description || "No description provided"}
              </p>

            <div className="w-full bg-stone-300 absolute left-0 right-0 bottom-0 py-2 rounded-b-2xl px-5">
              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {trip.date
                      ? new Date(trip.date).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>

                {/* Admin Info */}
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{trip.admin || "Unknown"}</span>
                </div>
              </div>
            </div>
              {/* Animated Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-blue-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="text-stone-500 text-sm text-center mt-10">
      You dont have any trips yet.
    </div>
  )
}

</div>
    
  );
}
