import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    google?: typeof google;
  }
}

interface GoogleMapsApiState {
  isLoaded: boolean;
  hasKey: boolean;
}

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const callbackName = "__gmaps_init_callback__";
    window[callbackName as unknown as keyof Window] = (() => {
      resolve();
    }) as unknown as never;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export function useGoogleMapsApi(): GoogleMapsApiState {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const hasKey = !!apiKey && apiKey.trim().length > 0;
  const [isLoaded, setIsLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!hasKey) {
      return;
    }

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    loadGoogleMapsScript(apiKey!)
      .then(() => {
        if (mountedRef.current) setIsLoaded(true);
      })
      .catch(() => {
        if (mountedRef.current) setIsLoaded(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [apiKey, hasKey]);

  return { isLoaded, hasKey };
}
