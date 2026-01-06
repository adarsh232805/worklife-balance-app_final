export default function BalanceScore({ score = 72 }: { score?: number }) {
  return (
    <div className="text-center">
      <p className="text-sm text-slate-500">Balance Score</p>
      <div className="text-4xl font-bold text-indigo-600">
        {score}
      </div>
      <p className="text-xs text-slate-500">
        Higher is healthier
      </p>
    </div>
  );
}
