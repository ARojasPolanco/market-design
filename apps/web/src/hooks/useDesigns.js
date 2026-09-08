const MOCK_DESIGNS = [
  {
    id: '1',
    title: 'Mandala Tribal',
    description:
      'Diseño de mandala tribal con patrones geométricos intrincados. Ideal para sublimación en remeras y buzos.',
    price: 2500,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/e94560?text=Mandala+Tribal',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.8,
    ratingCount: 56,
    salesCount: 142,
    viewCount: 1850,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2024-11-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Flor de Loto Acuarela',
    description:
      'Flor de loto pintada en acuarela con efecto de salpicadura. Perfecta para papelería y textiles.',
    price: 1800,
    previewUrl: 'https://placehold.co/600x600/0f3460/e94560?text=Flor+de+Loto',
    category: 'papeleria',
    technique: 'estampado',
    rating: 4.5,
    ratingCount: 34,
    salesCount: 89,
    viewCount: 1200,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2024-12-01T14:20:00Z',
  },
  {
    id: '3',
    title: 'Dinosaurio Infantil',
    description: 'T-Rex divertido con gorro de fiesta. Diseño cute para estampado infantil.',
    price: 1500,
    previewUrl: 'https://placehold.co/600x600/533483/e94560?text=Dinosaurio',
    category: 'infantil',
    technique: 'estampado',
    rating: 4.9,
    ratingCount: 89,
    salesCount: 234,
    viewCount: 3200,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2024-12-10T09:15:00Z',
  },
  {
    id: '4',
    title: 'Rosa Negra Gótica',
    description:
      'Rosa negra con elementos góticos y mariposas. Ideal para sublimación en tazas y remeras.',
    price: 2200,
    previewUrl: 'https://placehold.co/600x600/16213e/e94560?text=Rosa+Negra',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.7,
    ratingCount: 67,
    salesCount: 178,
    viewCount: 2100,
    status: 'approved',
    seller: {
      id: 's3',
      name: 'SublimeArte',
      avatar: 'https://placehold.co/100x100/0f3460/53d8fb?text=SA',
      rating: 4.8,
      salesCount: 890,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2024-12-15T16:45:00Z',
  },
  {
    id: '5',
    title: 'Copa del Mundo',
    description:
      'Diseño temático de fútbol con trofeo y balón. Para sublimación en camisetas deportivas.',
    price: 3000,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/53d8fb?text=Futbol',
    category: 'deportivo',
    technique: 'sublimado',
    rating: 4.3,
    ratingCount: 23,
    salesCount: 67,
    viewCount: 890,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-01-05T11:00:00Z',
  },
  {
    id: '6',
    title: 'Cruz Ornamental',
    description:
      'Cruz cristiana con detalles ornamentales dorados. Papelería religiosa y decoración.',
    price: 1200,
    previewUrl: 'https://placehold.co/600x600/533483/ffd700?text=Cruz',
    category: 'religioso',
    technique: 'estampado',
    rating: 4.6,
    ratingCount: 45,
    salesCount: 156,
    viewCount: 1800,
    status: 'approved',
    seller: {
      id: 's4',
      name: 'Papelería Creativa',
      avatar: 'https://placehold.co/100x100/533483/ffd700?text=PC',
      rating: 4.4,
      salesCount: 340,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-01-10T08:30:00Z',
  },
  {
    id: '7',
    title: 'Lobo Geométrico',
    description:
      'Lobo con diseño geométrico low-poly en tonos azules y violetas. Arte moderno para remeras.',
    price: 2800,
    previewUrl: 'https://placehold.co/600x600/0f3460/53d8fb?text=Lobo+Geo',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.9,
    ratingCount: 112,
    salesCount: 312,
    viewCount: 4500,
    status: 'approved',
    seller: {
      id: 's3',
      name: 'SublimeArte',
      avatar: 'https://placehold.co/100x100/0f3460/53d8fb?text=SA',
      rating: 4.8,
      salesCount: 890,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-01-12T13:20:00Z',
  },
  {
    id: '8',
    title: 'Unicornio Arcoíris',
    description: 'Unicornio mágico con crin de arcoíris y estrellas. Diseño infantil adorable.',
    price: 1600,
    previewUrl: 'https://placehold.co/600x600/533483/ff69b4?text=Unicornio',
    category: 'infantil',
    technique: 'estampado',
    rating: 4.8,
    ratingCount: 78,
    salesCount: 198,
    viewCount: 2800,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '9',
    title: 'Fruta Tropical',
    description:
      'Patrón de frutas tropicales (ananá, palmera, flamenco). Para sublimación en vasos y remeras.',
    price: 2000,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/00ff88?text=Tropical',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.4,
    ratingCount: 38,
    salesCount: 95,
    viewCount: 1350,
    status: 'approved',
    seller: {
      id: 's4',
      name: 'Papelería Creativa',
      avatar: 'https://placehold.co/100x100/533483/ffd700?text=PC',
      rating: 4.4,
      salesCount: 340,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-01-18T15:30:00Z',
  },
  {
    id: '10',
    title: 'Frase Motivacional',
    description:
      '"Nunca dejes de soñar" con tipografía decorativa y flores. Papelería y decoración.',
    price: 900,
    previewUrl: 'https://placehold.co/600x600/0f3460/e94560?text=Frase',
    category: 'papeleria',
    technique: 'estampado',
    rating: 4.2,
    ratingCount: 92,
    salesCount: 245,
    viewCount: 3100,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-01-20T09:45:00Z',
  },
  {
    id: '11',
    title: 'Calavera Mexicana',
    description:
      'Calavera Day of the Dead con flores y colores vibrantes. Sublimación en remeras y tazas.',
    price: 2100,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/e94560?text=Calavera',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.7,
    ratingCount: 54,
    salesCount: 167,
    viewCount: 2300,
    status: 'approved',
    seller: {
      id: 's3',
      name: 'SublimeArte',
      avatar: 'https://placehold.co/100x100/0f3460/53d8fb?text=SA',
      rating: 4.8,
      salesCount: 890,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-01-22T11:00:00Z',
  },
  {
    id: '12',
    title: 'Oso Panda Kawaii',
    description: 'Panda kawaii comiendo bambú. Diseño adorable para infantil y juvenil.',
    price: 1400,
    previewUrl: 'https://placehold.co/600x600/533483/ffffff?text=Panda',
    category: 'infantil',
    technique: 'estampado',
    rating: 4.6,
    ratingCount: 41,
    salesCount: 123,
    viewCount: 1700,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-01-25T14:00:00Z',
  },
  {
    id: '13',
    title: 'Mandala Flor Circular',
    description:
      'Mandala floral circular con pétalos simétricos. Ideal para sublimación en cojines y remeras.',
    price: 2300,
    previewUrl: 'https://placehold.co/600x600/0f3460/e94560?text=Mandala+Flor',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.5,
    ratingCount: 29,
    salesCount: 78,
    viewCount: 980,
    status: 'approved',
    seller: {
      id: 's4',
      name: 'Papelería Creativa',
      avatar: 'https://placehold.co/100x100/533483/ffd700?text=PC',
      rating: 4.4,
      salesCount: 340,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-01-28T09:00:00Z',
  },
  {
    id: '14',
    title: 'Dragón Oriental',
    description: 'Dragón chino con nubes y llamas. Diseño detallado para sublimación premium.',
    price: 3500,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/ffd700?text=Dragon',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.9,
    ratingCount: 87,
    salesCount: 256,
    viewCount: 3800,
    status: 'approved',
    seller: {
      id: 's3',
      name: 'SublimeArte',
      avatar: 'https://placehold.co/100x100/0f3460/53d8fb?text=SA',
      rating: 4.8,
      salesCount: 890,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: '15',
    title: 'Invitación Boda Floral',
    description:
      'Invitación de boda con acuarela floral y tipografía elegante. Papelería para eventos.',
    price: 800,
    previewUrl: 'https://placehold.co/600x600/533483/ff69b4?text=Boda',
    category: 'papeleria',
    technique: 'estampado',
    rating: 4.3,
    ratingCount: 19,
    salesCount: 67,
    viewCount: 890,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-03T15:00:00Z',
  },
  {
    id: '16',
    title: 'Gato Astronauta',
    description: 'Gato flotando en el espacio con casco de astronauta. Diseño trendy para remeras.',
    price: 1900,
    previewUrl: 'https://placehold.co/600x600/0f3460/53d8fb?text=Gato+Space',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.8,
    ratingCount: 95,
    salesCount: 289,
    viewCount: 4100,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-02-05T12:00:00Z',
  },
  {
    id: '17',
    title: 'Camiseta Racing Club',
    description: 'Diseño alternativo de camiseta racing con detalles geométricos. DTF o sublimado.',
    price: 2700,
    previewUrl: 'https://placehold.co/600x600/1a1a2e/00ff88?text=Racing',
    category: 'deportivo',
    technique: 'dtf',
    rating: 4.4,
    ratingCount: 31,
    salesCount: 98,
    viewCount: 1400,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-08T16:00:00Z',
  },
  {
    id: '18',
    title: 'Santos y Vírgenes',
    description:
      'Colección de santos y vírgenes con marcos ornamentados. Papelería religiosa premium.',
    price: 1500,
    previewUrl: 'https://placehold.co/600x600/533483/ffd700?text=Santos',
    category: 'religioso',
    technique: 'estampado',
    rating: 4.5,
    ratingCount: 22,
    salesCount: 89,
    viewCount: 1100,
    status: 'approved',
    seller: {
      id: 's4',
      name: 'Papelería Creativa',
      avatar: 'https://placehold.co/100x100/533483/ffd700?text=PC',
      rating: 4.4,
      salesCount: 340,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-10T08:00:00Z',
  },
  {
    id: '19',
    title: 'Helado Drip',
    description:
      'Cónico de helado con efecto drip y sprinkles. Colorido y divertido para sublimar.',
    price: 1300,
    previewUrl: 'https://placehold.co/600x600/0f3460/ff69b4?text=Helado',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 4.1,
    ratingCount: 15,
    salesCount: 45,
    viewCount: 670,
    status: 'approved',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-02-12T13:00:00Z',
  },
  {
    id: '20',
    title: 'Mariposa Acuarela',
    description:
      'Mariposa monarca pintada en acuarela con fondos de salpicadura. Para papelería y textiles.',
    price: 1700,
    previewUrl: 'https://placehold.co/600x600/533483/e94560?text=Mariposa',
    category: 'papeleria',
    technique: 'estampado',
    rating: 4.6,
    ratingCount: 48,
    salesCount: 134,
    viewCount: 1900,
    status: 'approved',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-15T10:00:00Z',
  },
  // Diseños pendientes de moderación
  {
    id: '21',
    title: 'Paw Patrol Fan Art',
    description: 'Diseño inspirado en Paw Patrol para remeras infantiles.',
    price: 1200,
    previewUrl: 'https://placehold.co/600x600/ff6b6b/ffffff?text=Paw+Patrol',
    category: 'infantil',
    technique: 'estampado',
    rating: 0,
    ratingCount: 0,
    salesCount: 0,
    viewCount: 0,
    status: 'pending',
    seller: {
      id: 's1',
      name: 'Diseños María',
      avatar: 'https://placehold.co/100x100/16213e/e94560?text=DM',
      rating: 4.9,
      salesCount: 523,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-02-18T09:00:00Z',
  },
  {
    id: '22',
    title: 'Logo Nike Adaptado',
    description: 'Variación del logo Nike para estampado deportivo.',
    price: 2500,
    previewUrl: 'https://placehold.co/600x600/ff6b6b/ffffff?text=Nike+Logo',
    category: 'deportivo',
    technique: 'sublimado',
    rating: 0,
    ratingCount: 0,
    salesCount: 0,
    viewCount: 0,
    status: 'pending',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-18T11:00:00Z',
  },
  {
    id: '23',
    title: 'Rosa Realista',
    description: 'Rosa hiperrealista en acuarela para papelería fina.',
    price: 1800,
    previewUrl: 'https://placehold.co/600x600/ffd700/1a1a2e?text=Rosa+Real',
    category: 'papeleria',
    technique: 'estampado',
    rating: 0,
    ratingCount: 0,
    salesCount: 0,
    viewCount: 0,
    status: 'pending',
    seller: {
      id: 's4',
      name: 'Papelería Creativa',
      avatar: 'https://placehold.co/100x100/533483/ffd700?text=PC',
      rating: 4.4,
      salesCount: 340,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-18T14:00:00Z',
  },
  // Diseños rechazados
  {
    id: '24',
    title: 'Spider-Man Fan Art',
    description: 'Diseño de Spider-Man para remeras.',
    price: 1500,
    previewUrl: 'https://placehold.co/600x600/ff0000/ffffff?text=Spider-Man',
    category: 'infantil',
    technique: 'estampado',
    rating: 0,
    ratingCount: 0,
    salesCount: 0,
    viewCount: 0,
    status: 'rejected',
    rejectionReason:
      'Este diseño contiene personajes con derechos de autor (Marvel). No se puede publicar sin licencia.',
    seller: {
      id: 's2',
      name: 'Arte Digital Juan',
      avatar: 'https://placehold.co/100x100/1a1a2e/53d8fb?text=AJ',
      rating: 4.6,
      salesCount: 215,
      isVerified: true,
      isTopSeller: false,
    },
    createdAt: '2025-02-10T10:00:00Z',
  },
  {
    id: '25',
    title: 'Diseño Borroso Test',
    description: 'Test de diseño con resolución baja.',
    price: 500,
    previewUrl: 'https://placehold.co/600x600/cccccc/999999?text=Borroso',
    category: 'sublimado',
    technique: 'sublimado',
    rating: 0,
    ratingCount: 0,
    salesCount: 0,
    viewCount: 0,
    status: 'rejected',
    rejectionReason:
      'La preview se ve borrosa y pixelada. Subí una imagen de mayor calidad (mínimo 150 DPI).',
    seller: {
      id: 's3',
      name: 'SublimeArte',
      avatar: 'https://placehold.co/100x100/0f3460/53d8fb?text=SA',
      rating: 4.8,
      salesCount: 890,
      isVerified: true,
      isTopSeller: true,
    },
    createdAt: '2025-02-12T16:00:00Z',
  },
];

const MOCK_CATEGORIES = [
  { id: 'sublimado', name: 'Sublimado', count: 156 },
  { id: 'estampado', name: 'Estampado', count: 234 },
  { id: 'papeleria', name: 'Papelería', count: 89 },
  { id: 'infantil', name: 'Infantil', count: 178 },
  { id: 'deportivo', name: 'Deportivo', count: 45 },
  { id: 'religioso', name: 'Religioso', count: 67 },
];

const MOCK_TECHNIQUES = [
  { id: 'sublimado', name: 'Sublimado' },
  { id: 'estampado', name: 'Estampado' },
  { id: 'vinilo', name: 'Vinilo textil' },
  { id: 'dtf', name: 'DTF' },
];

const MOCK_PURCHASES = [
  {
    id: 'p1',
    designId: '1',
    design: MOCK_DESIGNS[0],
    price: 2500,
    status: 'completed',
    downloadCount: 2,
    createdAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'p2',
    designId: '7',
    design: MOCK_DESIGNS[6],
    price: 2800,
    status: 'completed',
    downloadCount: 1,
    createdAt: '2025-01-25T10:15:00Z',
  },
  {
    id: 'p3',
    designId: '3',
    design: MOCK_DESIGNS[2],
    price: 1500,
    status: 'completed',
    downloadCount: 3,
    createdAt: '2025-02-01T16:45:00Z',
  },
  {
    id: 'p4',
    designId: '14',
    design: MOCK_DESIGNS[13],
    price: 3500,
    status: 'completed',
    downloadCount: 1,
    createdAt: '2025-02-05T09:00:00Z',
  },
  {
    id: 'p5',
    designId: '16',
    design: MOCK_DESIGNS[15],
    price: 1900,
    status: 'completed',
    downloadCount: 0,
    createdAt: '2025-02-10T11:30:00Z',
  },
];

const MOCK_SELLER_SALES = [
  {
    id: 'v1',
    designId: '1',
    designTitle: 'Mandala Tribal',
    buyerName: 'Carlos López',
    price: 2500,
    commission: 500,
    earnings: 2000,
    createdAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'v2',
    designId: '3',
    designTitle: 'Dinosaurio Infantil',
    buyerName: 'María García',
    price: 1500,
    commission: 300,
    earnings: 1200,
    createdAt: '2025-01-22T09:00:00Z',
  },
  {
    id: 'v3',
    designId: '8',
    designTitle: 'Unicornio Arcoíris',
    buyerName: 'Ana Martínez',
    price: 1600,
    commission: 320,
    earnings: 1280,
    createdAt: '2025-01-25T16:00:00Z',
  },
  {
    id: 'v4',
    designId: '16',
    designTitle: 'Gato Astronauta',
    buyerName: 'Pedro Sánchez',
    price: 1900,
    commission: 380,
    earnings: 1520,
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'v5',
    designId: '1',
    designTitle: 'Mandala Tribal',
    buyerName: 'Laura Fernández',
    price: 2500,
    commission: 500,
    earnings: 2000,
    createdAt: '2025-02-05T14:00:00Z',
  },
  {
    id: 'v6',
    designId: '12',
    designTitle: 'Oso Panda Kawaii',
    buyerName: 'Jorge Ruiz',
    price: 1400,
    commission: 280,
    earnings: 1120,
    createdAt: '2025-02-08T11:00:00Z',
  },
];

const MOCK_REVIEWS = [
  {
    id: 'r1',
    designId: '1',
    buyerName: 'Carlos López',
    buyerAvatar: 'https://placehold.co/40x40/1a1a2e/ffffff?text=CL',
    score: 5,
    comment: 'Hermoso diseño, la calidad del archivo es excelente. Muy recomendable.',
    createdAt: '2025-01-22T10:00:00Z',
  },
  {
    id: 'r2',
    designId: '1',
    buyerName: 'Laura Fernández',
    buyerAvatar: 'https://placehold.co/40x40/1a1a2e/ffffff?text=LF',
    score: 5,
    comment: 'Perfecto para sublimación. El archivo viene en alta resolución.',
    createdAt: '2025-02-06T15:00:00Z',
  },
  {
    id: 'r3',
    designId: '7',
    buyerName: 'Roberto Díaz',
    buyerAvatar: 'https://placehold.co/40x40/0f3460/ffffff?text=RD',
    score: 5,
    comment: 'El mejor diseño de lobo que vi. Colores vibrantes.',
    createdAt: '2025-01-28T09:00:00Z',
  },
  {
    id: 'r4',
    designId: '3',
    buyerName: 'María García',
    buyerAvatar: 'https://placehold.co/40x40/533483/ffffff?text=MG',
    score: 4,
    comment: 'Muy lindo, pero me hubiera gustado que tenga más variantes de color.',
    createdAt: '2025-02-02T12:00:00Z',
  },
  {
    id: 'r5',
    designId: '14',
    buyerName: 'Pedro Sánchez',
    buyerAvatar: 'https://placehold.co/40x40/1a1a2e/ffd700?text=PS',
    score: 5,
    comment: 'Increíble nivel de detalle. Vale cada centavo.',
    createdAt: '2025-02-07T14:00:00Z',
  },
];

// Hooks para catálogo
export function useDesigns(filters = {}) {
  let designs = MOCK_DESIGNS.filter((d) => d.status === 'approved');

  if (filters.category) {
    designs = designs.filter((d) => d.category === filters.category);
  }
  if (filters.technique) {
    designs = designs.filter((d) => d.technique === filters.technique);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    designs = designs.filter(
      (d) => d.title.toLowerCase().includes(search) || d.description.toLowerCase().includes(search)
    );
  }
  if (filters.priceMin) {
    designs = designs.filter((d) => d.price >= filters.priceMin);
  }
  if (filters.priceMax) {
    designs = designs.filter((d) => d.price <= filters.priceMax);
  }
  if (filters.sellerRating) {
    designs = designs.filter((d) => d.seller.rating >= filters.sellerRating);
  }
  if (filters.sort === 'popular') {
    designs.sort((a, b) => b.salesCount - a.salesCount);
  } else if (filters.sort === 'trending') {
    designs.sort((a, b) => b.viewCount - a.viewCount);
  } else if (filters.sort === 'price_asc') {
    designs.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    designs.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    designs.sort((a, b) => b.rating - a.rating);
  } else {
    designs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return {
    designs,
    total: designs.length,
    categories: MOCK_CATEGORIES,
    techniques: MOCK_TECHNIQUES,
    isLoading: false,
    error: null,
  };
}

export function useDesign(id) {
  const design = MOCK_DESIGNS.find((d) => d.id === id) || null;
  const related = MOCK_DESIGNS.filter(
    (d) => d.id !== id && d.category === design?.category && d.status === 'approved'
  ).slice(0, 4);
  const reviews = MOCK_REVIEWS.filter((r) => r.designId === id);

  return {
    design,
    related,
    reviews,
    isLoading: false,
    error: design ? null : 'Diseño no encontrado',
  };
}

export function useTrending() {
  const trending = MOCK_DESIGNS.filter((d) => d.status === 'approved')
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);
  return { designs: trending, isLoading: false };
}

export function useFeatured() {
  const featured = MOCK_DESIGNS.filter((d) => d.status === 'approved')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  return { designs: featured, isLoading: false };
}

export function useSellerDesigns(sellerId) {
  const designs = MOCK_DESIGNS.filter((d) => d.seller.id === sellerId && d.status === 'approved');
  return { designs, isLoading: false };
}

// Hooks para paneles
export function usePurchases() {
  return { purchases: MOCK_PURCHASES, isLoading: false };
}

export function useSellerSales(_sellerId) {
  const sales = MOCK_SELLER_SALES;
  const totalEarnings = sales.reduce((sum, s) => sum + s.earnings, 0);
  const totalSales = sales.length;
  const avgRating = 4.9;

  return {
    sales,
    stats: {
      totalEarnings,
      totalSales,
      avgRating,
      commissionRate: 20,
      commissionLevel: 'Base',
      nextLevel: { rate: 18, salesNeeded: 50 },
    },
    isLoading: false,
  };
}

export function usePendingDesigns() {
  const pending = MOCK_DESIGNS.filter((d) => d.status === 'pending');
  return { designs: pending, isLoading: false };
}

export function useRejectedDesigns() {
  const rejected = MOCK_DESIGNS.filter((d) => d.status === 'rejected');
  return { designs: rejected, isLoading: false };
}

export function useAdminStats() {
  return {
    stats: {
      pendingCount: MOCK_DESIGNS.filter((d) => d.status === 'pending').length,
      approvedToday: 8,
      totalUsers: 342,
      totalDesigns: MOCK_DESIGNS.length,
      totalSales: 1284,
      totalCommissions: 156800,
    },
    isLoading: false,
  };
}
