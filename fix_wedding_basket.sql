BEGIN;

-- Wedding Gift Basket (b1000000...002) — was duplicating photos from
-- Handwoven Banana Fiber Basket (sort_order 0) and Lake Bunyonyi Storage
-- Basket (sort_order 1). Replace both with its own real photo.
UPDATE products
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Rwandan_basket_weaving.jpg'
WHERE id = 'b1000000-0000-4000-8000-000000000002';

UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Rwandan_basket_weaving.jpg'
WHERE product_id = 'b1000000-0000-4000-8000-000000000002' AND sort_order = 0;

DELETE FROM product_images
WHERE product_id = 'b1000000-0000-4000-8000-000000000002' AND sort_order = 1;

COMMIT;
