'use client';

import { useEffect, useRef } from 'react';
import { Place } from '@/types/place';

interface MapViewProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapView({ places, center = [55.0702, -3.6052], zoom = 10 }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && window.L) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      places.forEach(place => {
        const marker = window.L.marker([place.latitude, place.longitude])
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${place.name}</h3>
              <p class="text-sm text-gray-600">${place.category}</p>
              <a href="/places/${place.id}" class="text-blue-600 hover:underline text-sm">View Details</a>
            </div>
          `);
        markersRef.current.push(marker);
      });
    }
  }, [places]);

  function initializeMap() {
    if (!mapRef.current && window.L) {
      mapRef.current = window.L.map('map').setView(center, zoom);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }
  }

  return (
    <div id="map" className="w-full h-[500px] rounded-lg shadow-md" />
  );
} 