import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { institutionService } from '../../services/institutionService';
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
  filters?: {
    categories?: string[];
    institutionTypes?: string[];
    minRating?: number;
    maxDistance?: number;
    openNow?: boolean;
  };
  onInstitutionSelect: (institution: any) => void;
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
  filters,
  onInstitutionSelect
}) => {
  const { userLocation } = useApp();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  const center: [number, number] = userLocation || [-23.5505, -46.6333];

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoading(true);
        const data = await institutionService.getInstitutions({
          ...filters,
          userLocation
        });
        setInstitutions(data);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, [filters, userLocation]);

  const getInstitutionTypeLabel = (type: string) => {
    const types = {
      ngo: 'ONG',
      church: 'Igreja',
      charity: 'Caridade',
      school: 'Escola',
      community_center: 'Centro Comunitário',
      other: 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

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
        
        {institutions.map((institution) => {
          const addresses = institution.users.addresses;
          if (!addresses?.length) return null;
          
          const address = addresses[0];
          if (!address?.latitude || !address?.longitude) return null;

          return (
            <Marker
              key={institution.id}
              position={[address.latitude, address.longitude]}
              icon={institutionIcon}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-3 min-w-[280px]">
                  <div className="flex items-start space-x-3 mb-3">
                    <img
                      src={institution.users.avatar_url || 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={institution.users.full_name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {institution.users.full_name}
                      </h3>
                      <p className="text-xs text-green-600 mt-1">
                        {getInstitutionTypeLabel(institution.institution_type)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-xs">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="font-medium">{institution.average_rating || 0}</span>
                      <span className="text-gray-500">({institution.total_donations || 0} doações)</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{address.neighborhood}, {address.city}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Phone className="w-3 h-3" />
                      <span>{institution.users.phone}</span>
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
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;