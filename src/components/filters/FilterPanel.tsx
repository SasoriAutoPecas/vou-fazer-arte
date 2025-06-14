import React, { useState } from 'react';
import { Filter, X, Star, MapPin, Clock, Building } from 'lucide-react';
import { categories } from '../../data/mockData';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface FilterOptions {
  categories: string[];
  institutionTypes: string[];
  minRating: number;
  maxDistance: number;
  openNow: boolean;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const institutionTypes = [
    { id: 'ong', label: 'ONGs' },
    { id: 'church', label: 'Igrejas' },
    { id: 'social_project', label: 'Projetos Sociais' },
    { id: 'hospital', label: 'Hospitais' },
    { id: 'school', label: 'Escolas' }
  ];

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter(id => id !== categoryId)
      : [...localFilters.categories, categoryId];
    
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handleInstitutionTypeChange = (typeId: string) => {
    const newTypes = localFilters.institutionTypes.includes(typeId)
      ? localFilters.institutionTypes.filter(id => id !== typeId)
      : [...localFilters.institutionTypes, typeId];
    
    setLocalFilters({ ...localFilters, institutionTypes: newTypes });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      institutionTypes: [],
      minRating: 0,
      maxDistance: 50,
      openNow: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Categorias de Doação
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Institution Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Tipo de Instituição
              </h3>
              <div className="space-y-2">
                {institutionTypes.map((type) => (
                  <label key={type.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.institutionTypes.includes(type.id)}
                      onChange={() => handleInstitutionTypeChange(type.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Avaliação Mínima
              </h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setLocalFilters({ ...localFilters, minRating: rating })}
                    className={`
                      flex items-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${localFilters.minRating === rating
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Distância Máxima
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={localFilters.maxDistance}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxDistance: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span className="font-medium text-green-600">{localFilters.maxDistance} km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>

            {/* Open Now Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horário de Funcionamento
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.openNow}
                  onChange={(e) => setLocalFilters({ ...localFilters, openNow: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Apenas instituições abertas agora</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <Button onClick={applyFilters} fullWidth>
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={clearFilters} fullWidth>
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;