"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import BottomNavBar from '@/components/Bottombar';
import { Toaster } from 'react-hot-toast';
import Nav from '@/components/Nav';
import { db } from '@/lib/firebase'; 
import { onSnapshot,collection, addDoc,doc,updateDoc,setDoc,getDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import Invite from '@/components/Invite';
import Loading from '@/components/Loading';
import HorizontalScrollContributions from '@/components/Detailone';
import TripOverviewCard from '@/components/Two';


function Page({ params }) {
    const { user, loading } = useAuth();
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const { tripid } = params;

    useEffect(() => {
    if (!loading && !user) {
      router.push("/"); 
    }

     const fetchUserDetails = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          console.log("User data from Firestore:", data);

        } else {
          console.log("No such user doc found!");
        }
      } else {
        router.push("/"); 
      }
    };

    if (!loading) {
      fetchUserDetails();
    }

  }, [loading, user, router]);   

  return (
        <div className='w-full h-screen bg-stone-200'>
       <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#8a8a7f', // stone grayish tone, not too dark, chill vibe
            color: '#f5f5f2',      // off-white, easy on eyes
            boxShadow: '0 4px 12px rgba(138, 138, 127, 0.4)', // subtle stone-colored shadow
            borderRadius: '8px',   // smooth corners
            fontWeight: '500',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '12px 20px',
          },
          success: {
            style: {
              background: '#6b705c', // earthy greenish-brown for success
              color: '#f5f5f2',
            }
          },
          error: {
            style: {
              background: '#9d0208', // muted brick red for error, fits stone mood but stands out
              color: '#f5f5f2',
            }
          }
        }}/>
      {userData ? (
       <div>
         <Nav user={userData} />
         {/* <Invite tripid={tripid}/> */}
          <TripOverviewCard tripId={tripid}/>
          <HorizontalScrollContributions tripId={tripid}/>
         <BottomNavBar tripid={tripid} />
       </div>
      ):(
        <Loading/>
      ) }
    </div>
  )
}

export default Page