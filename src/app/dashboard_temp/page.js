"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading } = useAuth();
   const [userData, setUserData] = useState(null);
  const router = useRouter();

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

   if (loading || !userData) return <Loading/>;
   if (!user) return null;

  return <div className="bg-stone-200 h-screen w-full">
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
  }}
/>
    <Navbar user={userData}/>
    <Banner user={userData}/>
    </div>;
}
