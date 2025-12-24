import { getStatisticsData } from "./statisticsActions";
import StatisticsClient from "./StatisticsClient";
import { Suspense } from "react";

export default async function Page({ searchParams }) {
  const period = searchParams.period || "today";
  const initialData = await getStatisticsData({
    period,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });

  return (
    <div className="max-w-[1400px] mx-auto p-2 md:p-10 min-h-screen bg-[var(--background)]">
      <Suspense
        fallback={
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-48 md:h-64 bg-gray-200 rounded-[1.5rem] md:rounded-[2rem]"></div>
            <div className="h-80 md:h-96 bg-gray-200 rounded-[1.5rem] md:rounded-[2rem]"></div>
          </div>
        }
      >
        <StatisticsClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
