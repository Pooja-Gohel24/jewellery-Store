export const products = [
  { id: 1,  name: 'Diamond Solitaire Ring',   category: 'Rings',     price: 45000,  originalPrice: 55000, rating: 4.8, reviews: 124, img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Diamond+Ring',     badge: 'Best Seller', description: 'A stunning diamond solitaire ring crafted in 18K gold. Perfect for engagements and special occasions.' },
  { id: 2,  name: 'Gold Hoop Earrings',        category: 'Earrings',  price: 12500,  originalPrice: 15000, rating: 4.6, reviews: 89,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Gold+Earrings',    badge: 'New',         description: 'Classic gold hoop earrings with a polished finish. Lightweight and comfortable for everyday wear.' },
  { id: 3,  name: 'Pearl Strand Necklace',     category: 'Necklaces', price: 28000,  originalPrice: 35000, rating: 4.7, reviews: 67,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Pearl+Necklace',   badge: 'Sale',        description: 'Elegant freshwater pearl strand necklace with a gold clasp. A timeless piece for any occasion.' },
  { id: 4,  name: 'Tennis Bracelet',           category: 'Bracelets', price: 38000,  originalPrice: 45000, rating: 4.9, reviews: 203, img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Tennis+Bracelet',  badge: 'Popular',     description: 'A classic diamond tennis bracelet set in 18K white gold. The perfect luxury gift.' },
  { id: 5,  name: 'Ruby Pendant Necklace',     category: 'Necklaces', price: 22000,  originalPrice: 28000, rating: 4.5, reviews: 45,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Ruby+Pendant',     badge: '',            description: 'A vibrant ruby pendant set in 22K gold. Rich color and exceptional clarity.' },
  { id: 6,  name: 'Gold Bangles Set',          category: 'Bracelets', price: 18000,  originalPrice: 22000, rating: 4.4, reviews: 78,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Gold+Bangles',     badge: 'Sale',        description: 'Set of 4 traditional gold bangles with intricate engraving. Perfect for festive occasions.' },
  { id: 7,  name: 'Emerald Drop Earrings',     category: 'Earrings',  price: 32000,  originalPrice: 40000, rating: 4.7, reviews: 56,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Emerald+Earrings', badge: 'New',         description: 'Stunning emerald drop earrings in 18K gold setting. A bold statement piece.' },
  { id: 8,  name: 'Sapphire Cocktail Ring',    category: 'Rings',     price: 52000,  originalPrice: 65000, rating: 4.8, reviews: 91,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Sapphire+Ring',    badge: 'Best Seller', description: 'A magnificent blue sapphire cocktail ring surrounded by diamonds in 18K gold.' },
  { id: 9,  name: 'Kundan Choker Necklace',    category: 'Necklaces', price: 15000,  originalPrice: 18000, rating: 4.3, reviews: 112, img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Kundan+Choker',    badge: '',            description: 'Traditional Kundan choker necklace with meenakari work. Perfect for weddings.' },
  { id: 10, name: 'Diamond Stud Earrings',     category: 'Earrings',  price: 25000,  originalPrice: 30000, rating: 4.9, reviews: 178, img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Diamond+Studs',    badge: 'Best Seller', description: 'Classic diamond stud earrings in 18K white gold. A must-have for every jewellery collection.' },
  { id: 11, name: 'Rose Gold Chain',           category: 'Necklaces', price: 9500,   originalPrice: 12000, rating: 4.2, reviews: 63,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Rose+Gold+Chain',  badge: 'Sale',        description: 'Delicate rose gold chain necklace. Minimalist design perfect for layering.' },
  { id: 12, name: 'Platinum Wedding Band',     category: 'Rings',     price: 35000,  originalPrice: 42000, rating: 4.6, reviews: 88,  img: 'https://placehold.co/400x400/f6f2ee/8b5e3c?text=Wedding+Band',     badge: '',            description: 'Classic platinum wedding band with a comfort fit design. Engraving available.' },
]

export const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets']

export const sortOptions = [
  { value: 'default',     label: 'Default' },
  { value: 'price-low',   label: 'Price: Low to High' },
  { value: 'price-high',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Top Rated' },
  { value: 'newest',      label: 'Newest First' },
]
