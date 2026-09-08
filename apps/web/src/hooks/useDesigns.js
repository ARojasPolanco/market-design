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

export function useDesigns(filters = {}) {
  let designs = [...MOCK_DESIGNS];

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
  if (filters.sort === 'popular') {
    designs.sort((a, b) => b.salesCount - a.salesCount);
  } else if (filters.sort === 'trending') {
    designs.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    designs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return {
    designs,
    categories: MOCK_CATEGORIES,
    techniques: MOCK_TECHNIQUES,
    isLoading: false,
    error: null,
  };
}

export function useDesign(id) {
  const design = MOCK_DESIGNS.find((d) => d.id === id) || null;
  const related = MOCK_DESIGNS.filter((d) => d.id !== id && d.category === design?.category).slice(
    0,
    4
  );

  return {
    design,
    related,
    isLoading: false,
    error: design ? null : 'Diseño no encontrado',
  };
}

export function useTrending() {
  const trending = [...MOCK_DESIGNS].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);
  return { designs: trending, isLoading: false };
}

export function useFeatured() {
  const featured = [...MOCK_DESIGNS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return { designs: featured, isLoading: false };
}

export function useSellerDesigns(sellerId) {
  const designs = MOCK_DESIGNS.filter((d) => d.seller.id === sellerId);
  return { designs, isLoading: false };
}
