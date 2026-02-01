-- Productos
INSERT OR IGNORE INTO products (id, name, description, category, brand, price, old_price, stock, tags, image_url) VALUES

-- CALZADO (10 productos)
('p-001', 'Zapatillas Runner X', 'Zapatillas para running, suela EVA, talle 40-45', 'Calzado', 'SportCo', 79.99, 99.99, 25, 'running,outdoor', 'https://placehold.co/400x400/4A90E2/FFF?text=Runner+X'),
('p-011', 'Zapatillas Urban Style', 'Zapatillas urbanas de cuero sintetico, talle 38-44', 'Calzado', 'StreetWear', 64.99, 84.99, 30, 'casual,urban', 'https://placehold.co/400x400/7B68EE/FFF?text=Urban+Style'),
('p-012', 'Botas de Trekking Pro', 'Botas impermeables para montana, talle 39-46', 'Calzado', 'MountainGear', 129.99, 159.99, 15, 'outdoor,hiking', 'https://placehold.co/400x400/228B22/FFF?text=Trekking+Pro'),
('p-013', 'Sandalias de Playa', 'Sandalias comodas para verano, talle 36-43', 'Calzado', 'BeachLife', 24.99, NULL, 80, 'summer,beach', 'https://placehold.co/400x400/FFD700/000?text=Beach+Sandals'),
('p-014', 'Zapatos Formales Oxford', 'Zapatos de cuero para ocasiones formales, talle 39-45', 'Calzado', 'Elegance', 89.99, 109.99, 20, 'formal,business', 'https://placehold.co/400x400/2F4F4F/FFF?text=Oxford'),
('p-015', 'Zapatillas Deportivas Max', 'Zapatillas con tecnologia air cushion, talle 40-46', 'Calzado', 'SportCo', 99.99, 129.99, 18, 'running,sport', 'https://placehold.co/400x400/FF6347/FFF?text=Max+Air'),
('p-016', 'Mocasines Casual Confort', 'Mocasines suaves para uso diario, talle 38-44', 'Calzado', 'ComfortShoes', 54.99, NULL, 35, 'casual,comfort', 'https://placehold.co/400x400/CD853F/FFF?text=Mocasines'),
('p-017', 'Zapatillas Basketball Pro', 'Zapatillas de basketball con soporte de tobillo, talle 40-47', 'Calzado', 'HoopMaster', 119.99, 149.99, 12, 'basketball,sport', 'https://placehold.co/400x400/FF4500/FFF?text=Basketball'),
('p-018', 'Pantuflas de Casa', 'Pantuflas suaves y calidas para el hogar', 'Calzado', 'HomeComfort', 19.99, NULL, 60, 'home,comfort', 'https://placehold.co/400x400/DDA0DD/000?text=Pantuflas'),
('p-019', 'Zapatos de Futbol Cleats', 'Zapatos con tacos para cesped natural, talle 39-45', 'Calzado', 'GoalMaker', 79.99, 99.99, 22, 'football,sport', 'https://placehold.co/400x400/32CD32/000?text=Football'),

