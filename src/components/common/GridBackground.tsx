export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center bg-[#ececec] overflow-hidden">
      
      <div className="grid grid-cols-4 gap-12 p-24">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-[260px] h-[200px] rounded-[40px] bg-[#ececec] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.05),inset_-8px_-8px_16px_rgba(255,255,255,0.9)]"
          />
        ))}
      </div>

    </div>
  )
}