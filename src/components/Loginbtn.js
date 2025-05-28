"use client";
import React from 'react';
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion,collection,serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Loginbtn() {
  const router = useRouter();

const recalculateContributions = async (tripId) => {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists()) return;

      const tripData = tripSnap.data();
      const membersRef = collection(db, "trips", tripId, "members");
      const membersSnap = await getDocs(membersRef);
      const totalMembers = membersSnap.size;
      const updatedAmount = tripData.budget / totalMembers;

      const updates = membersSnap.docs.map((docSnap) =>
        updateDoc(docSnap.ref, {
          toContribute: updatedAmount,
        })
      );

      await Promise.all(updates);
      console.log("✅ All toContribute values updated");
    } catch (err) {
      console.error("❌ Error recalculating contributions:", err);
    }
  };

const signInWithGoogle = async () => {
  try {
    const tripId = localStorage.getItem("pendingTripId");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        trips: [], 
      });
      toast.success("Logged in and user created!");
    } else {
      toast.success("Logged in successfully!");
    }

    if (tripId) {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        const tripData = tripSnap.data();
        const invitedEmails = tripData.invitedUsers || [];

         if (invitedEmails.includes(user.email)) {
            // Calculate amount per person — example assuming equal split
            const totalBudget = tripData.budget || 0;
            const totalMembers = (tripData.joinedUsers?.length || 0) + 1; // including this user
            const calculatedAmount = totalBudget / totalMembers;

            // Add trip to user
            await updateDoc(userRef, {
              trips: arrayUnion(tripId),
            });

            // Add user to trip’s joinedUsers array
            await updateDoc(tripRef, {
              joinedUsers: arrayUnion(user.uid),
            });

            // Add user as member with initial contribution info
            await setDoc(
              doc(collection(db, "trips", tripId, "members"), user.uid),
              {
                userId: user.uid,
                name: user.displayName,
                contributed: 0,
                toContribute: calculatedAmount,
                joinedAt: serverTimestamp(),
              }
            );

          await recalculateContributions(tripId);
          toast.success("Joined the trip successfully 🎉");
          localStorage.removeItem("pendingTripId");
          router.push(`/Dashboard/Trips/${tripId}`);
          return;
        } else {
          toast.error("You're not invited to this trip 😕");
        }
      } else {
        toast.error("Invalid trip link ❌");
      }

      localStorage.removeItem("pendingTripId");
    }

    router.push("/Dashboard");
  } catch (error) {
    console.error("Sign in failed:", error);
    toast.error("Sign in failed ⚠️");
  }
};


  return (
    <button
      onClick={signInWithGoogle}
      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Sign in with Google 👋
    </button>
  );
}

export default Loginbtn;
