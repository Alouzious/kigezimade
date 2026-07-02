CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT p.id, p.image_url, 0
FROM products p
WHERE p.image_url != ''
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id AND pi.sort_order = 0
  );

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT 'b1000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80', 1
WHERE NOT EXISTS (
    SELECT 1 FROM product_images WHERE product_id = 'b1000000-0000-4000-8000-000000000001' AND sort_order = 1
);

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT 'b1000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1610701596007-7610059003fe?w=800&q=80', 2
WHERE NOT EXISTS (
    SELECT 1 FROM product_images WHERE product_id = 'b1000000-0000-4000-8000-000000000001' AND sort_order = 2
);

INSERT INTO product_images (product_id, image_url, sort_order)
SELECT 'b1000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1601121141461-9d61f0208e9d?w=800&q=80', 1
WHERE NOT EXISTS (
    SELECT 1 FROM product_images WHERE product_id = 'b1000000-0000-4000-8000-000000000004' AND sort_order = 1
);
