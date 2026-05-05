export const products = [
  {
    id: 'noir-veil',
    name: 'Noir Veil',
    category: 'Oriental',
    price: 98,
    oldPrice: 130,
    rating: 4.8,
    sold: 312,
    discount: 25,
    featured: true,
    image: 'https://images.unsplash.com/photo-1556228724-4fa5fd156ed0?auto=format&fit=crop&w=720&q=80',
    description: 'Rich amber notes with soft floral warmth for every evening occasion.'
  },
  {
    id: 'opal-dawn',
    name: 'Opal Dawn',
    category: 'Floral',
    price: 74,
    oldPrice: 89,
    rating: 4.7,
    sold: 270,
    discount: 17,
    featured: true,
    image: 'https://images.unsplash.com/photo-1522336572468-41c6b2c1a5af?auto=format&fit=crop&w=720&q=80',
    description: 'A light garden blend with jasmine and white musk for daytime elegance.'
  },
  {
    id: 'marine-muse',
    name: 'Marine Muse',
    category: 'Fresh',
    price: 64,
    oldPrice: 80,
    rating: 4.6,
    sold: 195,
    discount: 20,
    featured: true,
    image: 'https://images.unsplash.com/photo-1512238701577-f182d9ef8af7?auto=format&fit=crop&w=720&q=80',
    description: 'Sea salt and citrus balanced with cool vetiver for a crisp, clean finish.'
  },
  {
    id: 'amber-glow',
    name: 'Amber Glow',
    category: 'Woody',
    price: 86,
    oldPrice: 108,
    rating: 4.9,
    sold: 354,
    discount: 20,
    featured: false,
    image: 'https://images.unsplash.com/photo-1475179381654-6b57a8437bf6?auto=format&fit=crop&w=720&q=80',
    description: 'A warm, woody embrace with patchouli and golden amber undertones.'
  },
  {
    id: 'peony-silk',
    name: 'Peony Silk',
    category: 'Floral',
    price: 58,
    oldPrice: 72,
    rating: 4.5,
    sold: 184,
    discount: 19,
    featured: false,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=720&q=80',
    description: 'Delicate peony petals refined with creamy sandalwood for a soft signature.'
  },
  {
    id: 'citrus-spritz',
    name: 'Citrus Spritz',
    category: 'Citrus',
    price: 52,
    oldPrice: 64,
    rating: 4.4,
    sold: 142,
    discount: 18,
    featured: false,
    image: 'https://images.unsplash.com/photo-1492715453720-ef64edb6bd39?auto=format&fit=crop&w=720&q=80',
    description: 'Bright grapefruit, bergamot, and neroli for a playful, invigorating scent.'
  },
  {
    id: 'midnight-moss',
    name: 'Midnight Moss',
    category: 'Woody',
    price: 104,
    oldPrice: 130,
    rating: 4.8,
    sold: 229,
    discount: 20,
    featured: true,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=720&q=80',
    description: 'Velvet moss and dark cedar combined for a mysterious evening aroma.'
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    category: 'Floral',
    price: 68,
    oldPrice: 82,
    rating: 4.7,
    sold: 203,
    discount: 17,
    featured: false,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=720&q=80',
    description: 'A luxurious rose blend softened with vanilla and warm tonka bean.'
  },
  {
    id: 'arctic-breeze',
    name: 'Arctic Breeze',
    category: 'Fresh',
    price: 59,
    oldPrice: 72,
    rating: 4.4,
    sold: 168,
    discount: 18,
    featured: false,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80',
    description: 'Mint, sea minerals, and crisp citrus for a cooling daily mist.'
  },
  {
    id: 'golden-amber',
    name: 'Golden Amber',
    category: 'Oriental',
    price: 92,
    oldPrice: 115,
    rating: 4.9,
    sold: 285,
    discount: 20,
    featured: false,
    image: 'https://images.unsplash.com/photo-1556228724-4fa5fd156ed0?auto=format&fit=crop&w=720&q=80',
    description: 'Smoky incense meets creamy benzoin for a luxurious night scent.'
  },
  {
    id: 'jasmine-dream',
    name: 'Jasmine Dream',
    category: 'Floral',
    price: 72,
    oldPrice: 88,
    rating: 4.6,
    sold: 180,
    discount: 18,
    featured: false,
    image: 'https://images.unsplash.com/photo-1522336572468-41c6b2c1a5af?auto=format&fit=crop&w=720&q=80',
    description: 'White jasmine warmed with cedar and a whisper of honey.'
  },
  {
    id: 'sapphire-citrus',
    name: 'Sapphire Citrus',
    category: 'Citrus',
    price: 54,
    oldPrice: 66,
    rating: 4.5,
    sold: 130,
    discount: 18,
    featured: false,
    image: 'https://images.unsplash.com/photo-1492715453720-ef64edb6bd39?auto=format&fit=crop&w=720&q=80',
    description: 'Sparkling orange zest blended with juicy pear and soft musk.'
  }
];

export const getCategories = () => [
  ...new Set(products.map(product => product.category))
];

export const findProduct = productId => products.find(item => item.id === productId);
