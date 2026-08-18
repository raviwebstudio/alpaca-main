INSERT OR IGNORE INTO User (id, email, phone, passwordHash, role, isVerified, isActive, createdAt, updatedAt) VALUES
('admin_1', 'admin@alpaca.com', '9999999999', 'hashed', 'ADMIN', 1, 1, datetime('now'), datetime('now')),
('seller_1', 'seller@alpaca.com', '8888888888', 'hashed', 'SELLER', 1, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO SellerProfile (id, userId, storeName, storeSlug, status, commissionRate, totalEarnings, pendingPayout, createdAt) VALUES
('sp_1', 'seller_1', 'ALPACA Studio', 'alpaca-studio', 'APPROVED', 10.0, 0, 0, datetime('now'));

INSERT OR IGNORE INTO Category (id, name, slug, createdAt) VALUES
('cat_1', 'Oversized', 'oversized', datetime('now')),
('cat_2', 'Basics', 'basics', datetime('now')),
('cat_3', 'Outerwear', 'outerwear', datetime('now'));

INSERT OR IGNORE INTO Product (id, sellerId, categoryId, name, slug, description, price, stock, images, tags, isFeatured, status, createdAt, updatedAt) VALUES
('prod_1', 'sp_1', 'cat_1', 'Drift Box Tee', 'drift-box-tee', 'A boxy silhouette made for repeat wear and easy layering.', 2290, 50, '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"]', '["oversized"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_2', 'sp_1', 'cat_2', 'Contour Baby Tee', 'contour-baby-tee', 'A clean everyday basic designed to sit close without feeling restrictive.', 1690, 30, '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800"]', '["basics"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_3', 'sp_1', 'cat_3', 'Aero Shell Jacket', 'aero-shell-jacket', 'A clean technical shell that stays light while keeping the silhouette sharp.', 5990, 20, '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"]', '["outerwear"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_4', 'sp_1', 'cat_3', 'Fleece Overshirt', 'fleece-overshirt', 'A cozy outer layer that works as a shirt indoors and a jacket outdoors.', 4290, 25, '["https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800"]', '["outerwear"]', 0, 'ACTIVE', datetime('now'), datetime('now')),
('prod_5', 'sp_1', 'cat_1', 'Motion Heavy Tee', 'motion-heavy-tee', 'A dense oversized tee built for everyday rotation and clean structure.', 2490, 40, '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"]', '["oversized"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_6', 'sp_1', 'cat_2', 'Core Rib Tank', 'core-rib-tank', 'A close-fit tank designed for layering, warm days, and a cleaner line.', 1490, 60, '["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800"]', '["basics"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_7', 'sp_1', 'cat_3', 'Transit Hooded Layer', 'transit-hooded-layer', 'A soft hooded layer that keeps the silhouette relaxed without feeling bulky.', 4490, 15, '["https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800"]', '["outerwear"]', 1, 'ACTIVE', datetime('now'), datetime('now')),
('prod_8', 'sp_1', 'cat_3', 'Route Zip Jacket', 'route-zip-jacket', 'A refined outer layer made for city movement and easy day-to-night wear.', 4890, 18, '["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"]', '["outerwear"]', 1, 'ACTIVE', datetime('now'), datetime('now'));
