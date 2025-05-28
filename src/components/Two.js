"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

const TripOverviewCard = ({ tripId }) => {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      const tripRef = doc(db, "trips", tripId);
      const snap = await getDoc(tripRef);
      if (snap.exists()) {
        setTrip(snap.data());
      }
    };

    fetchTrip();
  }, [tripId]);

  if (!trip) {
    return <div className="text-stone-500 text-sm p-4">Loading trip info...</div>;
  }

  return (
    <div className="p-4 flex  gap-4 items-center w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-stone-100 rounded-3xl w-full h-40 flex flex-col justify-center items-center shadow-md"
      >
        <div className="text-2xl font-bold text-stone-800">${trip.budget}</div>
        <div className="text-stone-500 mt-1">Trip Budget</div>
      </motion.div>

      <div className="flex flex-col gap-4 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-200 p-4 rounded-2xl flex-1 shadow-sm"
        >
          <div className="text-sm text-stone-500 mb-1">Trip Name</div>
          <div className="text-stone-800 font-semibold">{trip.name}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-stone-200 p-4 rounded-2xl flex-1 shadow-sm"
        >
          <div className="text-sm text-stone-500 mb-1">Description</div>
          <div className="text-stone-800 text-xs line-clamp-3">{trip.description}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripOverviewCard;
