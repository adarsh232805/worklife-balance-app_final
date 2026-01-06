export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white/65
      backdrop-blur-2xl
      border border-white/40
      rounded-3xl
      shadow-2xl
      p-8
    ">
      {children}
    </div>
  );
}
