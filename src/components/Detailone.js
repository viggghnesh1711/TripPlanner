"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import BottomNavBar from '@/components/Bottombar';
import { Toaster } from 'react-hot-toast';
import Nav from '@/components/Nav';
import { db } from '@/lib/firebase'; 
import { onSnapshot,collection, addDoc,doc,updateDoc,where,setDoc,getDoc, serverTimestamp, arrayUnion,query } from 'firebase/firestore';
import Invite from '@/components/Invite';
import Loading from '@/components/Loading';
import { motion } from "framer-motion";

const ContributionCard = ({ name, amount, date, type }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

  return (
    <motion.div
     initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      className="min-w-[140px] h-[140px] rounded-2xl p-4 text-white flex flex-col justify-between bg-stone-300"
    >
      <div className="bg-white/20 p-2 rounded-full w-fit self-end">
        <span>📈</span>
      </div>
      <div>
        <p className="text-xl mt-1 font-bold text-stone-800"> $ {amount} </p>
        <p className="text-xs opacity-80 text-stone-600">{name}</p>
      </div>
    </motion.div>
  );
};


const HorizontalScrollContributions = ({ tripId }) => {
  const [contributionsSummary, setContributionsSummary] = useState([]);

  useEffect(() => {
    if (!tripId) return;

    const contributionsRef = collection(db, "trips", tripId, "contributions");

    const unsub = onSnapshot(contributionsRef, (snapshot) => {
      const rawData = snapshot.docs.map((doc) => doc.data());

      const summaryMap = {};

      rawData.forEach(({ name, amount, date, type }) => {
        if (!summaryMap[name]) {
          summaryMap[name] = {
            name,
            totalAmount: 0,
            lastDate: date?.toDate() || new Date(),
            lastType: type,
          };
        }

        summaryMap[name].totalAmount += amount;

        if (date?.toDate() > summaryMap[name].lastDate) {
          summaryMap[name].lastDate = date.toDate();
          summaryMap[name].lastType = type;
        }
      });

      const summaryArray = Object.values(summaryMap);
      setContributionsSummary(summaryArray);
    });

    return () => unsub();
  }, [tripId]);

  return (
    <div className="px-4 py-6 ">
      <h2 className="text-lg font-semibold mb-3 text-stone-800">Our Memebers</h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 ">
        {contributionsSummary.length === 0 ? (
          <p className="text-sm text-stone-400">No contributions yet...</p>
        ) : (
          contributionsSummary.map((data, i) => (
            <ContributionCard
              key={i}
              name={data.name}
              amount={data.totalAmount}
              date={data.lastDate}
              type={data.lastType || "Contribution"}
              className="bg-stone-300"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HorizontalScrollContributions;