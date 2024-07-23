import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ProductModel } from '../models/product.model';

export default class ProductDataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(ProductModel)
      .values([
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Gaming Mouse',
          description: 'High-precision gaming mouse with customizable buttons and RGB lighting.',
          price: '50000',
          stock: 100,
          image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'LED Desk Lamp',
          description:
            'Sleek and adjustable desk lamp with multiple brightness levels and color modes. Ideal for reading or work.',
          price: '85000',
          stock: 250,
          image: 'https://m.media-amazon.com/images/I/71u8Fow735L._AC_SX679_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Portable Espresso Machine',
          description: 'Make barista-quality espresso drinks anywhere, anytime. Compact and easy to use.',
          price: '15000',
          stock: 250,
          image: 'https://m.media-amazon.com/images/I/61QEILMuuUL._AC_SL1001_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Wireless Earbuds',
          description: 'Experience true wireless freedom and crystal-clear sound with these comfortable earbuds.',
          price: '22000',
          stock: 85,
          image: 'https://m.media-amazon.com/images/I/517+Df4MI-L._AC_SL1500_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Smart Water Bottle',
          description:
            'Stay hydrated with this smart water bottle that tracks your water intake and glows to remind you to drink.',
          price: '52000',
          stock: 155,
          image: 'https://m.media-amazon.com/images/I/51Qq0a0HdeL._AC_SL1500_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Compact Air Fryer',
          description: 'Enjoy your favorite fried foods with less oil and no mess. Perfect for quick, healthy meals.',
          price: '92000',
          stock: 120,
          image: 'https://m.media-amazon.com/images/I/71n9ZSFtYnL._AC_SX679_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Smart Fitness Wristband',
          description:
            'Track your fitness activity, monitor your heart rate, and receive notifications with this sleek, waterproof wristband.',
          price: '202000',
          stock: 20,
          image: 'https://m.media-amazon.com/images/I/71n3U+vh6FL.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Solar-Powered Wireless Charger',
          description: 'Charge your devices anywhere with this portable, solar-powered charger. Perfect for outdoor adventures.',
          price: '29000',
          stock: 75,
          image: 'https://m.media-amazon.com/images/I/81HPJGIketL.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'AeroGarden Indoor Farm',
          description: 'Grow your own herbs and vegetables indoors year-round with this smart, soil-free, hydroponic garden.',
          price: '79000',
          stock: 100,
          image: 'https://m.media-amazon.com/images/I/51ovTzIeV1L.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'EcoSmart Lightbulb',
          description:
            'An energy-efficient LED lightbulb that can be controlled with your smartphone. Adjust brightness, color, and schedules easily.',
          price: '89000',
          stock: 160,
          image: 'https://m.media-amazon.com/images/I/617oY66sTgL._AC_SL1500_.jpg',
        },
        {
          id: uuidv4(),
          userId: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          name: 'Quantum Coffee Maker',
          description:
            'Brews coffee at the perfect temperature using quantum computing technology to ensure the best flavor extraction from your coffee beans.',
          price: '89000',
          stock: 56,
          image: 'https://m.media-amazon.com/images/I/61Ik6mL7ZtL.jpg',
        },
      ])
      .execute();
  }
}
