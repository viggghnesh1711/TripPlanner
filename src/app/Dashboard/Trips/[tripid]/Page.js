"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs ,onSnapshot} from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import BottomNavBar from '@/components/Bottombar';
import Nav from '@/components/Nav';
import Common from '@/components/Common';
import RecentTransactions from '@/components/Recent';
import Loading from '@/components/Loading';

function Page({ params }) {
  const { tripid } = params;
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const router = useRouter();

useEffect(() => {
  if (!loading && !user) {
    localStorage.setItem("pendingTripId", tripid);
    router.push("/");
    return;
  }

  let unsubscribeContributions;

  const fetchTripData = async () => {
    try {
      const tripRef = doc(db, "trips", tripid);
      const tripSnap = await getDoc(tripRef);
      if (tripSnap.exists()) {
        const tripData = tripSnap.data();
        setTotalBudget(tripData.budget || 0);
      }

      const contributionsRef = collection(db, "trips", tripid, "contributions");
      unsubscribeContributions = onSnapshot(contributionsRef, (snapshot) => {
        let totalPaid = 0;
        snapshot.forEach((doc) => {
          totalPaid += doc.data().amount || 0;
        });
        setPaidAmount(totalPaid);
      });

    } catch (err) {
      console.error("error fetching trip data", err);
    }
  };

  const fetchUserDetails = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };

  if (!loading && user) {
    fetchUserDetails();
    fetchTripData();
  }

  return () => {
    if (unsubscribeContributions) unsubscribeContributions();
  };

}, [loading, user, tripid]);


  return (
    <div className='w-full h-screen bg-stone-200'>
      <Toaster position="top-center"
        toastOptions={{
          style: {
            background: '#8a8a7f',
            color: '#f5f5f2',
            boxShadow: '0 4px 12px rgba(138, 138, 127, 0.4)',
            borderRadius: '8px',
            fontWeight: '500',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '12px 20px',
          },
          success: {
            style: {
              background: '#6b705c',
              color: '#f5f5f2',
            }
          },
          error: {
            style: {
              background: '#9d0208',
              color: '#f5f5f2',
            }
          }
        }}
      />
      {userData ? (
       <div>
         <Nav user={userData} />
         <Common totalBudget={totalBudget} paidAmount={paidAmount} />
         <RecentTransactions  tripid={tripid}/>
         <BottomNavBar tripid={tripid} />
       </div>
      ):(
        <Loading/>
      ) }
     
    </div>
  )
}

export default Page;
