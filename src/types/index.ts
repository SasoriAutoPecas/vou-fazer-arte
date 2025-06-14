export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  type: 'donor' | 'institution';
  avatar?: string;
  address: Address;
  createdAt: Date;
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  cnpj: string;
  type: 'ong' | 'church' | 'social_project' | 'hospital' | 'school';
  avatar?: string;
  address: Address;
  coordinates: [number, number];
  acceptedCategories: string[];
  workingHours: WorkingHours[];
  rating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: [number, number];
}

export interface WorkingHours {
  day: string;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  institutionId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  condition: 'new' | 'semi_new' | 'used';
  images: string[];
  status: 'pending' | 'scheduled' | 'delivered' | 'cancelled';
  scheduledDate?: Date;
  deliveredDate?: Date;
  createdAt: Date;
}

export interface Rating {
  id: string;
  donorId: string;
  institutionId: string;
  donationId: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}