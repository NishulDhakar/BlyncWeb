export default function GameBackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
  );
}
