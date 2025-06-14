import React, { useState } from 'react';
import { 
  MapPin, Phone, Clock, Star, Calendar, 
  Heart, Users, Award, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Institution, Rating } from '../../types';
import { ratings } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Swal from 'sweetalert2';

interface InstitutionDetailModalProps {
  institution: Institution | null;
  isOpen: boolean;
  onClose: () => void;
}

const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({
  institution,
  isOpen,
  onClose
}) => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  if (!institution) return null;

  const institutionRatings = ratings.filter(r => r.institutionId === institution.id);

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

  const handleScheduleDonation = async () => {
    if (!isAuthenticated) {
      await Swal.fire({
        icon: 'info',
        title: 'Login necessário',
        text: 'Faça login para agendar uma doação',
        confirmButtonColor: '#2E7D32'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Agendamento iniciado!',
      text: 'Você será redirecionado para o formulário de doação',
      confirmButtonColor: '#2E7D32'
    });
    onClose();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={institution.avatar}
            alt={institution.name}
            className="w-full md:w-32 h-48 md:h-32 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {institution.name}
                </h2>
                <p className="text-green-600 font-medium mb-2">
                  {getInstitutionTypeLabel(institution.type)}
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(institution.rating))}
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {institution.rating} ({institution.totalRatings} avaliações)
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleScheduleDonation}
                size="lg"
                className="md:ml-4"
              >
                <Heart className="w-4 h-4 mr-2" />
                Agendar Doação
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium">Endereço</p>
              <p className="text-sm">
                {institution.address.street}, {institution.address.number}
              </p>
              <p className="text-sm">
                {institution.address.neighborhood}, {institution.address.city} - {institution.address.state}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium">Telefone</p>
              <p className="text-sm">{institution.phone}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'info'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'reviews'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Avaliações ({institutionRatings.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-64">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h3>
                <p className="text-gray-700 leading-relaxed">{institution.description}</p>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Horário de Funcionamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {institution.workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">
                        {schedule.closed 
                          ? 'Fechado' 
                          : `${schedule.openTime} - ${schedule.closeTime}`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tipos de Doação Aceitos</h3>
                <div className="flex flex-wrap gap-2">
                  {['Roupas', 'Móveis', 'Alimentos', 'Livros', 'Brinquedos'].map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {institutionRatings.length > 0 ? (
                institutionRatings.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        
                        {review.response && (
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Resposta da instituição:
                            </p>
                            <p className="text-sm text-gray-700">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ainda não há avaliações para esta instituição</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InstitutionDetailModal;