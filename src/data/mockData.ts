import { Institution, Category, Rating, Donation, User } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Roupas',
    icon: 'shirt',
    subcategories: [
      { id: '1-1', name: 'Roupas Infantis', categoryId: '1' },
      { id: '1-2', name: 'Roupas Adultas', categoryId: '1' },
      { id: '1-3', name: 'Calçados', categoryId: '1' },
      { id: '1-4', name: 'Acessórios', categoryId: '1' }
    ]
  },
  {
    id: '2',
    name: 'Móveis',
    icon: 'armchair',
    subcategories: [
      { id: '2-1', name: 'Móveis de Quarto', categoryId: '2' },
      { id: '2-2', name: 'Móveis de Sala', categoryId: '2' },
      { id: '2-3', name: 'Móveis de Cozinha', categoryId: '2' },
      { id: '2-4', name: 'Eletrodomésticos', categoryId: '2' }
    ]
  },
  {
    id: '3',
    name: 'Alimentos',
    icon: 'apple',
    subcategories: [
      { id: '3-1', name: 'Alimentos Não Perecíveis', categoryId: '3' },
      { id: '3-2', name: 'Frutas e Verduras', categoryId: '3' },
      { id: '3-3', name: 'Produtos de Limpeza', categoryId: '3' }
    ]
  },
  {
    id: '4',
    name: 'Livros',
    icon: 'book',
    subcategories: [
      { id: '4-1', name: 'Livros Didáticos', categoryId: '4' },
      { id: '4-2', name: 'Literatura', categoryId: '4' },
      { id: '4-3', name: 'Livros Infantis', categoryId: '4' }
    ]
  },
  {
    id: '5',
    name: 'Brinquedos',
    icon: 'gamepad-2',
    subcategories: [
      { id: '5-1', name: 'Brinquedos Educativos', categoryId: '5' },
      { id: '5-2', name: 'Jogos', categoryId: '5' },
      { id: '5-3', name: 'Pelúcias', categoryId: '5' }
    ]
  }
];

export const institutions: Institution[] = [
  {
    id: '1',
    name: 'Casa da Esperança',
    description: 'ONG dedicada ao apoio de famílias em situação de vulnerabilidade social. Atendemos mais de 200 famílias mensalmente com doações de roupas, alimentos e móveis.',
    email: 'contato@casadaesperanca.org',
    phone: '(11) 99999-0001',
    cnpj: '12.345.678/0001-90',
    type: 'ong',
    avatar: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    coordinates: [-23.5505, -46.6333],
    acceptedCategories: ['1', '2', '3'],
    workingHours: [
      { day: 'Segunda', openTime: '08:00', closeTime: '17:00', closed: false },
      { day: 'Terça', openTime: '08:00', closeTime: '17:00', closed: false },
      { day: 'Quarta', openTime: '08:00', closeTime: '17:00', closed: false },
      { day: 'Quinta', openTime: '08:00', closeTime: '17:00', closed: false },
      { day: 'Sexta', openTime: '08:00', closeTime: '17:00', closed: false },
      { day: 'Sábado', openTime: '08:00', closeTime: '12:00', closed: false },
      { day: 'Domingo', openTime: '', closeTime: '', closed: true }
    ],
    rating: 4.8,
    totalRatings: 156,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Igreja Comunidade Vida',
    description: 'Igreja evangélica que desenvolve projetos sociais na comunidade local. Recebemos doações para distribuir às famílias carentes do bairro.',
    email: 'social@igrejacomunidadevida.com',
    phone: '(11) 99999-0002',
    cnpj: '23.456.789/0001-01',
    type: 'church',
    avatar: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: {
      street: 'Avenida da Paz',
      number: '456',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02345-678'
    },
    coordinates: [-23.5525, -46.6420],
    acceptedCategories: ['1', '3', '4', '5'],
    workingHours: [
      { day: 'Segunda', openTime: '09:00', closeTime: '18:00', closed: false },
      { day: 'Terça', openTime: '09:00', closeTime: '18:00', closed: false },
      { day: 'Quarta', openTime: '09:00', closeTime: '21:00', closed: false },
      { day: 'Quinta', openTime: '09:00', closeTime: '18:00', closed: false },
      { day: 'Sexta', openTime: '09:00', closeTime: '18:00', closed: false },
      { day: 'Sábado', openTime: '09:00', closeTime: '16:00', closed: false },
      { day: 'Domingo', openTime: '08:00', closeTime: '12:00', closed: false }
    ],
    rating: 4.6,
    totalRatings: 89,
    createdAt: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Projeto Crescer Juntos',
    description: 'Projeto social focado no desenvolvimento infantil através da educação e cultura. Precisamos de livros, brinquedos educativos e material escolar.',
    email: 'contato@crescerjuntos.org',
    phone: '(11) 99999-0003',
    cnpj: '34.567.890/0001-12',
    type: 'social_project',
    avatar: 'https://images.pexels.com/photos/8363026/pexels-photo-8363026.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: {
      street: 'Rua da Educação',
      number: '789',
      neighborhood: 'Jardim das Crianças',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03456-789'
    },
    coordinates: [-23.5485, -46.6380],
    acceptedCategories: ['4', '5'],
    workingHours: [
      { day: 'Segunda', openTime: '07:00', closeTime: '19:00', closed: false },
      { day: 'Terça', openTime: '07:00', closeTime: '19:00', closed: false },
      { day: 'Quarta', openTime: '07:00', closeTime: '19:00', closed: false },
      { day: 'Quinta', openTime: '07:00', closeTime: '19:00', closed: false },
      { day: 'Sexta', openTime: '07:00', closeTime: '19:00', closed: false },
      { day: 'Sábado', openTime: '', closeTime: '', closed: true },
      { day: 'Domingo', openTime: '', closeTime: '', closed: true }
    ],
    rating: 4.9,
    totalRatings: 234,
    createdAt: new Date('2023-02-10')
  },
  {
    id: '4',
    name: 'Lar dos Idosos São Francisco',
    description: 'Casa de repouso para idosos que necessitam de cuidados especiais. Aceitamos doações de roupas, móveis e produtos de higiene.',
    email: 'doacao@larsaofrancisco.org',
    phone: '(11) 99999-0004',
    cnpj: '45.678.901/0001-23',
    type: 'ong',
    avatar: 'https://images.pexels.com/photos/7551613/pexels-photo-7551613.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: {
      street: 'Rua do Carinho',
      number: '321',
      neighborhood: 'Vila dos Idosos',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04567-890'
    },
    coordinates: [-23.5560, -46.6290],
    acceptedCategories: ['1', '2', '3'],
    workingHours: [
      { day: 'Segunda', openTime: '08:00', closeTime: '16:00', closed: false },
      { day: 'Terça', openTime: '08:00', closeTime: '16:00', closed: false },
      { day: 'Quarta', openTime: '08:00', closeTime: '16:00', closed: false },
      { day: 'Quinta', openTime: '08:00', closeTime: '16:00', closed: false },
      { day: 'Sexta', openTime: '08:00', closeTime: '16:00', closed: false },
      { day: 'Sábado', openTime: '09:00', closeTime: '14:00', closed: false },
      { day: 'Domingo', openTime: '', closeTime: '', closed: true }
    ],
    rating: 4.7,
    totalRatings: 112,
    createdAt: new Date('2023-04-05')
  }
];

