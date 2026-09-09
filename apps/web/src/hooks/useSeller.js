const MOCK_SELLERS = [
  {
    id: 's1',
    name: 'María García',
    username: 'MariaDiseños',
    storeName: 'Diseños María',
    avatar: 'https://placehold.co/200x200/16213e/e94560?text=DM',
    description: 'Especialista en diseños infantiles y sublimados. Más de 500 ventas realizadas.',
    rating: 4.9,
    salesCount: 523,
    isVerified: true,
    isTopSeller: true,
    isDiamante: true,
    rank: 'diamante',
    memberSince: '2023-06-15',
    totalDesigns: 45,
  },
  {
    id: 's2',
    name: 'Juan Pérez',
    username: 'JuanArte',
    storeName: 'Arte Digital Juan',
    avatar: 'https://placehold.co/200x200/1a1a2e/53d8fb?text=AJ',
    description: 'Arte digital y papelería creativa. Diseños únicos para cada ocasión.',
    rating: 4.6,
    salesCount: 215,
    isVerified: true,
    isTopSeller: false,
    isDiamante: true,
    rank: 'diamante',
    memberSince: '2024-01-10',
    totalDesigns: 28,
  },
  {
    id: 's3',
    name: 'Carlos López',
    username: 'SublimeArte',
    storeName: 'SublimeArte',
    avatar: 'https://placehold.co/200x200/0f3460/53d8fb?text=SA',
    description: 'Líder en diseños para sublimación. Calidad profesional garantizada.',
    rating: 4.8,
    salesCount: 890,
    isVerified: true,
    isTopSeller: true,
    isDiamante: true,
    rank: 'diamante',
    memberSince: '2023-03-20',
    totalDesigns: 72,
  },
  {
    id: 's4',
    name: 'Ana Martínez',
    username: 'AnaCreativa',
    storeName: 'Papelería Creativa',
    avatar: 'https://placehold.co/200x200/533483/ffd700?text=PC',
    description: 'Diseños para papelería, invitaciones y decoración. Estilo moderno y elegante.',
    rating: 4.4,
    salesCount: 340,
    isVerified: true,
    isTopSeller: false,
    isDiamante: false,
    rank: 'oro',
    memberSince: '2023-09-05',
    totalDesigns: 53,
  },
];

export function useSeller(id) {
  const seller = MOCK_SELLERS.find((s) => s.id === id) || null;
  return {
    seller,
    isLoading: false,
    error: seller ? null : 'Vendedor no encontrado',
  };
}

export function useTopSellers() {
  const sellers = [...MOCK_SELLERS].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4);
  return { sellers, isLoading: false };
}

export function useCurrentSeller() {
  // Mock: returns the first seller as the "logged in" seller
  return {
    seller: MOCK_SELLERS[0],
    isLoading: false,
  };
}
