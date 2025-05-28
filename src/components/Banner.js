"use client"
import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // Optional, if you're using lucide-react icons
import TripForm from "./TripForm";
import { db } from '../lib/firebase'; 
import Link from "next/link";
import { collection,getDoc, addDoc,doc,updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';

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
    console.log("got it :",trips)
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    {trips.map((trip, index) => (
      <Link href={`/Dashboard/Trips/${trip.id}`} key={trip.id}>
      <div
        key={index}
        className="w-full bg-stone-100 rounded-2xl border-2 border-stone-300 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-1">
          Trip Name: {trip.name}
        </h2>
        <p className="text-sm text-stone-600 mb-1">
          Description: {trip.description || "No description provided"}
        </p>
        <p className="text-sm text-stone-600 mb-1">
          Budget: ₹{trip.budget}
        </p>
        <p className="text-xs text-stone-500">
          Date: {trip.date ? new Date(trip.date).toLocaleDateString() : "N/A"}
        </p>
      </div>
      </Link>
    ))}
  </div>
) : (
  <div className="text-stone-500 text-sm">You don’t have any trips yet.</div>
)}
</div>
    
  );
}
