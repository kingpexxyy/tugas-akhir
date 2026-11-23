export type RoomType = 'Standard' | 'Deluxe' | 'Executive' | 'Suite' | 'Family' | 'Presidential';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  capacity: number;
  price: number;
  size: string;
  bed: string;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: string[];
  featured?: boolean;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  hours: string;
  location: string;
  image: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  roomImage: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  totalPrice: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface SearchCriteria {
  checkIn: string;
  checkOut: string;
  guests: number;
}

