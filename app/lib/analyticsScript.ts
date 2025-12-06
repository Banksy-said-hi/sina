'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Google Analytics using Next.js Script component
 * This is the recommended approach for Next.js apps
 */
export function GoogleAnalyticsScript() {
  useEffect(() => {
    // Initialize dataLayer for custom events
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
  }, []);

  if (!process.env.NEXT_PUBLIC_GA_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer.push(arguments);
          }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            send_page_view: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: false,
          });
        }}
      />
    </>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