-- ROPA (12 productos)
('p-002', 'Camisa Casual Lona', 'Camisa algodon premium, manga larga', 'Ropa', 'ModaYa', 34.50, NULL, 100, 'casual', 'https://placehold.co/400x400/87CEEB/000?text=Camisa+Casual'),
('p-006', 'Pantalon Jogger', 'Jogger sport con ajuste elastico', 'Ropa', 'ModaYa', 29.90, 39.90, 60, 'sport', 'https://placehold.co/400x400/696969/FFF?text=Jogger'),
('p-010', 'Calcetines Pack x3', 'Algodon confortable', 'Ropa', 'BasicWear', 9.99, NULL, 200, 'basics', 'https://placehold.co/400x400/A9A9A9/000?text=Calcetines'),
('p-020', 'Remera Basica Cuello Redondo', 'Remera de algodon 100%, pack x2', 'Ropa', 'BasicWear', 14.99, NULL, 150, 'basics,casual', 'https://placehold.co/400x400/F0E68C/000?text=Remera+Basica'),
('p-021', 'Jeans Slim Fit', 'Jeans azul oscuro, corte slim', 'Ropa', 'DenimCo', 49.99, 59.99, 45, 'casual,denim', 'https://placehold.co/400x400/4169E1/FFF?text=Jeans+Slim'),
('p-022', 'Buzo con Capucha', 'Buzo de algodon con interior afelpado', 'Ropa', 'ModaYa', 39.99, 49.99, 70, 'casual,winter', 'https://placehold.co/400x400/8B4513/FFF?text=Buzo+Capucha'),
('p-023', 'Chomba Polo Clasica', 'Chomba de algodon pique', 'Ropa', 'Elegance', 29.99, NULL, 90, 'casual,polo', 'https://placehold.co/400x400/20B2AA/FFF?text=Polo'),
('p-024', 'Shorts Deportivos', 'Shorts ligeros para entrenamiento', 'Ropa', 'SportCo', 24.99, NULL, 80, 'sport,training', 'https://placehold.co/400x400/FF69B4/000?text=Shorts'),
('p-025', 'Campera Impermeable', 'Campera cortaviento con capucha', 'Ropa', 'OutdoorPro', 79.99, 99.99, 30, 'outdoor,rain', 'https://placehold.co/400x400/2F4F4F/FFF?text=Impermeable'),
('p-026', 'Vestido Casual Verano', 'Vestido fresco de algodon estampado', 'Ropa', 'ModaYa', 44.99, NULL, 40, 'summer,dress', 'https://placehold.co/400x400/FF1493/FFF?text=Vestido'),
('p-027', 'Traje de Bano Deportivo', 'Traje de bano para natacion', 'Ropa', 'AquaSport', 34.99, NULL, 55, 'swim,sport', 'https://placehold.co/400x400/00CED1/000?text=Traje+Bano'),
('p-028', 'Pijama Conjunto 2 Piezas', 'Pijama de algodon suave', 'Ropa', 'SleepWell', 29.99, NULL, 65, 'sleepwear,comfort', 'https://placehold.co/400x400/DDA0DD/000?text=Pijama'),
('p-029', 'Chaqueta de Cuero Sintetico', 'Chaqueta estilo biker', 'Ropa', 'UrbanStyle', 89.99, 119.99, 25, 'casual,leather', 'https://placehold.co/400x400/000000/FFF?text=Chaqueta'),