export const ratings: Rating[] = [
  {
    id: '1',
    donorId: 'donor1',
    institutionId: '1',
    donationId: 'donation1',
    rating: 5,
    comment: 'Experiência maravilhosa! A equipe foi muito receptiva e organizou tudo de forma perfeita. Recomendo muito!',
    response: 'Muito obrigado pelo carinho! É sempre um prazer receber pessoas como você.',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    donorId: 'donor2',
    institutionId: '1',
    donationId: 'donation2',
    rating: 4,
    comment: 'Ótimo atendimento, mas o processo de agendamento poderia ser mais ágil.',
    createdAt: new Date('2024-01-08')
  },
  {
    id: '3',
    donorId: 'donor3',
    institutionId: '2',
    donationId: 'donation3',
    rating: 5,
    comment: 'Local muito bem organizado e pessoas dedicadas. Voltarei a doar em breve!',
    response: 'Que Deus abençoe sua generosidade! Estaremos sempre de portas abertas.',
    createdAt: new Date('2024-01-05')
  }
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    donorId: 'donor1',
    institutionId: '1',
    title: 'Roupas de inverno infantis',
    description: 'Casacos, calças e sapatos em ótimo estado, tamanhos 4 a 8 anos',
    category: '1',
    subcategory: '1-1',
    condition: 'semi_new',
    images: ['https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400'],
    status: 'delivered',
    scheduledDate: new Date('2024-01-08'),
    deliveredDate: new Date('2024-01-08'),
    createdAt: new Date('2024-01-05')
  },
  {
    id: '2',
    donorId: 'donor1',
    institutionId: '2',
    title: 'Livros didáticos ensino fundamental',
    description: 'Coleção completa de livros do 5º ano em perfeito estado',
    category: '4',
    subcategory: '4-1',
    condition: 'new',
    images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'],
    status: 'scheduled',
    scheduledDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-12')
  }
];

export const mockUser: User = {
  id: 'donor1',
  name: 'Maria Silva',
  email: 'maria.silva@email.com',
  phone: '(11) 99999-1234',
  cpf: '123.456.789-00',
  type: 'donor',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  address: {
    street: 'Rua das Palmeiras',
    number: '100',
    neighborhood: 'Jardim Paulista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-000'
  },
  createdAt: new Date('2023-12-01')
};