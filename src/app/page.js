"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loginbtn from "@/components/Loginbtn";

export default function Home() {
  const router = useRouter();

const stats = [
  { emoji: "✈️", label: "+5 trips planned", bg: "bg-[#7D5FFF]", text: "text-white", rotate: 10, pos: { top: 16, left: 24 } },
  { emoji: "📍", label: "+12 destinations", bg: "bg-[#D5FF00]", text: "text-black", rotate: -8, pos: { top: 64, right: 24 } },
  { emoji: "🧳", label: "+7 bags packed", bg: "bg-white", text: "text-black", rotate: 12, pos: { top: 102, left: 40 } },
  { emoji: "📅", label: "+10 events", bg: "bg-[#7D5FFF]", text: "text-white", rotate: -15, pos: { top: 144, right: 40 } },
  { emoji: "💰", label: "+$2,300 budget saved", bg: "bg-[#D5FF00]", text: "text-black", rotate: 8, pos: { bottom: 25, left: 24 } },
  { emoji: "👥", label: "+4 travel buddies", bg: "bg-white", text: "text-black", rotate: -10, pos: { bottom: 2, right: 24 } },
  { emoji: "🗺️", label: "+3 custom routes", bg: "bg-[#7D5FFF]", text: "text-white", rotate: 7, pos: { bottom: 80, left: 80 } },
  { emoji: "🛏️", label: "+8 hotels booked", bg: "bg-[#D5FF00]", text: "text-black", rotate: -7, pos: { top: 250, left: 24 } },
];


  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const bubbleVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="h-auto bg-white flex flex-col justify-between items-center">
      {/* Top Section with Pills */}
     <div className="bg-black rounded-b-3xl w-full pt-16 pb-20 relative overflow-hidden h-[50vh]">
  {/* The gradient blur ball */}
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
    style={{
      width: 300,
      height: 300,
    background:
  "radial-gradient(circle, rgba(213,255,0,0.9) 0%, rgba(213,255,0,0) 60%)",
filter: "blur(100px)",
zIndex: 0,
      pointerEvents: "none",
    }}
  ></div>

  <motion.div
    className="relative w-full h-full z-10"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {stats.map(({ emoji, label, bg, text, rotate, pos }, i) => (
      <motion.div
        key={i}
        variants={bubbleVariants}
        className={`${bg} ${text} text-sm px-4 py-2 rounded-full shadow absolute`}
        style={{
          top: pos.top !== undefined ? pos.top : "auto",
          bottom: pos.bottom !== undefined ? pos.bottom : "auto",
          left: pos.left !== undefined ? pos.left : "auto",
          right: pos.right !== undefined ? pos.right : "auto",
          rotate: `${rotate}deg`,
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        <span>{emoji} </span>
        {label}
      </motion.div>
    ))}
  </motion.div>
</div>


      {/* Bottom Section with Heading, Description and CTA */}
      <motion.div
        className="text-center max-w-md h-[50vh] pt-10"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        <h1 className="text-3xl font-semibold mb-4 text-stone-900">
          Plan Smarter, Travel Better
        </h1>
        <p className="text-stone-600 mb-8">
          Organize your trips, track expenses, and coordinate with your crew effortlessly — all in one place.
        </p>
        <Loginbtn/> 
      </motion.div>
    </div>
  );
}
