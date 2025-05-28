"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function RevenueDashboard({ user, tripid }) {
  const [contributed, setContributed] = useState(0);
  const [totalToContribute, setTotalToContribute] = useState(0);
  const [alreadyContributed, setAlreadyContributed] = useState(0);

  useEffect(() => {
    if (!user || !tripid) return;

    const contribQuery = query(
      collection(db, "trips", tripid, "contributions"),
      where("userId", "==", user.uid)
    );

    const unsubContrib = onSnapshot(contribQuery, async (querySnapshot) => {
      let totalAmount = 0;
      querySnapshot.forEach(doc => {
        totalAmount += doc.data().amount || 0;
      });

      setContributed(totalAmount);

      // ✅ Update the 'contributed' field in the members doc
    
      const memberDocRef = doc(db, "trips", tripid, "members", user.uid);
      try {
        const ans = await updateDoc(memberDocRef, {
          contributed: totalAmount
        });
      } catch (err) {
        console.error("Failed to update contributed in members doc:", err);
      }
    });

    // 🔄 Real-time listener for member data
    const memberDocRef = doc(db, "trips", tripid, "members", user.uid);
    const unsubMember = onSnapshot(memberDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalToContribute(data.toContribute || 0);
        setAlreadyContributed(data.contributed || 0);
      }
    });

    // Clean up listeners on unmount
    return () => {
      unsubContrib();
      unsubMember();
    };
  }, [user, tripid]);

  return (
    <div className="flex-col items-center justify-center p-4 text-stone-300 bg-stone-200">
      {/* Amount Contributed */}
      <motion.div
       initial={{opacity:0,y:-30}}
       animate={{opacity:1,y:0}}
       transition={{delay:0.2,duration:0.5}}
       className="w-full max-w-md bg-stone-800 p-6 rounded-2xl shadow-md mb-6">
        <p className="text-sm text-gray-300">Amount Contributed</p>
        <p className="text-xs text-gray-400 mb-2">Till now</p>
        <p className="text-xl py-3">
          <motion.span
           key={contributed}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-stone-200 text-3xl">$ {contributed}</motion.span>
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {/* Remaining Amount */}
        <motion.div
        initial={{opacity:0,y:-30}}
       animate={{opacity:1,y:0}}
       transition={{delay:0.2,duration:0.5}}
         className="bg-stone-300 text-black p-4 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-500">Amount Left to Contribute</p>
          </div>
          <motion.p
          key={contributed}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-xl font-bold text-stone-900">
            $ {(totalToContribute - alreadyContributed).toFixed(0)}
          </motion.p>
        </motion.div>

        {/* Starting Amount */}
        <motion.div
        initial={{opacity:0,y:-30}}
       animate={{opacity:1,y:0}}
       transition={{delay:0.2,duration:0.5}}
        className="bg-stone-300 text-black p-4 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-500">Initial Contribution Target</p>
          </div>
          <motion.p
          key={contributed}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-xl font-bold text-stone-900">
            $ {totalToContribute.toFixed(0)}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