-- ELECTRONICA (12 productos)
('p-003', 'Auriculares Inalambricos A1', 'Bluetooth 5.2, cancelacion ruido', 'Electronica', 'SoundMax', 59.00, 79.00, 10, 'audio,gadget', 'https://placehold.co/400x400/FF6347/FFF?text=Auriculares'),
('p-007', 'Smartwatch S2', 'Monitor cardiaco, notificaciones', 'Electronica', 'TimeTech', 89.00, 119.00, 15, 'wearable', 'https://placehold.co/400x400/1E90FF/FFF?text=Smartwatch'),
('p-030', 'Teclado Mecanico RGB', 'Teclado gamer con switches azules', 'Electronica', 'GameTech', 79.99, 99.99, 20, 'gaming,keyboard', 'https://placehold.co/400x400/8A2BE2/FFF?text=Teclado+RGB'),
('p-031', 'Mouse Inalambrico Ergonomico', 'Mouse con 6 botones programables', 'Electronica', 'OfficeMax', 34.99, NULL, 50, 'office,mouse', 'https://placehold.co/400x400/696969/FFF?text=Mouse'),
('p-032', 'Webcam HD 1080p', 'Camara web con microfono integrado', 'Electronica', 'StreamPro', 44.99, 59.99, 30, 'streaming,camera', 'https://placehold.co/400x400/DC143C/FFF?text=Webcam'),
('p-033', 'Parlante Bluetooth Portatil', 'Parlante resistente al agua, 12 horas bateria', 'Electronica', 'SoundMax', 49.99, NULL, 40, 'audio,portable', 'https://placehold.co/400x400/FF8C00/FFF?text=Parlante'),
('p-034', 'Power Bank 20000mAh', 'Bateria externa con carga rapida', 'Electronica', 'ChargeIt', 39.99, 49.99, 60, 'battery,portable', 'https://placehold.co/400x400/4682B4/FFF?text=PowerBank'),
('p-035', 'Cable USB-C 2 Metros', 'Cable trenzado de nylon, carga rapida', 'Electronica', 'ConnectPro', 12.99, NULL, 100, 'cable,usb', 'https://placehold.co/400x400/778899/FFF?text=Cable+USB'),
('p-036', 'Soporte para Laptop', 'Soporte ajustable de aluminio', 'Electronica', 'OfficeMax', 29.99, NULL, 45, 'office,ergonomic', 'https://placehold.co/400x400/C0C0C0/000?text=Soporte'),
('p-037', 'Hub USB 4 Puertos', 'Expansor USB 3.0 de alta velocidad', 'Electronica', 'ConnectPro', 19.99, NULL, 70, 'usb,hub', 'https://placehold.co/400x400/708090/FFF?text=Hub+USB'),
('p-038', 'Ring Light LED', 'Aro de luz para video y fotos', 'Electronica', 'StreamPro', 54.99, 69.99, 25, 'streaming,lighting', 'https://placehold.co/400x400/FFD700/000?text=Ring+Light'),
('p-039', 'Microfono de Condensador', 'Microfono USB para streaming y podcasts', 'Electronica', 'SoundMax', 69.99, 89.99, 18, 'audio,streaming', 'https://placehold.co/400x400/2F4F4F/FFF?text=Microfono'),
('p-040', 'Cargador Inalambrico', 'Cargador Qi de 15W', 'Electronica', 'ChargeIt', 24.99, NULL, 80, 'wireless,charger', 'https://placehold.co/400x400/4B0082/FFF?text=Cargador'),

-- HOGAR (10 productos)
('p-004', 'Cafetera Express 12oz', 'Cafetera automatica, 15 bar', 'Hogar', 'HomeBrew', 129.00, 159.99, 5, 'kitchen', 'https://placehold.co/400x400/8B4513/FFF?text=Cafetera'),
('p-008', 'Lampara LED de Mesa', 'Luz regulable, USB-C', 'Hogar', 'LightIt', 24.50, NULL, 30, 'decor', 'https://placehold.co/400x400/F4A460/000?text=Lampara'),
('p-009', 'Set de Cocina 3 Piezas', 'Ollas antiadherentes, apto induccion', 'Hogar', 'CookWell', 69.99, 89.99, 8, 'kitchen', 'https://placehold.co/400x400/A0522D/FFF?text=Set+Cocina'),
('p-041', 'Juego de Sabanas Queen', 'Sabanas de microfibra 144 hilos', 'Hogar', 'DreamBed', 39.99, NULL, 50, 'bedroom,bedding', 'https://placehold.co/400x400/E6E6FA/000?text=Sabanas'),
('p-042', 'Toallas Pack x4', 'Toallas de algodon 500g por metro cuadrado', 'Hogar', 'BathLux', 34.99, 44.99, 40, 'bathroom,towels', 'https://placehold.co/400x400/87CEEB/000?text=Toallas'),
('p-043', 'Espejo de Bano con Luz LED', 'Espejo rectangular 60x80cm con iluminacion', 'Hogar', 'LightIt', 79.99, NULL, 15, 'bathroom,mirror', 'https://placehold.co/400x400/B0C4DE/000?text=Espejo'),
('p-044', 'Organizador de Closet 6 Cubos', 'Estanteria modular de tela', 'Hogar', 'OrganizePro', 44.99, NULL, 35, 'storage,organize', 'https://placehold.co/400x400/DAA520/000?text=Organizador'),
('p-045', 'Difusor de Aromas Ultrasonico', 'Difusor con 7 luces LED de colores', 'Hogar', 'ZenHome', 29.99, 39.99, 55, 'wellness,aromatherapy', 'https://placehold.co/400x400/9370DB/FFF?text=Difusor'),
('p-046', 'Cortinas Blackout 2 Panos', 'Cortinas que bloquean 99% de la luz', 'Hogar', 'WindowPro', 49.99, NULL, 30, 'window,curtains', 'https://placehold.co/400x400/2C3E50/FFF?text=Cortinas'),
('p-047', 'Alfombra Decorativa 150x200', 'Alfombra suave para sala de estar', 'Hogar', 'DecorHome', 89.99, 109.99, 20, 'decor,rug', 'https://placehold.co/400x400/BC8F8F/000?text=Alfombra'),

