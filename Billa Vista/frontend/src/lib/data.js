// Static fake data — no backend, no API calls.

export const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Mains', 'Drinks', 'Desserts']

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`

export const menuItems = [
  {
    id: 'bella-signature-stack',
    name: 'The Bella Signature Stack',
    description:
      'A double smash-patty masterpiece layered with aged cheddar, caramelized onions, crisp lettuce, and our signature house sauce — all stacked between a toasted brioche bun. Cooked to order and finished with a flame-grilled edge.',
    shortDescription: 'Double smash patties, aged cheddar, smoked bacon and our secret house sauce.',
    price: 12.99,
    category: 'Burgers',
    image: img('photo-1568901346375-23c9450c58cd'),
    isAIRecommended: true,
    rating: 4.8,
    reviews: 1204,
    prepTime: '20 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Cheese', price: 1.5 },
      { label: 'Bacon', price: 2.0 },
      { label: 'Signature Sauce', price: 1.0 },
    ],
  },
  {
    id: 'smoky-bloom',
    name: 'Smoky Bloom',
    description:
      'Smoked mushrooms, garlic cream, and house pickles piled onto a toasted bun with a smoky char-grilled patty.',
    shortDescription: 'Smoked mushrooms, garlic cream, house pickles',
    price: 14.39,
    category: 'Burgers',
    image: img('photo-1571091718767-18b5b1457add'),
    isAIRecommended: false,
    rating: 4.7,
    reviews: 812,
    prepTime: '18 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Cheese', price: 1.5 },
      { label: 'Bacon', price: 2.0 },
      { label: 'Signature Sauce', price: 1.0 },
    ],
  },
  {
    id: 'golden-crunch',
    name: 'Golden Crunch',
    description:
      'Crispy buttermilk fried chicken burger with fresh slaw and a tangy house mayo, served on a toasted potato bun.',
    shortDescription: 'Crispy buttermilk fried chicken burger with slaw',
    price: 11.9,
    category: 'Burgers',
    image: img('photo-1606755962773-d324e0a13086'),
    isAIRecommended: true,
    rating: 4.9,
    reviews: 956,
    prepTime: '15 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Cheese', price: 1.5 },
      { label: 'Bacon', price: 2.0 },
      { label: 'Signature Sauce', price: 1.0 },
    ],
  },
  {
    id: 'margherita-fuoco',
    name: 'Margherita Fuoco',
    description:
      'Wood-fired dough topped with San Marzano tomatoes, fresh mozzarella, and basil, finished with a drizzle of chili oil.',
    shortDescription: 'Wood-fired dough, San Marzano, fresh basil',
    price: 13.2,
    category: 'Pizza',
    image: img('photo-1565299624946-b28f40a0ae38'),
    isAIRecommended: true,
    rating: 4.9,
    reviews: 1204,
    prepTime: '20 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Cheese', price: 1.5 },
      { label: 'Mushrooms', price: 1.5 },
      { label: 'Chili Oil', price: 1.0 },
    ],
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description:
      'Classic wood-fired margherita with fresh mozzarella, San Marzano tomato sauce, and torn basil leaves.',
    shortDescription: 'Classic margherita, fresh mozzarella, basil',
    price: 12.99,
    category: 'Pizza',
    image: img('photo-1574071318508-1cdbab80d002'),
    isAIRecommended: false,
    rating: 4.6,
    reviews: 640,
    prepTime: '18 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Cheese', price: 1.5 },
      { label: 'Mushrooms', price: 1.5 },
      { label: 'Chili Oil', price: 1.0 },
    ],
  },
  {
    id: 'garden-reset',
    name: 'Garden Reset',
    description:
      'A refreshing bowl of avocado, cherry tomatoes, mixed greens, and a bright citrus vinaigrette.',
    shortDescription: 'Avocado, cherry tomato, citrus vinaigrette',
    price: 9.75,
    category: 'Salads',
    image: img('photo-1512621776951-a57141f2eefd'),
    isAIRecommended: false,
    rating: 4.5,
    reviews: 388,
    prepTime: '10 min',
    sizes: [
      { label: 'Small', delta: -1.5 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 2.5 },
    ],
    extras: [
      { label: 'Grilled Chicken', price: 2.5 },
      { label: 'Feta', price: 1.5 },
      { label: 'Extra Dressing', price: 0.5 },
    ],
  },
  {
    id: 'garden-fresh-salad',
    name: 'Garden Fresh Salad',
    description:
      'Crisp seasonal greens, cherry tomatoes, and cucumber tossed in a light house dressing.',
    shortDescription: 'Crisp greens, cherry tomato, cucumber, house dressing',
    price: 7.99,
    category: 'Salads',
    image: img('photo-1540420773420-3366772f4999'),
    isAIRecommended: false,
    rating: 4.4,
    reviews: 274,
    prepTime: '8 min',
    sizes: [
      { label: 'Small', delta: -1.5 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 2.5 },
    ],
    extras: [
      { label: 'Grilled Chicken', price: 2.5 },
      { label: 'Feta', price: 1.5 },
      { label: 'Extra Dressing', price: 0.5 },
    ],
  },
  {
    id: 'truffle-pasta',
    name: 'Truffle Pasta',
    description:
      'Creamy truffle tagliatelle finished with aged parmesan and fresh cracked black pepper.',
    shortDescription: 'Creamy truffle tagliatelle, aged parmesan',
    price: 16.5,
    category: 'Mains',
    image: img('photo-1621996346565-e3dbc646d9a9'),
    isAIRecommended: false,
    rating: 4.8,
    reviews: 512,
    prepTime: '22 min',
    sizes: [
      { label: 'Small', delta: -2 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 3 },
    ],
    extras: [
      { label: 'Extra Truffle', price: 3.0 },
      { label: 'Parmesan', price: 1.5 },
      { label: 'Grilled Chicken', price: 2.5 },
    ],
  },
  {
    id: 'crispy-fried-chicken',
    name: 'Crispy Fried Chicken',
    description:
      'Golden buttermilk fried chicken tenders served with a smoky dipping sauce on the side.',
    shortDescription: 'Crispy fried chicken tenders with dipping sauce',
    price: 8.49,
    category: 'Mains',
    image: img('photo-1562967914-608f82629710'),
    isAIRecommended: true,
    rating: 4.7,
    reviews: 690,
    prepTime: '16 min',
    sizes: [
      { label: 'Small', delta: -1.5 },
      { label: 'Medium', delta: 0 },
      { label: 'Large', delta: 2.5 },
    ],
    extras: [
      { label: 'Extra Dip', price: 0.75 },
      { label: 'Spicy Coating', price: 0.5 },
      { label: 'Fries Side', price: 2.0 },
    ],
  },
  {
    id: 'citrus-spark',
    name: 'Citrus Spark',
    description: 'An iced citrus mocktail with fresh mint, sparkling soda, and a hint of ginger.',
    shortDescription: 'Iced citrus mocktail with fresh mint',
    price: 6.4,
    category: 'Drinks',
    image: img('photo-1551024506-0bccd828d307'),
    isAIRecommended: false,
    rating: 4.6,
    reviews: 320,
    prepTime: '5 min',
    sizes: [
      { label: 'Regular', delta: 0 },
      { label: 'Large', delta: 1.5 },
    ],
    extras: [
      { label: 'Extra Mint', price: 0.5 },
      { label: 'Sugar-Free', price: 0 },
    ],
  },
  {
    id: 'mint-mojito-mocktail',
    name: 'Mint Mojito Mocktail',
    description: 'Fresh mint, lime, and soda water — a zero-proof classic served over ice.',
    shortDescription: 'Fresh mint, lime, soda, zero proof',
    price: 5.9,
    category: 'Drinks',
    image: img('photo-1544145945-f90425340c7e'),
    isAIRecommended: false,
    rating: 4.5,
    reviews: 210,
    prepTime: '5 min',
    sizes: [
      { label: 'Regular', delta: 0 },
      { label: 'Large', delta: 1.5 },
    ],
    extras: [
      { label: 'Extra Mint', price: 0.5 },
      { label: 'Sugar-Free', price: 0 },
    ],
  },
  {
    id: 'lava-chocolate-cake',
    name: 'Lava Chocolate Cake',
    description: 'A warm chocolate lava cake with a molten center, dusted with cocoa and served with berries.',
    shortDescription: 'Warm chocolate lava cake with molten center',
    price: 6.5,
    category: 'Desserts',
    image: img('photo-1624353365286-3f8d62daad51'),
    isAIRecommended: false,
    rating: 4.9,
    reviews: 445,
    prepTime: '12 min',
    sizes: [
      { label: 'Regular', delta: 0 },
      { label: 'Large', delta: 2 },
    ],
    extras: [
      { label: 'Ice Cream Scoop', price: 1.5 },
      { label: 'Extra Berries', price: 1.0 },
    ],
  },
]

export const featuredDish = menuItems.find((item) => item.id === 'bella-signature-stack')

export const tables = Array.from({ length: 20 }, (_, i) => {
  const number = i + 1
  const seatsPool = [2, 2, 4, 4, 4, 6, 6, 8]
  const seats = seatsPool[i % seatsPool.length]
  const statusPool = ['available', 'occupied', 'reserved']
  const status = statusPool[(i + 1) % statusPool.length]
  const guestNames = [
    'James Carter',
    'Sofia Reyes',
    'Liam Chen',
    'Amara Osei',
    'Noah Williams',
    'Priya Patel',
    'Ethan Brooks',
    'Mia Torres',
  ]
  return {
    id: `table-${number}`,
    number,
    seats,
    status,
    guestName: status === 'available' ? null : guestNames[i % guestNames.length],
  }
})

export const reservations = [
  { id: 'res-1', name: 'James Carter', date: '2026-07-28', time: '6:00 PM', guests: 2, status: 'confirmed' },
  { id: 'res-2', name: 'Sofia Reyes', date: '2026-07-28', time: '6:30 PM', guests: 4, status: 'confirmed' },
  { id: 'res-3', name: 'Liam Chen', date: '2026-07-28', time: '7:00 PM', guests: 3, status: 'pending' },
  { id: 'res-4', name: 'Amara Osei', date: '2026-07-28', time: '7:30 PM', guests: 5, status: 'confirmed' },
  { id: 'res-5', name: 'Noah Williams', date: '2026-07-28', time: '8:00 PM', guests: 2, status: 'cancelled' },
  { id: 'res-6', name: 'Priya Patel', date: '2026-07-29', time: '6:00 PM', guests: 6, status: 'confirmed' },
  { id: 'res-7', name: 'Ethan Brooks', date: '2026-07-29', time: '6:30 PM', guests: 2, status: 'pending' },
  { id: 'res-8', name: 'Mia Torres', date: '2026-07-29', time: '7:00 PM', guests: 4, status: 'confirmed' },
  { id: 'res-9', name: 'Oliver Grant', date: '2026-07-29', time: '8:00 PM', guests: 8, status: 'confirmed' },
  { id: 'res-10', name: 'Zara Malik', date: '2026-07-30', time: '7:30 PM', guests: 3, status: 'pending' },
]

export const adminStats = {
  todayOrders: 147,
  todayOrdersChange: '+12% vs yesterday',
  revenue: 4280,
  revenueChange: '+8% vs yesterday',
  currency: '£',
  activeTables: 14,
  totalTables: 20,
  aiQueries: 89,
  aiQueriesNote: '24 reservations booked',
}

export const peakHours = [
  { label: '12p', value: 45 },
  { label: '2p', value: 30 },
  { label: '4p', value: 20 },
  { label: '6p', value: 55 },
  { label: '8p', value: 90 },
  { label: '10p', value: 40 },
]

export const topSellingItems = [
  { id: 'bella-signature-stack', name: 'Signature Stack Burger', sold: 84, image: menuItems[0].image },
  { id: 'margherita-pizza', name: 'Margherita Pizza', sold: 67, image: menuItems[4].image },
  { id: 'crispy-fried-chicken', name: 'Crispy Fried Chicken', sold: 52, image: menuItems[8].image },
  { id: 'lava-chocolate-cake', name: 'Lava Cake', sold: 41, image: menuItems[11].image },
]

export const liveOrders = [
  {
    id: 'BV-1042',
    name: 'Signature Stack Burger',
    items: '2x Burger · 1x Fries',
    total: 24.5,
    status: 'Preparing',
    image: menuItems[0].image,
  },
  {
    id: 'BV-1041',
    name: 'Margherita Pizza',
    items: '1x Pizza · 2x Drinks',
    total: 19.0,
    status: 'Ready',
    image: menuItems[4].image,
  },
  {
    id: 'BV-1040',
    name: 'Garden Fresh Salad',
    items: '1x Salad · 1x Mocktail',
    total: 15.75,
    status: 'Delivered',
    image: menuItems[6].image,
  },
  {
    id: 'BV-1039',
    name: 'Crispy Fried Chicken',
    items: '3x Chicken · 1x Sauce',
    total: 21.2,
    status: 'Preparing',
    image: menuItems[8].image,
  },
  {
    id: 'BV-1038',
    name: 'Lava Cake',
    items: '2x Dessert',
    total: 12.0,
    status: 'Delivered',
    image: menuItems[11].image,
  },
]

export const currentUser = {
  name: 'Alex Morgan',
  role: 'Store Manager',
  avatar: img('photo-1494790108377-be9c29b29330'),
}
