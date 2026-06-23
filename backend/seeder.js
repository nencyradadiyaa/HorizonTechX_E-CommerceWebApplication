import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to Database
await connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@horizontechx.com',
    password: 'adminpassword123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@horizontechx.com',
    password: 'userpassword123',
    role: 'user',
  },
];

const sampleProducts = [
  {
    title: 'MacBook Pro 16-inch M3 Max',
    description: 'The ultimate pro laptop. Featuring the M3 Max chip, 36GB unified memory, and 1TB SSD. Beautiful Liquid Retina XDR display with up to 22 hours of battery life.',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    category: 'Laptops',
    stock: 12,
  },
  {
    title: 'Dell XPS 15 OLED',
    description: 'Stunning 15.6-inch 3.5K OLED touch display. Driven by 13th Gen Intel Core i9, NVIDIA RTX 4070, 32GB RAM, and 1TB SSD. Premium aluminum and carbon fiber craftsmanship.',
    price: 2399.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60',
    category: 'Laptops',
    stock: 8,
  },
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancelling wireless over-ear headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life.',
    price: 398.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    category: 'Audio',
    stock: 25,
  },
  {
    title: 'AirPods Pro (2nd Generation)',
    description: 'Featuring active noise cancellation, adaptive transparency, personalized spatial audio, and upgraded battery life up to 6 hours on a single charge.',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=800&auto=format&fit=crop&q=60',
    category: 'Audio',
    stock: 40,
  },
  {
    title: 'Keychron K2 Mechanical Keyboard',
    description: 'A 75% layout wireless mechanical keyboard with Gateron G Pro switches, RGB backlighting, and dual compatibility for Mac and Windows systems.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
    category: 'Accessories',
    stock: 15,
  },
  {
    title: 'Logitech MX Master 3S Mouse',
    description: 'Ergonomic wireless performance mouse with 8K DPI tracking, ultra-quiet clicks, and MagSpeed electromagnetic scrolling. Flow cross-computer control.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60',
    category: 'Accessories',
    stock: 30,
  },
  {
    title: 'Apple Watch Series 9 GPS',
    description: 'S9 SiP chip, double tap gesture control, brighter Always-On Retina display, blood oxygen tracking, ECG app, and crash detection features.',
    price: 399.00,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60',
    category: 'Wearables',
    stock: 18,
  },
  {
    title: 'Samsung Galaxy Watch 6',
    description: 'Advanced sleep coaching, personalized heart rate zones, body composition analysis, and a sleek modern design with standard Wear OS compatibility.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60',
    category: 'Wearables',
    stock: 20,
  }
];

const importData = async () => {
  try {
    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample users (which will trigger password hashing in the User save hook)
    // Using save() on individual user items to trigger the user pre-save encryption hook correctly
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = new User(u);
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
