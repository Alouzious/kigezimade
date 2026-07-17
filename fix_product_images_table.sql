-- ROOT CAUSE: frontend (session.js) renders from product_images (ordered by
-- sort_order), only falling back to products.image_url when that table is
-- empty for the product. Every earlier fix only touched products.image_url,
-- which is why nothing changed on screen. This patches product_images too,
-- and keeps products.image_url in sync as the fallback/source of truth.
BEGIN;

-- Musanana Barkcloth (0c89b1a4-...) — all 3 rows point to dead /images/bark*.jpg
UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Olubugo.jpg'
WHERE product_id = '0c89b1a4-b07c-4cbe-a05f-872c2c91b2c3' AND sort_order = 0;

DELETE FROM product_images
WHERE product_id = '0c89b1a4-b07c-4cbe-a05f-872c2c91b2c3' AND sort_order IN (1, 2);

-- Highlands Cowhide Cosmetic Pouch (c1000000...001) — both rows dead /images/ paths
UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Leather trinket craftsman (Unsplash).jpg'
WHERE product_id = 'c1000000-0000-4000-8000-000000000001' AND sort_order = 0;

DELETE FROM product_images
WHERE product_id = 'c1000000-0000-4000-8000-000000000001' AND sort_order = 1;

-- Cowhide Teardrop Earrings (c1000000...002) — dead /images/ path
UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Handmade earrings by crystaldust designs.jpg'
WHERE product_id = 'c1000000-0000-4000-8000-000000000002' AND sort_order = 0;

-- Ankole Milk Gourd (d1000000...001) — points to an unrelated unsplash photo
UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Traditional Kipsigis gourd hanged on a wall..jpg'
WHERE product_id = 'd1000000-0000-4000-8000-000000000001' AND sort_order = 0;

-- Heritage Geometric Bead Sash (b1000000...005) — dead /images/ path on both columns
UPDATE product_images
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Detail, Ethiopian Beadwork (2132389684).jpg'
WHERE product_id = 'b1000000-0000-4000-8000-000000000005' AND sort_order = 0;

UPDATE products
SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Detail, Ethiopian Beadwork (2132389684).jpg'
WHERE id = 'b1000000-0000-4000-8000-000000000005';

-- Wedding Gift Basket (b1000000...002) — sort_order 0 is the dead theugandablog link;
-- sort_order 1 (istock) already works, promote it and drop the dead one.
UPDATE product_images
SET image_url = 'https://njabala.com/storage/images/c44dYbU25hH8u72mK9XK6NLAcC4f6x7bdpX2a9Yj.jpg', sort_order = 0
WHERE product_id = 'b1000000-0000-4000-8000-000000000002' AND sort_order = 0;

UPDATE products
SET image_url = 'https://njabala.com/storage/images/c44dYbU25hH8u72mK9XK6NLAcC4f6x7bdpX2a9Yj.jpg'
WHERE id = 'b1000000-0000-4000-8000-000000000002';

COMMIT;
