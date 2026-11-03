export interface ZoneGalleryItem {
  url: string
  title: string
  caption: string
}

export interface ExperienceZone {
  id: 'terraza' | 'cava' | 'salon-principal'
  name: string
  shortName: string
  subtitle: string
  description: string
  avgSpend: string
  depositPolicy: string
  dressCode: string
  capacityLabel: string
  rating: number
  reviewCount: number
  imageUrl: string
  videoUrl: string
  gallery: ZoneGalleryItem[]
  amenities: { name: string; icon: string }[]
  badge?: string
}

export interface SignatureDish {
  id: string
  name: string
  category: 'Brasa & Cortes' | 'Mar & Fuego' | 'Cava & Mixología'
  description: string
  price: string
  imageUrl: string
  tag: string
  portion: string
  pairing: string
  ingredients: string[]
}

export const EXPERIENCES: ExperienceZone[] = [
  {
    id: 'salon-principal',
    name: 'Salón Imperial & Cocina de Brasa',
    shortName: 'Salón Principal',
    subtitle: 'Parrilla Josper en Vivo · Wagyu A5 · Zona Dorada Metepec',
    description: 'El corazón gastronómico de Vespera Hub en Metepec. Techos de doble altura, arquitectura en madera y piedra volcánica con vista a nuestra cocina abierta de brasa.',
    avgSpend: '$1,950 MXN / persona',
    depositPolicy: 'Reserva sin cargo · Tolerancia 15 min',
    dressCode: 'Smart Elegant',
    capacityLabel: '2 a 10 comensales',
    rating: 4.9,
    reviewCount: 680,
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/29050/29050-720.mp4',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
        title: 'Cortes Wagyu A5 a la Brasa',
        caption: 'Sellados al carbón de encino blanco en horno Josper a 400°C.'
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
        title: 'Salón Imperial de Doble Altura',
        caption: 'Diseño acústico envolvente e iluminación cálida de autor en Metepec.'
      },
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
        title: 'Servicio de Gueridón en Mesa',
        caption: 'Preparaciones flameadas y trufa negra fresca laminada al momento.'
      },
      {
        url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=85',
        title: 'Cocina Abierta de Fuego',
        caption: 'Vista directa al pase gastronómico del Chef Mateo Valdés.'
      }
    ],
    badge: 'Insignia Metepec',
    amenities: [
      { name: 'Cocina Abierta Josper', icon: 'Flame' },
      { name: 'Cortes Wagyu A5', icon: 'Utensils' },
      { name: 'Acústica Envolvente', icon: 'Music' },
      { name: 'Valet Parking VIP', icon: 'Car' }
    ]
  },
  {
    id: 'terraza',
    name: 'Terraza Climatizada & Fire Pit',
    shortName: 'Terraza & Fire Pit',
    subtitle: 'Fogateros Cálidos · Mixología Botánica · DJ Lounge',
    description: 'Diseñada para las noches frescas de Metepec: terraza techada con calefacción ambiental, fogateros de piedra en mesa y barra central de alta coctelería.',
    avgSpend: '$1,750 MXN / persona',
    depositPolicy: 'Reserva sin cargo · Tolerancia 15 min',
    dressCode: 'Smart Casual / Elegant',
    capacityLabel: '2 a 8 comensales',
    rating: 4.9,
    reviewCount: 540,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    videoUrl: '/videos/restaurant-main.mp4',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
        title: 'Terraza Nocturna Climatizada',
        caption: 'Equipada con calefacción radiante y fogateros para el clima de Metepec.'
      },
      {
        url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85',
        title: 'Barra Central de Mixología',
        caption: 'Destilados de colección, infusiones botánicas y coctelería de autor.'
      },
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
        title: 'Coctelería Ahumada al Momento',
        caption: 'Negronis y Carajillos servidos con campana de humo de romero y canela.'
      },
      {
        url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85',
        title: 'DJ Set & Deep House Lounge',
        caption: 'Curaduría musical en vivo de jueves a sábado a partir de las 20:30 hrs.'
      }
    ],
    badge: 'Más Solicitada',
    amenities: [
      { name: 'Calefacción & Fire Pits', icon: 'Flame' },
      { name: 'Mixología de Autor', icon: 'Sparkles' },
      { name: 'DJ Set Acústico', icon: 'Music' },
      { name: 'Ambiente Nocturno', icon: 'Eye' }
    ]
  },
  {
    id: 'cava',
    name: 'La Cava Subterránea Privada',
    shortName: 'La Cava Privada',
    subtitle: '850+ Etiquetas Gran Reserva · Sommelier Dedicado',
    description: 'El salón más exclusivo de Metepec y el Valle de Toluca. Mesa imperial en roble rodeada de nuestra colección privada de vinos para cenas de negocios o aniversarios.',
    avgSpend: '$2,600 MXN / persona',
    depositPolicy: 'Atención de Sommelier en mesa',
    dressCode: 'Formal / Cocktail',
    capacityLabel: '4 a 12 comensales',
    rating: 5.0,
    reviewCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
    videoUrl: '/videos/wine-pouring-41257.mp4',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
        title: 'Bodega Subterránea a 14°C',
        caption: 'Más de 850 etiquetas del Viejo y Nuevo Mundo resguardadas en piedra.'
      },
      {
        url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85',
        title: 'Maridaje Guiado por Sommelier',
        caption: 'Selección personalizada por copa o botella para cada tiempo de tu cena.'
      },
      {
        url: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=1200&q=85',
        title: 'Mesa Imperial Confidencial',
        caption: 'Privacidad absoluta para consejos directivos, cierres o celebraciones.'
      },
      {
        url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=85',
        title: 'Colección de Cristalería Riedel',
        caption: 'Servicio de decantación en cristal soplado para grandes reservas.'
      }
    ],
    badge: 'Ultra VIP Privado',
    amenities: [
      { name: 'Sommelier Exclusivo', icon: 'Wine' },
      { name: '850+ Etiquetas', icon: 'ShieldCheck' },
      { name: 'Privacidad Total', icon: 'Lock' },
      { name: 'Acceso Directo Valet', icon: 'Car' }
    ]
  }
]

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    id: 'wagyu-a5',
    name: 'Ribeye Wagyu A5 Miyazaki',
    category: 'Brasa & Cortes',
    description: 'Sellado a las brasas de encino blanco con mantequilla de trufa negra fresca y flor de sal ahumada.',
    price: '$2,450',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
    tag: 'Favorito en Metepec',
    portion: '400 g · Certificado Prefectura Miyazaki, Japón',
    pairing: 'Cabernet Sauvignon Gran Reserva o Nebbiolo de Barolo decantado a 16°C.',
    ingredients: ['Wagyu A5 BMS 11', 'Trufa Negra Périgord', 'Carbón de Encino', 'Sal Maldon Ahumada']
  },
  {
    id: 'lubina-josper',
    name: 'Lubina Salvaje al Josper',
    category: 'Mar & Fuego',
    description: 'Pesca sustentable del día sobre emulsión de azafrán español, espárragos trigueros y caviar cítrico.',
    price: '$980',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85',
    tag: 'Temporada',
    portion: '320 g · Filete con piel crujiente al fuego',
    pairing: 'Albariño de Rías Baixas o Chardonnay fermentado en barrica francesa.',
    ingredients: ['Lubina de Ría', 'Azafrán de La Mancha', 'Espárrago Triguero', 'Caviar Cítrico']
  },
  {
    id: 'langosta-risotto',
    name: 'Cola de Langosta & Risotto Negro',
    category: 'Mar & Fuego',
    description: 'Langosta del Caribe glaseada al grill sobre risotto venere en reducción de bisque y coral.',
    price: '$1,390',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85',
    tag: 'Icono Vespera',
    portion: '360 g · Cola entera a las brasas con mantequilla clarificada',
    pairing: 'Champagne Brut Rosé o Viognier de altura.',
    ingredients: ['Langosta del Caribe', 'Arroz Acquerello', 'Reducción de Bisque', 'Azafrán & Coral']
  },
  {
    id: 'smoked-negroni',
    name: 'Vespera Smoked Negroni',
    category: 'Cava & Mixología',
    description: 'Gin botánico artesanal, Campari reposado en barrica de roble francés y humo de romero en mesa.',
    price: '$390',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85',
    tag: 'Signature Cocktail',
    portion: '180 ml · Ahumado en campana de cristal frente al comensal',
    pairing: 'Ideal como aperitivo antes de cortes a la brasa o entradas de mar.',
    ingredients: ['Gin Botánico', 'Campari en Roble', 'Vermut Antica Formula', 'Humo de Romero']
  }
]

export const DINING_OCCASIONS = [
  'Cena Romántica',
  'Aniversario',
  'Cumpleaños VIP',
  'Cena de Negocios'
]
