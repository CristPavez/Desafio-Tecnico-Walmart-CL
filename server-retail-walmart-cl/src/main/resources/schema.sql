-- Schema for SQLite database

-- Productos table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    brand TEXT,
    price REAL NOT NULL,
    old_price REAL, 
    stock INTEGER NOT NULL DEFAULT 0,  
    tags TEXT,
    image_url TEXT
);

-- Zonas table
CREATE TABLE IF NOT EXISTS zones (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    zip_code TEXT NOT NULL UNIQUE,
    active INTEGER NOT NULL DEFAULT 1
);

-- Ventanas de entrega table
CREATE TABLE IF NOT EXISTS delivery_windows (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL, 
    capacity_total INTEGER NOT NULL,
    capacity_by_zone TEXT,  
    cost REAL NOT NULL DEFAULT 0,  
    version INTEGER DEFAULT 0,
    UNIQUE(date, start_time)
);

-- Reservas temporales table
CREATE TABLE IF NOT EXISTS temporary_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_window_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    zone_id TEXT NOT NULL, 
    reserved_at TEXT NOT NULL,
    FOREIGN KEY (delivery_window_id) REFERENCES delivery_windows(id),
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

-- Carrito table
CREATE TABLE IF NOT EXISTS carts (
    cart_id TEXT PRIMARY KEY,
    shipping_address TEXT, 
    payment_method TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Items del carrito table
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id TEXT NOT NULL,
    sku TEXT NOT NULL, 
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (sku) REFERENCES products(id),
    UNIQUE(cart_id, sku)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_delivery_windows_date ON delivery_windows(date);
CREATE INDEX IF NOT EXISTS idx_temp_reservations_session ON temporary_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_temp_reservations_expires ON temporary_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_sku ON cart_items(sku);
