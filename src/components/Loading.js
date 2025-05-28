
export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-stone-100 text-stone-700">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-stone-400 rounded-full opacity-30"></div>
        <div className="absolute inset-0 border-t-4 border-stone-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium tracking-wide">On the way...</p>
    </div>
  );
}
