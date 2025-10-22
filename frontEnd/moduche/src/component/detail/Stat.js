export default function Stat({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}