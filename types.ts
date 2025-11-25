export enum View {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  CATALOG = 'CATALOG',
  GALLERY = 'GALLERY',
  CONTACT = 'CONTACT',
  AI_GENERATOR = 'AI_GENERATOR'
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
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_name: string; // Stored as string in DB
  image: string;
  cta: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
}
