export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
  highlights?: Array<{
    title: string;
    description: string;
  }>;
} 