const Category = require('../models/Category');

const categoriesData = [
  {
    name: 'Electronics',
    description: 'Electronic devices, gadgets, and accessories',
    icon: 'Zap',
    color: '#FF6B6B',
    subcategories: [
      {
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        specifications: [
          { name: 'Brand', type: 'select', options: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo'], required: true },
          { name: 'Operating System', type: 'select', options: ['iOS', 'Android'], required: true },
          { name: 'RAM', type: 'select', options: ['4GB', '6GB', '8GB', '12GB', '16GB'], required: true },
          { name: 'Storage', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'], required: true },
          { name: 'Display Size', type: 'text', placeholder: 'e.g., 6.1 inches', required: true },
          { name: 'Battery Capacity', type: 'text', placeholder: 'e.g., 5000 mAh', required: false },
          { name: 'Processor', type: 'text', placeholder: 'e.g., A16 Bionic', required: true },
          { name: 'Camera', type: 'text', placeholder: 'e.g., 48MP', required: false },
          { name: 'Color', type: 'select', options: ['Black', 'White', 'Blue', 'Green', 'Purple', 'Gold', 'Silver'], required: true },
          { name: 'Warranty', type: 'select', options: ['6 Months', '1 Year', '2 Years'], required: true }
        ]
      },
      {
        name: 'Laptops',
        description: 'Laptops and notebook computers',
        specifications: [
          { name: 'Brand', type: 'select', options: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Apple', 'Acer', 'MSI'], required: true },
          { name: 'Operating System', type: 'select', options: ['Windows 11', 'Windows 10', 'macOS', 'Linux'], required: true },
          { name: 'Processor', type: 'text', placeholder: 'e.g., Intel i7, AMD Ryzen 7', required: true },
          { name: 'RAM', type: 'select', options: ['8GB', '16GB', '32GB', '64GB'], required: true },
          { name: 'Storage Type', type: 'select', options: ['SSD 256GB', 'SSD 512GB', 'SSD 1TB', 'HDD 1TB', 'Hybrid'], required: true },
          { name: 'Display Size', type: 'select', options: ['13 inch', '14 inch', '15.6 inch', '17 inch'], required: true },
          { name: 'Graphics', type: 'select', options: ['Integrated', 'NVIDIA GTX', 'NVIDIA RTX', 'AMD Radeon'], required: true },
          { name: 'Battery Life', type: 'text', placeholder: 'e.g., 8 hours', required: false },
          { name: 'Color', type: 'select', options: ['Black', 'Silver', 'Gold', 'Space Gray'], required: true },
          { name: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '3 Years'], required: true }
        ]
      },
      {
        name: 'Tablets',
        description: 'Tablets and iPad devices',
        specifications: [
          { name: 'Brand', type: 'select', options: ['Apple', 'Samsung', 'OnePlus', 'Lenovo', 'Xiaomi'], required: true },
          { name: 'Screen Size', type: 'select', options: ['7 inch', '8 inch', '10 inch', '12 inch', '13 inch'], required: true },
          { name: 'RAM', type: 'select', options: ['3GB', '4GB', '6GB', '8GB', '12GB'], required: true },
          { name: 'Storage', type: 'select', options: ['32GB', '64GB', '128GB', '256GB', '512GB'], required: true },
          { name: 'Processor', type: 'text', placeholder: 'e.g., M2', required: true },
          { name: 'Operating System', type: 'select', options: ['iOS', 'Android', 'iPadOS'], required: true },
          { name: 'Color', type: 'select', options: ['Black', 'White', 'Silver', 'Gray', 'Rose Gold'], required: true }
        ]
      }
    ]
  },
  {
    name: 'Fashion',
    description: 'Clothing, footwear, and accessories',
    icon: 'ShoppingBag',
    color: '#4ECDC4',
    subcategories: [
      {
        name: "Men's Clothing",
        description: 'T-shirts, shirts, trousers, and more',
        specifications: [
          { name: 'Type', type: 'select', options: ['T-Shirt', 'Shirt', 'Trousers', 'Jeans', 'Shorts', 'Jacket', 'Sweater'], required: true },
          { name: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., Navy Blue', required: true },
          { name: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Blended'], required: true },
          { name: 'Fit', type: 'select', options: ['Slim', 'Regular', 'Relaxed', 'Skinny'], required: true },
          { name: 'Brand', type: 'text', placeholder: 'e.g., Nike, Adidas', required: false },
          { name: 'Pattern', type: 'select', options: ['Solid', 'Striped', 'Checked', 'Printed', 'Graphic'], required: false }
        ]
      },
      {
        name: "Women's Clothing",
        description: 'Dresses, tops, leggings, and more',
        specifications: [
          { name: 'Type', type: 'select', options: ['Dress', 'Top', 'Blouse', 'Saree', 'Leggings', 'Jeans', 'Skirt', 'Kurti'], required: true },
          { name: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., Maroon', required: true },
          { name: 'Material', type: 'select', options: ['Cotton', 'Silk', 'Polyester', 'Linen', 'Georgette', 'Crepe'], required: true },
          { name: 'Occasion', type: 'select', options: ['Casual', 'Formal', 'Party', 'Wedding', 'Sports'], required: true },
          { name: 'Fit', type: 'select', options: ['Slim', 'Regular', 'Bodycon', 'Loose'], required: false },
          { name: 'Pattern', type: 'select', options: ['Solid', 'Striped', 'Printed', 'Embroidered'], required: false }
        ]
      },
      {
        name: 'Footwear',
        description: 'Shoes, sneakers, sandals',
        specifications: [
          { name: 'Type', type: 'select', options: ['Shoes', 'Sneakers', 'Sandals', 'Boots', 'Loafers', 'Heels'], required: true },
          { name: 'Size', type: 'select', options: ['5', '6', '7', '8', '9', '10', '11', '12', '13'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., Black', required: true },
          { name: 'Material', type: 'select', options: ['Leather', 'Canvas', 'Synthetic', 'Suede', 'Mesh'], required: true },
          { name: 'Style', type: 'select', options: ['Casual', 'Formal', 'Sports', 'Traditional'], required: true },
          { name: 'Brand', type: 'text', placeholder: 'e.g., Nike, Puma', required: false }
        ]
      }
    ]
  },
  {
    name: 'Home & Garden',
    description: 'Furniture, bedding, kitchenware, and more',
    icon: 'Home',
    color: '#95E1D3',
    subcategories: [
      {
        name: 'Furniture',
        description: 'Sofas, beds, tables, and chairs',
        specifications: [
          { name: 'Type', type: 'select', options: ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Desk', 'Bench'], required: true },
          { name: 'Material', type: 'select', options: ['Wood', 'Metal', 'Fabric', 'Leather', 'Velvet', 'Plastic'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., Brown', required: true },
          { name: 'Size', type: 'select', options: ['Small', 'Medium', 'Large', 'Extra Large'], required: true },
          { name: 'Style', type: 'select', options: ['Modern', 'Traditional', 'Vintage', 'Contemporary', 'Minimalist'], required: true },
          { name: 'Seating Capacity', type: 'select', options: ['1', '2', '3', '4', '5+'], required: false }
        ]
      },
      {
        name: 'Bedding',
        description: 'Bed sheets, pillows, comforters',
        specifications: [
          { name: 'Type', type: 'select', options: ['Bed Sheet Set', 'Pillow', 'Comforter', 'Quilt', 'Mattress Pad'], required: true },
          { name: 'Size', type: 'select', options: ['Single', 'Double', 'Queen', 'King'], required: true },
          { name: 'Material', type: 'select', options: ['Cotton', 'Silk', 'Polyester', 'Linen', 'Microfiber'], required: true },
          { name: 'Thread Count', type: 'select', options: ['200', '300', '400', '600', '800+'], required: false },
          { name: 'Color', type: 'text', placeholder: 'e.g., White', required: true },
          { name: 'Pattern', type: 'select', options: ['Solid', 'Striped', 'Floral', 'Geometric'], required: false }
        ]
      },
      {
        name: 'Kitchen & Dining',
        description: 'Cookware, dining sets, utensils',
        specifications: [
          { name: 'Category', type: 'select', options: ['Cookware', 'Dining Set', 'Utensils', 'Glassware', 'Crockery'], required: true },
          { name: 'Material', type: 'select', options: ['Stainless Steel', 'Aluminum', 'Ceramic', 'Glass', 'Non-stick'], required: true },
          { name: 'Number of Pieces', type: 'select', options: ['2', '3', '4', '6', '8', '12'], required: false },
          { name: 'Color', type: 'text', placeholder: 'e.g., Silver', required: false },
          { name: 'Heat Source', type: 'select', options: ['Gas', 'Electric', 'Induction', 'All'], required: false }
        ]
      }
    ]
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, fitness',
    icon: 'Activity',
    color: '#F38181',
    subcategories: [
      {
        name: 'Fitness Equipment',
        description: 'Gym equipment, yoga mats, dumbbells',
        specifications: [
          { name: 'Type', type: 'select', options: ['Dumbbell', 'Barbell', 'Resistance Band', 'Yoga Mat', 'Exercise Ball', 'Treadmill'], required: true },
          { name: 'Weight/Size', type: 'text', placeholder: 'e.g., 10kg, 6mm', required: false },
          { name: 'Material', type: 'select', options: ['Rubber', 'Metal', 'Plastic', 'Foam', 'PVC'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., Black', required: false },
          { name: 'Usage Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true }
        ]
      },
      {
        name: 'Sports Footwear',
        description: 'Running shoes, cricket shoes, sports boots',
        specifications: [
          { name: 'Sport', type: 'select', options: ['Running', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'], required: true },
          { name: 'Size', type: 'select', options: ['5', '6', '7', '8', '9', '10', '11', '12', '13'], required: true },
          { name: 'Color', type: 'text', placeholder: 'e.g., White', required: true },
          { name: 'Material', type: 'select', options: ['Mesh', 'Synthetic', 'Leather', 'Rubber'], required: true },
          { name: 'Brand', type: 'text', placeholder: 'e.g., Adidas, Nike', required: false }
        ]
      },
      {
        name: 'Outdoor Gear',
        description: 'Tents, backpacks, camping equipment',
        specifications: [
          { name: 'Type', type: 'select', options: ['Tent', 'Backpack', 'Sleeping Bag', 'Camping Stove', 'Water Bottle'], required: true },
          { name: 'Capacity', type: 'text', placeholder: 'e.g., 2 person, 50L', required: false },
          { name: 'Material', type: 'select', options: ['Nylon', 'Canvas', 'Polyester', 'Aluminum'], required: true },
          { name: 'Weight', type: 'text', placeholder: 'e.g., 2kg', required: false },
          { name: 'Season', type: 'select', options: ['Summer', 'Winter', 'All Season'], required: false }
        ]
      }
    ]
  },
  {
    name: 'Books & Media',
    description: 'Books, audiobooks, magazines, and media',
    icon: 'BookOpen',
    color: '#AA96DA',
    subcategories: [
      {
        name: 'Books',
        description: 'Fiction, Non-fiction, Educational',
        specifications: [
          { name: 'Genre', type: 'select', options: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Self-Help', 'Biography', 'Children'], required: true },
          { name: 'Language', type: 'select', options: ['English', 'Hindi', 'Regional'], required: true },
          { name: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'E-book'], required: true },
          { name: 'Author', type: 'text', placeholder: 'e.g., Amitav Ghosh', required: false },
          { name: 'Publisher', type: 'text', placeholder: 'e.g., Penguin Books', required: false },
          { name: 'Pages', type: 'number', placeholder: 'e.g., 300', required: false }
        ]
      }
    ]
  }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert seed data
    const insertedCategories = await Category.insertMany(
      categoriesData.map(cat => ({
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        subcategories: cat.subcategories.map((subcat, idx) => ({
          id: `subcat_${Date.now()}_${idx}`,
          name: subcat.name,
          slug: subcat.name.toLowerCase().replace(/\s+/g, '-'),
          description: subcat.description,
          specifications: subcat.specifications,
          isActive: true,
          order: idx
        })),
        isActive: true,
        order: categoriesData.indexOf(cat)
      }))
    );

    console.log(`✓ Seeded ${insertedCategories.length} categories with detailed specifications`);
    return insertedCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

module.exports = seedCategories;
