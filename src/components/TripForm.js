"use client"
import { useState } from "react";
import { Search } from "lucide-react";
import React from 'react'
import { db } from '../lib/firebase'; 
import { collection, addDoc,doc,updateDoc,setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import toast from "react-hot-toast";
import { nanoid } from 'nanoid'; 
import { useRouter } from "next/navigation";

function TripForm({user}) { 
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');

  const handleSaveTrip = async () => {
    if (!tripName || !date || !description || !budget){
        toast.error("All details are required");
        return
    }  

    try {
    const baseId = `${tripName.trim().toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;
    const tripRef = await addDoc(collection(db, 'trips'), {
      name: tripName,
      description,
      budget: Number(budget),
      date,
      createdBy: user.uid,
      admin:user.name,
      createdAt: serverTimestamp(),
       friendlyId: baseId,
    });
    
    const userRef = doc(db, 'users', user.uid); // adjust if your user path is different
    await updateDoc(userRef, {
      trips: arrayUnion(tripRef.id)
    });

    const memberRef = doc(collection(db, "trips", tripRef.id, "members"), user.uid);
    await setDoc(memberRef, {
      userId: user.uid,
      name: user.name,
      contributed: 0,
      toContribute: Number(budget), 
      joinedAt: serverTimestamp(),
    });

    toast.success("Trip created successfully 🎉"); 
      setTripName('');
      setDescription('');
      setBudget('');
      setDate('');
      setShowModal(false);
      router.push(`/Dashboard/Trips/${tripRef.id}`);
    } 
    catch (err) {
      console.error("Error saving trip:", err);
     toast.error("Failed to save trip 😔");
    }
  };

  return (
    <div className="py-4 w-full ">
   <div className="w-full flex justify-between items-center gap-4 sm:px-4 py-3 bg-stone-200 rounded-xl">
  <h1 className="text-xl font-semibold text-stone-700 tracking-wide">
    Featured
  </h1>

  <button
    onClick={() => setShowModal(true)}
    className="bg-stone-300 hover:bg-stone-800 text-stone-800 font-medium py-2 px-4 sm:px-6 rounded-xl shadow-sm transition duration-200"
  >
    + New Trip
  </button>
</div>


     {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 py-10 w-full max-w-md shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-stone-800">🧳 Create a New Trip</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Trip Name"
                className="w-full px-4 py-3 bg-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-400"
              />
              <textarea
                value={description}
                onChange={(e)=>{setDescription(e.target.value)}}
                placeholder="Short Description"
                className="w-full px-4 py-3 bg-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-400 resize-none"
                rows={3}
              />
              <input
                value={budget}
                onChange={(e)=>{setBudget(e.target.value)}}
                type="number"
                placeholder="Budget (in ₹)"
                className="w-full px-4 py-3 bg-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-400"
              />
              <input
                 value={date}
                onChange={(e)=>{setDate(e.target.value)}}
                type="date"
                className="w-full px-4 py-3 bg-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-stone-400"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-300 text-stone-800 font-medium hover:bg-stone-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTrip}
                 className="px-4 py-2 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 transition">
                  Save Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripForm