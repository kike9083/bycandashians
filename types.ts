export enum View {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  CATALOG = 'CATALOG',
  GALLERY = 'GALLERY',
  CONTACT = 'CONTACT',
  AI_GENERATOR = 'AI_GENERATOR',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  HISTORY = 'HISTORY',
  CRM = 'CRM',
  OFFER_LANDING = 'OFFER_LANDING',
  OFFER_EVENT = 'OFFER_EVENT'
}

export enum PolleraType {
  GALA = 'Pollera de Gala',
  MONTUNA = 'Pollera Montuna',
  CONGO = 'Pollera Congo',
  NINA = 'Pollera para Niña',
  ESTILIZADA = 'Pollera Estilizada',
  VERAGUENSE = 'Pollera Veragüense',
  OCUENA = 'Pollera Ocueña',
  CHIRICANA = 'Pollera Chiricana',
  DARIENITA = 'Pollera Darienita',
  ANTONERA = 'Pollera Antoñera',
  CHORRERANA = 'Pollera Chorrerana',
  BASQUINA = 'Pollera Basquiña',
  TIRIADA = 'Pollera Tiriada',
  ETNIAS = 'Etnias Panameñas'
}

export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
  image_fit?: 'cover' | 'contain';
  image_position?: 'top' | 'center' | 'bottom' | 'left' | 'right';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_name: string; // Stored as string in DB
  image: string;
  cta: string;
  image_fit?: 'cover' | 'contain';
  image_position?: 'top' | 'center' | 'bottom';
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  image_fit?: 'cover' | 'contain';
  image_position?: 'top' | 'center' | 'bottom';
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  message: string;
  status: 'New' | 'Contacted' | 'Booked' | 'Lost';
}
