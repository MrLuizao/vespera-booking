export interface WebReservationPayload {
  restaurantId: string;
  zoneId: 'terraza' | 'cava' | 'salon-principal';
  guestName: string;
  guestPhone: string; // Identificador principal
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  specialRequests?: string;
  source: 'INSTAGRAM' | 'GOOGLE_MAPS' | 'DIRECT';
  userAgent: string;
}

export interface StoredReservation extends WebReservationPayload {
  id: string; // ID corto de 6 caracteres (ej. 'MC-4821')
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED';
  applePassUrl: string;
  googleWalletUrl: string;
  createdAt: string;
}
