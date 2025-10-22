export default function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700 bg-white/60">
      {children}
    </span>
  );
}