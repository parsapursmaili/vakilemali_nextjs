// components/ProgressBarProvider.jsx

"use client"; // <-- این خط بسیار مهم است!

import NextTopLoader from "nextjs-toploader";

const ProgressBarProvider = () => {
  return (
    <NextTopLoader
      color="var(--accent)"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px var(--accent), 0 0 5px var(--accent)"
    />
  );
};

export default ProgressBarProvider;
