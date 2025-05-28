"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Trash2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Delete({ user, tripid, trip }) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()


  const handleDelete = async () => {
    try {
      // 1. Delete trip doc
      await deleteDoc(doc(db, "trips", tripid))

      // 2. Remove trip ID from user's trips array
      await updateDoc(doc(db, "users", user.uid), {
        trips: arrayRemove(tripid),
      })

      // 3. Redirect to dashboard
      router.push("/Dashboard")
    } catch (err) {
      console.error("Error deleting trip:", err)
      alert("Something went wrong while deleting the trip 😓")
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-stone-200 bg-red-600 px-5 py-3 rounded-xl text-sm flex items-center gap-1 hover:text-red-800 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete Trip
      </button>

      {/* Confirm Modal */}
      {showModal && (
        <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
           initial={{opacity:0,scale:0.5}}
        animate={{opacity:1,scale:1}}
        transition={{delay:0.1,duration:0.4}}
          className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl border border-stone-200 text-center space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Confirm Deletion</h2>
            <p className="text-sm text-stone-600">
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
