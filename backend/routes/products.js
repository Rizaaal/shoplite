const express = require('express');
const { protectedRoute } = require('../middlewares/protectedRoute');
const router = express.Router();

const mockProducts = [
  // GPU (Schede Video)
  { id: 1, name: "MSI GeForce RTX 4070 Ventus 2X OC", description: "High-performance GPU with dual-fan cooling, ideal for 1440p gaming and content creation.", price: 599.99, category: "GPU", qty: 14 },
  { id: 2, name: "Gigabyte GeForce RTX 4070 Gaming OC", description: "Factory overclocked RTX 4070 with Windforce triple-fan cooling for excellent thermal performance.", price: 609.99, category: "GPU", qty: 9 },
  { id: 3, name: "NVIDIA RTX 4070", description: "Reference-class RTX 4070 offering great ray tracing and DLSS 3 support for modern games.", price: 589.99, category: "GPU", qty: 7 },
  { id: 4, name: "AMD RX 7800 XT", description: "AMD's competitive 1440p card with 16GB GDDR6 and strong rasterization performance.", price: 499.99, category: "GPU", qty: 11 },
  { id: 5, name: "NVIDIA RTX 4060 Ti", description: "Mid-range Ada Lovelace GPU great for 1080p and entry-level 1440p gaming.", price: 399.99, category: "GPU", qty: 20 },
  { id: 6, name: "AMD RX 7700 XT", description: "Budget-friendly RDNA 3 GPU delivering solid 1080p performance at an accessible price point.", price: 449.99, category: "GPU", qty: 15 },
  { id: 7, name: "NVIDIA RTX 4070 Ti", description: "Top-tier Ada Lovelace card for enthusiast 1440p and smooth 4K gaming experiences.", price: 799.99, category: "GPU", qty: 6 },

  // CPU (Processori)
  { id: 8, name: "Intel Core i7-13700K", description: "16-core Raptor Lake processor with unlocked multiplier, excellent for gaming and multitasking.", price: 379.99, category: "CPU", qty: 18 },
  { id: 9, name: "Intel Core i7-13700KF", description: "Same as i7-13700K but without integrated graphics, perfect when pairing with a dedicated GPU.", price: 359.99, category: "CPU", qty: 13 },
  { id: 10, name: "Intel Core i5-13600K", description: "14-core budget champion offering outstanding gaming performance for the price.", price: 289.99, category: "CPU", qty: 22 },
  { id: 11, name: "AMD Ryzen 5 7600X", description: "6-core Zen 4 processor with high clock speeds, great for gaming on a budget.", price: 249.99, category: "CPU", qty: 25 },
  { id: 12, name: "AMD Ryzen 7 7800X3D", description: "Gaming-focused CPU with 3D V-Cache technology for best-in-class gaming frame rates.", price: 449.99, category: "CPU", qty: 10 },
  { id: 13, name: "AMD Ryzen 9 7900X", description: "12-core high-end Zen 4 CPU designed for demanding workloads and content creation.", price: 549.99, category: "CPU", qty: 8 },

  // Scheda Madre (Motherboard)
  { id: 14, name: "ASUS ROG Strix B650E-E Gaming WiFi", description: "Premium AM5 motherboard with PCIe 5.0 support, WiFi 6E and robust power delivery for Ryzen 7000.", price: 329.99, category: "Motherboard", qty: 7 },
  { id: 15, name: "MSI MAG B760 Tomahawk WiFi", description: "Solid LGA1700 motherboard with DDR5 support, WiFi 6E and excellent VRM for Intel 13th gen.", price: 219.99, category: "Motherboard", qty: 12 },
  { id: 16, name: "Gigabyte B650 Aorus Elite", description: "Feature-rich AM5 board with PCIe 5.0 M.2, solid VRM and good overclocking headroom.", price: 229.99, category: "Motherboard", qty: 9 },
  { id: 17, name: "ASUS TUF Gaming B760-Plus", description: "Reliable Intel B760 board with military-grade components and support for DDR5 memory.", price: 189.99, category: "Motherboard", qty: 16 },
  { id: 18, name: "ASRock B650 Steel Legend", description: "Mid-range AM5 motherboard with steel-reinforced slots, PCIe 4.0 and solid connectivity.", price: 199.99, category: "Motherboard", qty: 11 },

  // Memoria (SSD – HDD – RAM)
  { id: 19, name: "Samsung 990 Pro NVMe SSD", description: "Top-tier PCIe 4.0 NVMe SSD with sequential reads up to 7450 MB/s, ideal for OS and games.", price: 129.99, category: "Storage", qty: 30 },
  { id: 20, name: "Seagate BarraCuda HDD", description: "Reliable 2TB mechanical hard drive for bulk storage of games, media and backups.", price: 59.99, category: "Storage", qty: 40 },
  { id: 21, name: "WD Black SN850X SSD", description: "High-performance PCIe 4.0 SSD optimized for gaming with speeds up to 7300 MB/s.", price: 139.99, category: "Storage", qty: 20 },
  { id: 22, name: "Corsair Vengeance DDR5 RAM", description: "32GB DDR5-5600 dual-channel kit with low latency tuning for next-gen platforms.", price: 109.99, category: "RAM", qty: 28 },
  { id: 23, name: "Kingston Fury Beast DDR5 RAM", description: "32GB DDR5-6000 kit with plug-and-play XMP 3.0 support and aggressive heat spreader.", price: 119.99, category: "RAM", qty: 22 },

  // Case (PC Case)
  { id: 24, name: "Corsair 4000D Airflow Case", description: "Mid-tower ATX case with mesh front panel and two pre-installed fans for excellent airflow.", price: 94.99, category: "Case", qty: 17 },
  { id: 25, name: "Corsair Frame 4000D Case", description: "Sleek variant of the 4000D with tempered glass side panel and clean cable management.", price: 89.99, category: "Case", qty: 14 },
  { id: 26, name: "NZXT H510", description: "Minimalist mid-tower with tempered glass, integrated cable management and compact footprint.", price: 79.99, category: "Case", qty: 19 },
  { id: 27, name: "Lian Li Lancool II", description: "Spacious ATX case with excellent airflow, three pre-installed fans and easy-access panels.", price: 99.99, category: "Case", qty: 10 },
  { id: 28, name: "Fractal Design Meshify C", description: "Compact mesh-front case with angular design and great cooling performance in a small footprint.", price: 89.99, category: "Case", qty: 13 },
  { id: 29, name: "Phanteks Eclipse P400A", description: "Budget-friendly mesh ATX case with strong airflow and support for 360mm radiators.", price: 74.99, category: "Case", qty: 21 },

  // Accessori (Cuffie + Tastiere)
  { id: 30, name: "Logitech G Pro X Gaming Headset", description: "Pro-grade headset with Blue VO!CE microphone technology and DTS Headphone:X 2.0 surround sound.", price: 129.99, category: "Accessories", qty: 24 },
  { id: 31, name: "HyperX Cloud II Headset", description: "Iconic gaming headset with 53mm drivers, virtual 7.1 surround and durable aluminum frame.", price: 99.99, category: "Accessories", qty: 30 },
  { id: 32, name: "SteelSeries Arctis 7 Headset", description: "Wireless gaming headset with 24-hour battery, ClearCast microphone and lossless 2.4GHz audio.", price: 149.99, category: "Accessories", qty: 18 },
  { id: 33, name: "Logitech G915 Keyboard", description: "Low-profile wireless mechanical keyboard with GL switches, RGB and multi-device connectivity.", price: 229.99, category: "Accessories", qty: 12 },
  { id: 34, name: "Razer BlackWidow V4 Keyboard", description: "Full-size mechanical keyboard with Razer Yellow switches, RGB Chroma and dedicated macro keys.", price: 139.99, category: "Accessories", qty: 16 },
];

