BEGIN;

-- Musanana Barkcloth (0c89b1a4...) — image updated per explicit instruction
UPDATE products
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiX__JQSX3ByoSOjt-Pe6ImMiJ6kh20cbKoF_9vrqCOA&s=10'
WHERE id = '0c89b1a4-b07c-4cbe-a05f-872c2c91b2c3';

UPDATE product_images
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiX__JQSX3ByoSOjt-Pe6ImMiJ6kh20cbKoF_9vrqCOA&s=10'
WHERE product_id = '0c89b1a4-b07c-4cbe-a05f-872c2c91b2c3' AND sort_order = 0;

-- ALOUZIOUS MUHEREZA — craft_specialty updated to Ebyanzi
UPDATE artisans
SET craft_specialty = 'Ebyanzi craft'
WHERE id = '57c5ecdb-6cd4-4b50-b516-a8558ab22fbe';

COMMIT;
