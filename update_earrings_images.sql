BEGIN;

UPDATE products
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC-yXtwjH8kyjMhEfZOYCdBHAzGqLoK1aFPNOgKNbtMQ&s=10'
WHERE id = 'c1000000-0000-4000-8000-000000000002';

UPDATE product_images
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC-yXtwjH8kyjMhEfZOYCdBHAzGqLoK1aFPNOgKNbtMQ&s=10'
WHERE product_id = 'c1000000-0000-4000-8000-000000000002' AND sort_order = 0;

INSERT INTO product_images (product_id, image_url, sort_order)
VALUES ('c1000000-0000-4000-8000-000000000002', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB82yP1oqUaaD3l-fro12CEPmODYq0iBHj_VtEXc4yZw&s=10', 1)
ON CONFLICT DO NOTHING;

COMMIT;
