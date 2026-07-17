-- Merge 3 Bwezu coffee listings into 1 product with multiple photos.
-- Kept: f1000000-0000-4000-8000-000000000001 (Bwezu Highland Arabica Coffee)
-- Folded in as extra photos: Coffee Cherries (...002), Sun-Dried Beans (...003)
BEGIN;

UPDATE products
SET description = 'Hand-picked, sun-dried Arabica coffee grown on the terraced hills of Bwezu, Kabale. From ripe red cherries harvested by hand, to beans sun-dried on raised beds, to small-batch roasting — this is Kigezi highland coffee at every stage, grown by the Bwezu Coffee Growers Cooperative.'
WHERE id = 'f1000000-0000-4000-8000-000000000001';

UPDATE product_images
SET product_id = 'f1000000-0000-4000-8000-000000000001', sort_order = 1
WHERE product_id = 'f1000000-0000-4000-8000-000000000002';

UPDATE product_images
SET product_id = 'f1000000-0000-4000-8000-000000000001', sort_order = 2
WHERE product_id = 'f1000000-0000-4000-8000-000000000003';

DELETE FROM products WHERE id = 'f1000000-0000-4000-8000-000000000002';
DELETE FROM products WHERE id = 'f1000000-0000-4000-8000-000000000003';

COMMIT;
