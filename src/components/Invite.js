"use client"
import React, { useState } from 'react';
import toast from "react-hot-toast";
import { db } from '@/lib/firebase'; 
import { collection, addDoc,doc,updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { useRouter } from "next/navigation";

export default function Invite({tripid}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [emails, setEmails] = useState(['']); // start with one input

  const handleInvite = async (e) => {
  e.preventDefault();
  console.log("inside invite:",tripid)
  const filteredEmails = emails.filter(email => email.trim() !== '');
  const tripLink = `${window.location.origin}/Dashboard/Trips/${tripid}`; // or your actual trip URL

  try {
    const res = await fetch('/api/send-invite', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ emails: filteredEmails, tripLink }),
    });

    if (res.ok) {
      toast.success('Invites sent!');
      console.log("dd",tripid)
      const tripRef = doc(db, "trips", tripid); 
        await updateDoc(tripRef, {
        invitedUsers: arrayUnion(...emails), 
    });

  console.log("Emails added to trip invitedUsers!");
  router.push(`/Dashboard/Trips/${tripid}`);
    } else {
      
    }
  } catch (err) {
    console.error("Failed to update invitedUsers:", err);
    toast.error('Error sending invites:', err);
  }
};

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailInput = () => {
    setEmails([...emails, '']);
  };


  return (
    <div className="p-6">
      <button 
        className="bg-stone-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(true)}
      >
        Invite People
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form 
            onSubmit={handleInvite} 
            className="bg-white p-6 rounded-md shadow-md w-[400px]"
          >
            <h2 className="text-lg font-semibold mb-4">Enter Emails to Invite</h2>

            {emails.map((email, i) => (
              <div key={i} className="flex mb-3">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => handleEmailChange(i, e.target.value)}
                  required={i === 0} // require first input
                  className="flex-grow border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none"
                />
                {i === emails.length - 1 && (
                  <button
                    type="button"
                    onClick={addEmailInput}
                    className="bg-stone-600 text-white px-3 rounded-r-md"
                  >
                    Add Email
                  </button>
                )}
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded border-gray-400"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-stone-700 text-white px-4 py-2 rounded"
              >
                Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
