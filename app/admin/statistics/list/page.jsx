// StatisticsPage.jsx
import { getStatisticsData } from "./statistics";
import StatisticsClient from "./StatisticsClient";
import { Suspense } from "react";

function StatisticsSkeleton() {
  return (
    <div className="w-full p-4 md:p-6 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-[var(--muted)] rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-[var(--muted)] rounded w-1/4 mb-8"></div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-24 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-24 bg-[var(--muted)] rounded-lg"></div>
      </div>
      {/* Controls */}
      <div className="h-12 bg-[var(--muted)] rounded-lg mb-6"></div>
      {/* Table */}
      <div className="space-y-3">
        <div className="h-14 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-14 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-14 bg-[var(--muted)] rounded-lg"></div>
        <div className="h-14 bg-[var(--muted)] rounded-lg"></div>
      </div>
    </div>
  );
}

async function StatisticsLoader({ searchParams }) {
  const period = searchParams.period || "today";
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;

  const initialData = await getStatisticsData({ period, startDate, endDate });
  return <StatisticsClient initialData={initialData} />;
}

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<StatisticsSkeleton />}>
      <StatisticsLoader searchParams={searchParams} />
    </Suspense>
  );
}
