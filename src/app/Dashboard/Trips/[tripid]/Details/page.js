"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import BottomNavBar from '@/components/Bottombar';
import { Toaster } from 'react-hot-toast';
import Nav from '@/components/Nav';
import { db } from '@/lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import Invite from '@/components/Invite';
import Loading from '@/components/Loading';
import HorizontalScrollContributions from '@/components/Detailone';
import TripOverviewCard from '@/components/Two';
import Delete from '@/components/Delete';

function Page({ params }) {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const router = useRouter();
  const { tripid } = params;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }

    const fetchData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        const tripRef = doc(db, "trips", tripid);
        const tripSnap = await getDoc(tripRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        if (tripSnap.exists()) {
          setTripData(tripSnap.data());
        }
      }
    };

    if (!loading) fetchData();
  }, [loading, user, tripid, router]);

  return (
    <div className='w-full h-screen bg-stone-200'>
      <Toaster
        position="top-center"
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
            style: { background: '#6b705c', color: '#f5f5f2' }
          },
          error: {
            style: { background: '#9d0208', color: '#f5f5f2' }
          }
        }}
      />

      {userData && tripData ? (
        <div>
          <Nav user={userData} />
          <TripOverviewCard tripId={tripid} />
          <HorizontalScrollContributions tripId={tripid} />

          {userData.uid === tripData.createdBy && (
            <div className="w-full flex justify-between items-center pr-5">
              <Invite tripid={tripid} />
              <Delete user={userData} tripid={tripid} trip={tripData} />
            </div>
          )}

          <BottomNavBar tripid={tripid} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Page;
