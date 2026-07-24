import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";

export interface PlaceResult {
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
}

interface GoogleMapFieldProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  disabled?: boolean;
  onPlaceSelect: (place: PlaceResult) => void;
  onMarkerDrag?: (lat: number, lng: number) => void;
}

export function GoogleMapField({
  latitude,
  longitude,
  address,
  disabled,
  onPlaceSelect,
  onMarkerDrag,
}: GoogleMapFieldProps) {
  const { isLoaded, hasKey } = useGoogleMapsApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(address);

  useEffect(() => {
    setInputValue(address);
  }, [address]);

  const center: google.maps.LatLngLiteral = {
    lat: latitude ?? 33.5731,
    lng: longitude ?? -7.5898,
  };

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });

    markerRef.current = new google.maps.Marker({
      position: center,
      map: mapRef.current,
      draggable: !disabled,
    });

    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current?.getPosition();
      if (pos && onMarkerDrag) {
        onMarkerDrag(pos.lat(), pos.lng());
      }
    });
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      fields: ["formatted_address", "address_components", "geometry"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const formattedAddress = place.formatted_address ?? "";

      const cityComponent = place.address_components?.find((c: google.maps.GeocoderAddressComponent) =>
        c.types.includes("locality") || c.types.includes("administrative_area_level_2")
      );
      const city = cityComponent?.long_name;

      onPlaceSelect({ address: formattedAddress, city, latitude: lat, longitude: lng });

      if (mapRef.current && markerRef.current) {
        const newCenter = { lat, lng };
        mapRef.current.setCenter(newCenter);
        markerRef.current.setPosition(newCenter);
      }
    });
  }, [isLoaded, onPlaceSelect]);

  if (!hasKey) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A968E]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onPlaceSelect({
              address: inputValue,
              latitude: latitude ?? 0,
              longitude: longitude ?? 0,
            })}
            placeholder="Saisissez l'adresse de votre cabinet"
            disabled={disabled}
            className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white pl-10 pr-[15px] text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]"
          />
        </div>
        <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-[#D9D6D0] bg-[#F7F7F5]">
          <MapPin className="h-8 w-8 text-[#D9D6D0]" />
          <p className="text-[13px] text-[#9A968E]">
            Carte interactive indisponible
          </p>
          <p className="text-[11.5px] text-[#B4AFA6]">
            Configurez VITE_GOOGLE_MAPS_API_KEY pour activer Google Maps
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-[#F7F7F5]">
        <p className="text-[13px] text-[#9A968E]">Chargement de la carte…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A968E]" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Recherchez une adresse…"
          disabled={disabled}
          className="h-[50px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-white pl-10 pr-[15px] text-[15px] font-medium text-[#1C1B1A] placeholder:text-[#B4AFA6] focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]"
        />
      </div>
      <div
        ref={mapContainerRef}
        className="h-[250px] w-full rounded-[12px] border-[1.5px] border-[#E7E5E1]"
      />
    </div>
  );
}
