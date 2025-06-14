import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { institutions } from '../../data/mockData';
import { Institution } from '../../types';
import { MapPin, Star, Clock, Phone } from 'lucide-react';
import Button from '../ui/Button';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom institution icon
const institutionIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#2E7D32" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface MapComponentProps {
  filteredInstitutions: Institution[];
  onInstitutionSelect: (institution: Institution) => void;
}

const LocationMarker: React.FC = () => {
  const { userLocation, setUserLocation } = useApp();
  const map = useMap();

  useEffect(() => {
    if (!userLocation) {
      map.locate({ setView: true, maxZoom: 13 });
    }
  }, [map, userLocation]);

  useEffect(() => {
    map.on('locationfound', (e) => {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    });

    map.on('locationerror', (e) => {
      console.log('Location error:', e.message);
      // Default to São Paulo center if geolocation fails
      const defaultLocation: [number, number] = [-23.5505, -46.6333];
      setUserLocation(defaultLocation);
      map.setView(defaultLocation, 13);
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map, setUserLocation]);

  if (!userLocation) return null;

  return (
    <Marker position={userLocation} icon={userIcon}>
      <Popup>
        <div className="p-2">
          <p className="font-medium text-green-600">Sua localização</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({
  filteredInstitutions,
  onInstitutionSelect
}) => {
  const { userLocation } = useApp();
  const mapRef = useRef<L.Map | null>(null);

  const center: [number, number] = userLocation || [-23.5505, -46.6333];

  const getInstitutionTypeLabel = (type: string) => {
    const types = {
      ong: 'ONG',
      church: 'Igreja',
      social_project: 'Projeto Social',
      hospital: 'Hospital',
      school: 'Escola'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        ref={mapRef}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker />
        
        {filteredInstitutions.map((institution) => (
          <Marker
            key={institution.id}
            position={institution.coordinates}
            icon={institutionIcon}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-3 min-w-[280px]">
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={institution.avatar}
                    alt={institution.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {institution.name}
                    </h3>
                    <p className="text-xs text-green-600 mt-1">
                      {getInstitutionTypeLabel(institution.type)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-xs">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{institution.rating}</span>
                    <span className="text-gray-500">({institution.totalRatings} avaliações)</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{institution.address.neighborhood}, {institution.address.city}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{institution.phone}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                  {institution.description}
                </p>

                <Button
                  size="sm"
                  onClick={() => onInstitutionSelect(institution)}
                  fullWidth
                >
                  Ver Mais
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;