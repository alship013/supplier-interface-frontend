import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapComponentProps {
  address: string;
  gpsCoordinates?: string;
  className?: string;
}

// Component to handle map centering when GPS coordinates change
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  address,
  gpsCoordinates,
  className = "h-96 w-full rounded-lg"
}) => {
  const [position, setPosition] = useState<[number, number]>([3.1390, 101.6869]); // Default: Kuala Lumpur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to parse GPS coordinates
  const parseCoordinates = (coords: string): [number, number] | null => {
    // Handle various coordinate formats
    const patterns = [
      /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/, // "3.1390,101.6869" or "3.1390 101.6869"
      /(-?\d+\.?\d*)[°\s]*[NS][,\s]+(-?\d+\.?\d*)[°\s]*[EW]/i, // "3.1390°N, 101.6869°E"
    ];

    for (const pattern of patterns) {
      const match = coords.match(pattern);
      if (match) {
        let lat = parseFloat(match[1]);
        let lng = parseFloat(match[2]);

        // Handle direction indicators
        if (coords.toLowerCase().includes('s') && lat > 0) lat = -lat;
        if (coords.toLowerCase().includes('w') && lng > 0) lng = -lng;

        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
    }
    return null;
  };

  // Function to geocode address using Nominatim (OpenStreetMap)
  const geocodeAddress = async (addr: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    return null;
  };

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      setError(null);

      // First try to parse GPS coordinates if provided
      if (gpsCoordinates) {
        const coords = parseCoordinates(gpsCoordinates);
        if (coords) {
          setPosition(coords);
          setLoading(false);
          return;
        }
      }

      // If no valid GPS coordinates, try to geocode the address
      if (address) {
        const coords = await geocodeAddress(address);
        if (coords) {
          setPosition(coords);
          setLoading(false);
          return;
        }
      }

      // If both fail, use default location
      setError('Could not determine location. Using default location.');
      setLoading(false);
    };

    getLocation();
  }, [address, gpsCoordinates]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-t-lg text-sm">
          {error}
        </div>
      )}
      <MapContainer
        center={position}
        zoom={13}
        className={`h-full w-full ${error ? 'rounded-b-lg' : 'rounded-lg'}`}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={position} />

        {/* Different tile layers for map and satellite view */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Optional satellite view layer (commented out by default) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN"
        /> */}

        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <strong>Supplier Location</strong><br />
              {address}<br />
              {gpsCoordinates && <span>GPS: {gpsCoordinates}</span>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;