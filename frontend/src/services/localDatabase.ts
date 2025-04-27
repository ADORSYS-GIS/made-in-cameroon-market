import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface CameroonMarketplaceDB extends DBSchema {
  products: {
    key: number;
    value: Product;
    indexes: {
      "by-category": string;
      "by-vendor": string;
    };
  };
  cart: {
    key: number;
    value: CartItem;
  };
  syncQueue: {
    key: number;
    value: SyncOperation;
    indexes: {
      "by-status": string;
      "by-priority": number;
    };
  };
  vendorProfiles: {
    key: string;
    value: VendorProfile;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  addedAt: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  description: string;
  contactInfo: string;
  location: string;
}

export interface SyncOperation {
  id: number;
  operation: "create" | "update" | "delete";
  entityType: "product" | "cart" | "order" | "profile";
  entityId: number | string;
  data: unknown;
  timestamp: number;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  priority: 1 | 2 | 3; // 1 = highest priority
}

let db: IDBPDatabase<CameroonMarketplaceDB> | undefined;

// Populate test data
async function populateTestData(
  db: IDBPDatabase<CameroonMarketplaceDB>,
): Promise<void> {
  const tx = db.transaction(
    ["products", "cart", "vendorProfiles"],
    "readwrite",
  );

  // Test products with Unsplash image URLs
  const products: Product[] = [
    {
      id: 1,
      name: "Handwoven Basket",
      description:
        "Traditional Cameroonian handwoven basket made from natural fibers.",
      price: 25.99,
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      ],
      category: "Crafts",
      vendor: "vendor1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Organic Coffee Beans",
      description:
        "Locally grown organic coffee beans from the Northwest Region.",
      price: 12.5,
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      ],
      category: "Food",
      vendor: "vendor2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Beaded Necklace",
      description: "Handcrafted beaded necklace with vibrant colors.",
      price: 15.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      ],
      category: "Jewelry",
      vendor: "vendor1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Wooden Sculpture",
      description: "Intricately carved wooden sculpture from local artisans.",
      price: 45.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Crafts",
      vendor: "vendor3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Traditional Drum",
      description:
        "Handmade traditional drum with authentic Cameroonian designs.",
      price: 60.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Music",
      vendor: "vendor1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Palm Oil",
      description: "Pure, locally sourced palm oil for cooking.",
      price: 8.99,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Food",
      vendor: "vendor2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 7,
      name: "Embroidered Fabric",
      description: "Colorful embroidered fabric for traditional attire.",
      price: 30.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Textiles",
      vendor: "vendor3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Leather Sandals",
      description: "Handcrafted leather sandals with durable stitching.",
      price: 22.5,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Fashion",
      vendor: "vendor4",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Honey Jar",
      description: "Natural honey harvested from Cameroonian forests.",
      price: 10.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Food",
      vendor: "vendor2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 10,
      name: "Ceramic Pot",
      description: "Handmade ceramic pot for cooking or decoration.",
      price: 35.0,
      imageUrls: [
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119",
      ],
      category: "Crafts",
      vendor: "vendor3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Test cart items
  const cartItems: Omit<CartItem, "id">[] = [
    {
      productId: 1,
      quantity: 2,
      addedAt: new Date().toISOString(),
    },
    {
      productId: 2,
      quantity: 1,
      addedAt: new Date().toISOString(),
    },
    {
      productId: 4,
      quantity: 1,
      addedAt: new Date().toISOString(),
    },
  ];

  // Test vendor profiles
  const vendorProfiles: VendorProfile[] = [
    {
      id: "vendor1",
      name: "Cameroon Crafts Co.",
      description:
        "Specializing in traditional Cameroonian crafts and jewelry.",
      contactInfo: "contact@camcrafts.com",
      location: "Bamenda",
    },
    {
      id: "vendor2",
      name: "Highland Coffee Farms",
      description: "Organic coffee and tea from the Northwest Region.",
      contactInfo: "info@highlandcoffee.cm",
      location: "Buea",
    },
    {
      id: "vendor3",
      name: "Artisan Collective",
      description: "Handcrafted sculptures, textiles, and ceramics.",
      contactInfo: "artisan@collective.cm",
      location: "Yaoundé",
    },
    {
      id: "vendor4",
      name: "Leatherworks",
      description: "Quality leather goods and accessories.",
      contactInfo: "leatherworks@shop.cm",
      location: "Douala",
    },
  ];

  // Save test data
  await Promise.all([
    ...products.map((product) => tx.objectStore("products").put(product)),
    ...cartItems.map((item) => tx.objectStore("cart").add(item)),
    ...vendorProfiles.map((profile) =>
      tx.objectStore("vendorProfiles").put(profile),
    ),
    tx.done,
  ]);
}

export async function initDB(): Promise<IDBPDatabase<CameroonMarketplaceDB>> {
  if (db) return db;

  db = await openDB<CameroonMarketplaceDB>("cameroon-marketplace", 1, {
    upgrade(database) {
      // Products store
      const productStore = database.createObjectStore("products", {
        keyPath: "id",
      });
      productStore.createIndex("by-category", "category");
      productStore.createIndex("by-vendor", "vendor");

      // Cart store
      database.createObjectStore("cart", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Sync queue store
      const syncStore = database.createObjectStore("syncQueue", {
        keyPath: "id",
        autoIncrement: true,
      });
      syncStore.createIndex("by-status", "status");
      syncStore.createIndex("by-priority", "priority");

      // Vendor profiles store
      database.createObjectStore("vendorProfiles", { keyPath: "id" });
    },
  });

  // Populate test data after database initialization
  await populateTestData(db);

  return db;
}

export async function getProducts(): Promise<Product[]> {
  const db = await initDB();
  return db.getAll("products");
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const db = await initDB();
  return db.getAllFromIndex("products", "by-category", category);
}

export async function getProduct(id: number): Promise<Product | undefined> {
  const db = await initDB();
  return db.get("products", id);
}

export async function saveProducts(products: Product[]): Promise<void> {
  const db = await initDB();
  const tx = db.transaction("products", "readwrite");
  await Promise.all([
    ...products.map((product) => tx.store.put(product)),
    tx.done,
  ]);
}

export async function addToCart(
  productId: number,
  quantity: number,
): Promise<void> {
  const db = await initDB();
  await db.add("cart", {
    productId,
    quantity,
    addedAt: new Date().toISOString(),
  } as Omit<CartItem, "id">);
}

export async function getCart(): Promise<CartItem[]> {
  const db = await initDB();
  return db.getAll("cart");
}

export async function clearCart(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction("cart", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function addToSyncQueue(
  operation: Omit<SyncOperation, "id" | "timestamp" | "status" | "retryCount">,
): Promise<number> {
  const db = await initDB();
  const id = await db.add("syncQueue", {
    ...operation,
    timestamp: Date.now(),
    status: "pending",
    retryCount: 0,
  } as Omit<SyncOperation, "id">);
  return id;
}

export async function getPendingSyncOperations(): Promise<SyncOperation[]> {
  const db = await initDB();
  return db.getAllFromIndex("syncQueue", "by-status", "pending");
}

export async function updateSyncOperation(
  id: number,
  updates: Partial<SyncOperation>,
): Promise<void> {
  const db = await initDB();
  const operation = await db.get("syncQueue", id);
  if (!operation) return;

  await db.put("syncQueue", {
    ...operation,
    ...updates,
  });
}
