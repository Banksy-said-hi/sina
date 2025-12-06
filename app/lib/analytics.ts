'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Google Analytics Component
 * 
 * Tracks page views and events for the Enigma77 experience
 * Requires NEXT_PUBLIC_GA_ID environment variable set in .env.local
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run if GA_ID is configured
    if (!process.env.NEXT_PUBLIC_GA_ID) {
      console.warn('Google Analytics ID not configured');
      return;
    }

    // Initialize dataLayer immediately
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: unknown[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;

    // Initialize gtag
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: pathname + (searchParams ? `?${searchParams.toString()}` : ''),
      send_page_view: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false,
    });

    // Load Google Analytics script after dataLayer is ready
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    script.async = true;
    script.onload = () => {
      // Script loaded successfully
      (window as any).gtag('event', 'page_view', {
        page_path: pathname,
      });
    };
    document.head.appendChild(script);

    return () => {
      // Script is global and persistent across pages (which is desired for GA)
    };
  }, [pathname, searchParams]);

  return null;
}

/**
 * Track custom events in Google Analytics
 * 
 * Usage:
 * trackEvent('sphere_click', { clicks: 5 })
 * trackEvent('name_submitted', { name_length: 8 })
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

/**
 * Track page view in Google Analytics
 * 
 * Usage:
 * trackPageView('/page-title')
 */
export function trackPageView(pageName: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: pageName,
      page_path: window.location.pathname,
    });
  }
}
