import React, { useState } from 'react';
import { Plus, Package, Calendar, Star, History, User, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/mockData';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Swal from 'sweetalert2';

const DonorDashboard: React.FC = () => {
  const { user, donations } = useApp();
  const [activeTab, setActiveTab] = useState<'donations' | 'history' | 'profile'>('donations');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    condition: 'semi_new'
  });

  const userDonations = donations.filter(d => d.donorId === user?.id);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await Swal.fire({
      icon: 'success',
      title: 'Doação cadastrada!',
      text: 'Sua doação foi registrada com sucesso. Você pode agendar a entrega quando desejar.',
      confirmButtonColor: '#2E7D32'
    });
    
    setShowDonationModal(false);
    setDonationForm({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      condition: 'semi_new'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Aguardando',
      scheduled: 'Agendado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const selectedCategory = categories.find(c => c.id === donationForm.category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name}!</h1>
            <p className="text-gray-600">Obrigado por fazer a diferença</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowDonationModal(true)}
          icon={Plus}
          size="lg"
        >
          Nova Doação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{userDonations.length}</p>
          <p className="text-gray-600">Doações Totais</p>
        </Card>
        
        <Card className="text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {userDonations.filter(d => d.status === 'scheduled').length}
          </p>
          <p className="text-gray-600">Agendamentos</p>
        </Card>
        
        <Card className="text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {userDonations.filter(d => d.status === 'delivered').length}
          </p>
          <p className="text-gray-600">Entregues</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'donations', label: 'Minhas Doações', icon: Package },
            { id: 'history', label: 'Histórico', icon: History },
            { id: 'profile', label: 'Perfil', icon: User }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${activeTab === id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'donations' && (
          <div className="space-y-4">
            {userDonations.length > 0 ? (
              userDonations.map((donation) => (
                <Card key={donation.id} hover className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donation.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusLabel(donation.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{donation.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Condição: {donation.condition === 'new' ? 'Novo' : donation.condition === 'semi_new' ? 'Seminovo' : 'Usado'}</span>
                        <span>•</span>
                        <span>Criado em {donation.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {donation.images[0] && (
                      <img
                        src={donation.images[0]}
                        alt={donation.title}
                        className="w-20 h-20 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Você ainda não cadastrou nenhuma doação</p>
                <Button onClick={() => setShowDonationModal(true)} icon={Plus}>
                  Cadastrar Primeira Doação
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Atividades</h3>
              <div className="space-y-3">
                {userDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(donation.status).replace('text-', 'bg-').replace('100', '500')}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{donation.title}</p>
                      <p className="text-xs text-gray-500">
                        {getStatusLabel(donation.status)} • {donation.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{user?.name}</h4>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">Membro desde {user?.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={user?.name || ''}
                  readOnly
                />
                <Input
                  label="E-mail"
                  value={user?.email || ''}
                  readOnly
                />
                <Input
                  label="Telefone"
                  value={user?.phone || ''}
                  readOnly
                />
                <Input
                  label="CPF"
                  value={user?.cpf || ''}
                  readOnly
                />
              </div>

              <div className="pt-4">
                <Button variant="outline">
                  Editar Perfil
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* New Donation Modal */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title="Nova Doação"
        size="lg"
      >
        <form onSubmit={handleDonationSubmit} className="space-y-4">
          <Input
            label="Título da Doação"
            value={donationForm.title}
            onChange={(e) => setDonationForm({ ...donationForm, title: e.target.value })}
            placeholder="Ex: Roupas de inverno infantis"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={donationForm.description}
              onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva os itens que você deseja doar..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={donationForm.category}
                onChange={(e) => setDonationForm({ ...donationForm, category: e.target.value, subcategory: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoria
              </label>
              <select
                value={donationForm.subcategory}
                onChange={(e) => setDonationForm({ ...donationForm, subcategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!donationForm.category}
                required
              >
                <option value="">Selecione uma subcategoria</option>
                {selectedCategory?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado do Item
            </label>
            <select
              value={donationForm.condition}
              onChange={(e) => setDonationForm({ ...donationForm, condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="new">Novo</option>
              <option value="semi_new">Seminovo</option>
              <option value="used">Usado</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDonationModal(false)}
              fullWidth
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              Cadastrar Doação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DonorDashboard;