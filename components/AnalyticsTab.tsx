"use client";

import AnalyticsDashboard from "./analytics/AnalyticsDashboard";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-500">Your personal productivity and wellness report.</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
