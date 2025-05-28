"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase"; // update this path based on your setup
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

const RecentContributions = ({ tripid }) => {
  const [contributions, setContributions] = useState([]);
  const [selectedMember, setSelectedMember] = useState("all");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "trips", tripid, "contributions"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContributions(data);

      // Build unique member list
      const uniqueNames = Array.from(new Set(data.map(item => item.name)));
      setMembers(uniqueNames);
    });

    return () => unsubscribe();
  }, [tripid]);

  const filteredData = selectedMember === "all"
    ? contributions
    : contributions.filter(tx => tx.name === selectedMember);

  return (
    <div className="py-10 p-6 rounded-2xl w-full bg-stone-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-stone-800 text-lg font-semibold">Recent Contributions</h2>
        <select
          className="bg-stone-300 text-sm rounded-md px-2 py-1 text-stone-700"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="all">All Members</option>
          {members.map((name, idx) => (
            <option key={idx} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pb-10 pr-2">
        {filteredData.map((tx, index) => {
          const date = tx.timestamp?.toDate();
        const formattedDate = date?.toLocaleDateString("en-US", {
            month: "long",  // full month name
            day: "numeric",
            year: "numeric",
            });

            const formattedTime = date?.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,  // 24-hour format
            });

          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between bg-stone-200/5 rounded-xl shadow-xl p-3"
            >
              <div className="w-full ">
                <p className="text-stone-800 font-medium">{tx.name}</p>
                
                    <p className="text-stone-500 text-sm ">{formattedDate} </p>
                
              </div>
              <div className="flex flex-col justify-center items-center">
              <div className="font-semibold text-lg text-green-600">
                ₹{tx.amount}
              </div>
              <p className="text-stone-500 text-xs "> {formattedTime}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentContributions;
