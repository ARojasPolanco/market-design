import 'dotenv/config';
import sequelize from '../src/config/database/database.js';
import User from '../src/modules/auth/auth.model.js';
import Design from '../src/modules/designs/design.model.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Clean existing data
    await Design.destroy({ where: {} });
    await User.destroy({ where: { role: 'seller' } });
    console.log('🧹 Cleaned existing data');

    // Create sellers
    const sellers = await Promise.all([
      User.create({
        fullname: 'María García',
        username: 'maria_designs',
        email: 'maria@test.com',
        password: 'password123',
        role: 'seller',
        storeName: 'Diseños María',
        description: 'Especialista en diseños infantiles y sublimados.',
        emailVerified: true,
        mpConnected: true,
        rank: 'diamante',
        isVerified: true,
        isTopSeller: true,
      }),
      User.create({
        fullname: 'Juan Pérez',
        username: 'juan_arte',
        email: 'juan@test.com',
        password: 'password123',
        role: 'seller',
        storeName: 'Arte Digital Juan',
        description: 'Arte digital y papelería creativa.',
        emailVerified: true,
        mpConnected: true,
        rank: 'diamante',
        isVerified: true,
        isTopSeller: false,
      }),
      User.create({
        fullname: 'Carlos López',
        username: 'sublime_arte',
        email: 'carlos@test.com',
        password: 'password123',
        role: 'seller',
        storeName: 'SublimeArte',
        description: 'Líder en diseños para sublimación.',
        emailVerified: true,
        mpConnected: true,
        rank: 'diamante',
        isVerified: true,
        isTopSeller: true,
      }),
    ]);

    console.log(`✅ ${sellers.length} sellers created`);

    // Create designs
    const designs = [
      {
        sellerId: sellers[0].id,
        title: 'Mandala Tribal',
        description: 'Diseño de mandala tribal con patrones geométricos intrincados. Ideal para sublimación en remeras y buzos.',
        price: 2500,
        category: 'sublimado',
        technique: 'sublimado',
        status: 'approved',
        previewUrl: '/designs/lobo-geometrico.png',
        viewCount: 1850,
        salesCount: 142,
        ratingAvg: 4.8,
        ratingCount: 56,
      },
      {
        sellerId: sellers[1].id,
        title: 'Flor de Loto Acuarela',
        description: 'Flor de loto pintada en acuarela con efecto de salpicadura. Perfecta para papelería y textiles.',
        price: 1800,
        category: 'papeleria',
        technique: 'estampado',
        status: 'approved',
        previewUrl: '/designs/dragon-oriental.png',
        viewCount: 1200,
        salesCount: 89,
        ratingAvg: 4.5,
        ratingCount: 34,
      },
      {
        sellerId: sellers[0].id,
        title: 'Dinosaurio Infantil',
        description: 'T-Rex divertido con gorro de fiesta. Diseño cute para estampado infantil.',
        price: 1500,
        category: 'infantil',
        technique: 'estampado',
        status: 'approved',
        previewUrl: '/designs/gato-astronauta.png',
        viewCount: 3200,
        salesCount: 234,
        ratingAvg: 4.9,
        ratingCount: 89,
      },
      {
        sellerId: sellers[2].id,
        title: 'Rosa Negra Gótica',
        description: 'Rosa negra con elementos góticos y mariposas. Ideal para sublimación en tazas y remeras.',
        price: 2200,
        category: 'sublimado',
        technique: 'sublimado',
        status: 'approved',
        previewUrl: '/designs/frase-motivacional.jpg',
        viewCount: 2100,
        salesCount: 178,
        ratingAvg: 4.7,
        ratingCount: 67,
      },
      {
        sellerId: sellers[1].id,
        title: 'Copa del Mundo',
        description: 'Diseño temático de fútbol con trofeo y balón. Para sublimación en camisetas deportivas.',
        price: 3000,
        category: 'deportivo',
        technique: 'sublimado',
        status: 'approved',
        previewUrl: '/designs/lobo-geometrico.png',
        viewCount: 890,
        salesCount: 67,
        ratingAvg: 4.3,
        ratingCount: 23,
      },
      {
        sellerId: sellers[0].id,
        title: 'Unicornio Arcoíris',
        description: 'Unicornio mágico con crin de arcoíris y estrellas. Diseño infantil adorable.',
        price: 1600,
        category: 'infantil',
        technique: 'estampado',
        status: 'approved',
        previewUrl: '/designs/gato-astronauta.png',
        viewCount: 2800,
        salesCount: 198,
        ratingAvg: 4.8,
        ratingCount: 78,
      },
      {
        sellerId: sellers[2].id,
        title: 'Lobo Geométrico',
        description: 'Lobo con diseño geométrico low-poly en tonos azules y violetas.',
        price: 2800,
        category: 'sublimado',
        technique: 'sublimado',
        status: 'approved',
        previewUrl: '/designs/lobo-geometrico.png',
        viewCount: 4500,
        salesCount: 312,
        ratingAvg: 4.9,
        ratingCount: 112,
      },
      {
        sellerId: sellers[1].id,
        title: 'Gato Astronauta',
        description: 'Gato flotando en el espacio con casco de astronauta. Diseño trendy para remeras.',
        price: 1900,
        category: 'sublimado',
        technique: 'sublimado',
        status: 'approved',
        previewUrl: '/designs/gato-astronauta.png',
        viewCount: 4100,
        salesCount: 289,
        ratingAvg: 4.8,
        ratingCount: 95,
      },
    ];

    await Design.bulkCreate(designs);
    console.log(`✅ ${designs.length} designs created`);

    console.log('🎉 Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