// get all products
router.get('/', (req, res) => {
  try {
    res.json(mockProducts)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't get products"})
  }
})

// get product by id
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = mockProducts.find(product => {
      return product.id === id
    });

    // return an error response if not found
    if (!product) res.status(404).json({ error: `product with id ${id} not found`});

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't get product"})
  }
});

// get products by category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const products = mockProducts.filter(product => {
      return product.category === category
    });

    //if products === undefined (nothings was found) return an error
    if (!products) res.json({ error: "no products in category"});

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't get products"})
  }
})

// PROTECTED ROUTES

// post a product
router.post('/', protectedRoute, (req, res) => {
  try {
    const { name, description, price, category, qty } = req.body;
    const newItem = {
      id: mockProducts[mockProducts.length - 1].id + 1 || 1, //increment id based on last element
      name,
      description,
      price,
      category,
      qty: qty || 1
    };
    mockProducts.push(newItem);
    res.json(mockProducts[mockProducts.length - 1])
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't add product"})
  }
})

// delete a product by id
router.delete('/:id', protectedRoute, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const removedProductIndex = mockProducts.findIndex(product => {
      return product.id === id
    })

    if (removedProductIndex === -1) res.status(404).json({ error: "the element does not exist" });

    const x = mockProducts.splice(removedProductIndex, 1);
    res.json(x);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error: couldn't delete product"})
  }
});

module.exports = {
  productsRouter: router,
  mockProducts
};