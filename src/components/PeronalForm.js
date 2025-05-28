"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; 
import toast from "react-hot-toast";
import { collection, addDoc,doc,updateDoc, getDoc,serverTimestamp, arrayUnion } from 'firebase/firestore';

export default function Transactions({user,tripid}) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Amount:", amount);
    console.log("Description:", desc);

    if (!user) return alert("User not logged in");

    try {
        console.log("sddsd",user.name)
      await addDoc(
        collection(db, "trips", tripid, "contributions"), // Replace tripId_placeholder with actual trip ID
        {
          userId: user.uid,
          name:user.name,
          amount: parseFloat(amount),
          description: desc,
          timestamp: new Date(),
        }
      );
      setShowForm(false);
      setAmount("");
      setDesc("");
      setShowSuccess(true); 
      toast.success(" Successfully Added")
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding contribution:", error);
    }
  };

  return (
   <div className=" py-6 text-black flex items-center justify-center">
  <motion.form
  initial={{opacity:0,y:-30}}
       animate={{opacity:1,y:0}}
       transition={{delay:0.2,duration:0.5}} 
    className=" w-80 "
    onSubmit={handleSubmit}
  >
    <h3 className="text-xl font-semibold text-stone-800 mb-5">Add Money</h3>

<div className=" ">
    {/* Amount Input */}
    <div className="mb-4">
      {/* <label className="block text-sm font-medium text-stone-600 mb-1">Amount</label> */}
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
        required
      />
    </div>

    {/* Description Input */}
    <div className="mb-6">
      {/* <label className="block text-sm font-medium text-stone-600 mb-1">Description</label> */}
      <input
        type="text"
        placeholder="What is this for?"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
        required
      />
    </div>
</div>
    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-stone-800 text-stone-100 py-2 rounded-lg font-medium hover:bg-stone-700 transition-colors"
    >
      Add
    </button>
  </motion.form>
</div>

  );
}