-- ACCESORIOS (6 productos)
('p-005', 'Mochila Urbana 20L', 'Mochila impermeable, compartimento laptop 15 pulgadas', 'Accesorios', 'UrbanPack', 49.90, NULL, 40, 'travel,work', 'https://placehold.co/400x400/2E8B57/FFF?text=Mochila'),
('p-048', 'Billetera de Cuero Genuino', 'Billetera con proteccion RFID', 'Accesorios', 'LeatherCraft', 34.99, NULL, 60, 'leather,wallet', 'https://placehold.co/400x400/654321/FFF?text=Billetera'),
('p-049', 'Gafas de Sol Polarizadas', 'Gafas UV400 con estuche incluido', 'Accesorios', 'SunStyle', 29.99, 39.99, 50, 'sunglasses,fashion', 'https://placehold.co/400x400/000000/FFF?text=Gafas+Sol'),
('p-050', 'Reloj Analogico Clasico', 'Reloj de pulsera con correa de cuero', 'Accesorios', 'TimeTech', 59.99, 79.99, 30, 'watch,classic', 'https://placehold.co/400x400/2F4F4F/FFF?text=Reloj'),
('p-051', 'Cinturon de Cuero Reversible', 'Cinturon negro y marron de doble cara', 'Accesorios', 'LeatherCraft', 24.99, NULL, 70, 'belt,leather', 'https://placehold.co/400x400/8B4513/FFF?text=Cinturon'),
('p-052', 'Paraguas Automatico', 'Paraguas resistente al viento 105cm', 'Accesorios', 'RainShield', 19.99, NULL, 45, 'rain,umbrella', 'https://placehold.co/400x400/191970/FFF?text=Paraguas');


-- Zonas
INSERT OR IGNORE INTO zones (id, name, zip_code, active) VALUES
('zone-1', 'Santiago Centro', '8320000', 1),
('zone-2', 'Providencia', '7500000', 1),
('zone-3', 'Las Condes', '7550000', 1);

-- Despachos
INSERT OR IGNORE INTO delivery_windows (id, date, start_time, end_time, capacity_total, capacity_by_zone, cost, version) VALUES
('w-20260128-1', '2026-02-02', '09:00', '11:00', 5, '{"zone-1":3,"zone-2":1,"zone-3":1}', 1.55, 0),
('w-20260128-2', '2026-02-02', '11:00', '13:00', 5, '{"zone-1":2,"zone-2":2,"zone-3":1}', 1.55, 0),
('w-20260129-1', '2026-02-03', '09:00', '11:00', 6, '{"zone-1":3,"zone-2":2,"zone-3":1}', 2.55, 0),
('w-20260131-1', '2026-02-05', '09:00', '11:00', 5, '{"zone-1":2,"zone-2":2,"zone-3":1}', 2.50, 0),
('w-20260131-2', '2026-02-05', '14:00', '17:00', 6, '{"zone-1":3,"zone-2":2,"zone-3":1}', 3.50, 0),
('w-20260201-1', '2026-02-06', '09:00', '12:00', 8, '{"zone-1":4,"zone-2":2,"zone-3":2}', 4.00, 0),
('w-20260201-2', '2026-02-06', '14:00', '18:00', 8, '{"zone-1":3,"zone-2":3,"zone-3":2}', 4.50, 0);