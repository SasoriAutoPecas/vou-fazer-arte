import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, Navigation } from 'lucide-react';
import { useApp } from './context/AppContext';
import { institutionService } from './services/institutionService';
import { categoryService } from './services/categoryService';
import Header from './components/layout/Header';
import MapComponent from './components/map/MapComponent';
import FilterPanel from './components/filters/FilterPanel';
import LoginModal from './components/auth/LoginModal';
import InstitutionDetailModal from './components/institution/InstitutionDetailModal';
import DonorDashboard from './components/dashboard/DonorDashboard';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { useGeolocation } from './hooks/useGeolocation';

interface FilterOptions {
  categories: string[];
  institutionTypes: string[];
  minRating: number;
  maxDistance: number;
  openNow: boolean;
}

function App() {
  const { isAuthenticated, selectedInstitution, setSelectedInstitution, setUserLocation, loading: authLoading } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    institutionTypes: [],
    minRating: 0,
    maxDistance: 50,
    openNow: false
  });

  const geolocation = useGeolocation();

  // Set user location when geolocation is available
  React.useEffect(() => {
    if (geolocation.coordinates) {
      setUserLocation(geolocation.coordinates);
    }
  }, [geolocation.coordinates, setUserLocation]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [institutionsData, categoriesData] = await Promise.all([
          institutionService.getInstitutions(),
          categoryService.getCategories()
        ]);
        setInstitutions(institutionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);

  const filteredInstitutions = useMemo(() => {
    let filtered = institutions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(institution =>
        institution.users.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institution.users.addresses[0]?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institution.users.addresses[0]?.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(institution =>
        institution.institution_categories.some((ic: any) => 
          filters.categories.includes(ic.donation_categories.id)
        )
      );
    }

    // Institution type filter
    if (filters.institutionTypes.length > 0) {
      filtered = filtered.filter(institution =>
        filters.institutionTypes.includes(institution.institution_type)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(institution =>
        (institution.average_rating || 0) >= filters.minRating
      );
    }

    return filtered;
  }, [institutions, searchQuery, filters]);

  const handleInstitutionSelect = (institution: any) => {
    setSelectedInstitution(institution);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLoginClick={() => setShowLoginModal(true)} />
        
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setShowDashboard(false)}
              className="mb-4"
            >
              ← Voltar ao Mapa
            </Button>
          </div>
          <DonorDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLoginClick={() => setShowLoginModal(true)} />
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col lg:h-screen lg:sticky lg:top-16">
          {/* Search and Filters Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex space-x-2 mb-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="Buscar instituições..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth={false}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                icon={Filter}
                onClick={() => setShowFilters(true)}
              >
                Filtros
              </Button>
            </div>

            {isAuthenticated && (
              <Button
                variant="secondary"
                onClick={() => setShowDashboard(true)}
                fullWidth
                size="sm"
              >
                Meu Dashboard
              </Button>
            )}
          </div>

          {/* Institution List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  Instituições ({filteredInstitutions.length})
                </h2>
                {geolocation.loading && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Navigation className="w-4 h-4 mr-1 animate-pulse" />
                    Localizando...
                  </div>
                )}
              </div>

              {filteredInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleInstitutionSelect(institution)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={institution.users.avatar_url || 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={institution.users.full_name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {institution.users.full_name}
                      </h3>
                      <p className="text-sm text-green-600 mb-1">
                        {institution.institution_type === 'ngo' ? 'ONG' : 
                         institution.institution_type === 'church' ? 'Igreja' :
                         institution.institution_type === 'charity' ? 'Caridade' :
                         institution.institution_type === 'school' ? 'Escola' :
                         institution.institution_type === 'community_center' ? 'Centro Comunitário' :
                         institution.institution_type}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {institution.average_rating || 0}
                          </span>
                          <span className="text-yellow-500 ml-1">★</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({institution.total_donations || 0})
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {institution.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredInstitutions.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma instituição encontrada</p>
                  <p className="text-sm">Tente ajustar os filtros de busca</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-96 lg:min-h-0">
          <div className="absolute inset-0">
            <MapComponent
              filters={filters}
              onInstitutionSelect={handleInstitutionSelect}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />

      <InstitutionDetailModal
        institution={selectedInstitution}
        isOpen={!!selectedInstitution}
        onClose={() => setSelectedInstitution(null)}
      />
    </div>
  );
}

export default App;