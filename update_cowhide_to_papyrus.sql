BEGIN;

-- Highlands Cowhide Cosmetic Pouch (c1000000...001) — new papyrus craft image + category
UPDATE products
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjXOit-EzUSoz9MNIGJJghNtwK0wdDDzXKbUuzaSRKZA&s=10',
    category = 'papyrus'
WHERE id = 'c1000000-0000-4000-8000-000000000001';

UPDATE product_images
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjXOit-EzUSoz9MNIGJJghNtwK0wdDDzXKbUuzaSRKZA&s=10'
WHERE product_id = 'c1000000-0000-4000-8000-000000000001' AND sort_order = 0;

-- Sarah Akankunda — craft_specialty updated to papyrus
UPDATE artisans
SET craft_specialty = 'Papyrus craft'
WHERE id = 'a1000000-0000-4000-8000-000000000003';

COMMIT;
