export enum View {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  CATALOG = 'CATALOG',
  GALLERY = 'GALLERY',
  CONTACT = 'CONTACT',
  AI_GENERATOR = 'AI_GENERATOR',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  ADMIN_LOGIN = 'ADMIN_LOGIN'
}

export enum PolleraType {
  GALA = 'Gala',
  MONTUNA = 'Montuna',
  CONGO = 'Congo',
  NINA = 'Niña',
  ESTILIZADA = 'Estilizada',
  VERAGUENSE = 'Veraguense'
}

export enum Technique {
  SOMBREADA = 'Sombreada',
  MARCADA = 'Marcada',
  ZURCIDA = 'Zurcida',
  APLICACION = 'Aplicación'
}

export interface Product {
  id: string;
  name: string;
  type: PolleraType;
  technique: Technique;
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