-- Replace broken / generic Unsplash URLs with verified African craft images

-- Artisan profile photos
UPDATE artisans SET photo_url = 'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q='
WHERE id = 'a1000000-0000-4000-8000-000000000001';

UPDATE artisans SET photo_url = 'https://images.unsplash.com/photo-1641582163466-e4d573078f98?w=800&auto=format&fit=crop&q=80'
WHERE id = 'a1000000-0000-4000-8000-000000000002';

UPDATE artisans SET photo_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVBF365i0OOd15XPtt7rQ76WeP3Gf3tiwW-BlyAj-kA&s'
WHERE id = 'a1000000-0000-4000-8000-000000000003';

-- Product cover images
UPDATE products SET image_url = 'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q='
WHERE id = 'b1000000-0000-4000-8000-000000000001';

UPDATE products SET image_url = 'https://theugandablog.com/media/blog/art--craft.jpeg'
WHERE id = 'b1000000-0000-4000-8000-000000000002';

UPDATE products SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ1IBIsb_AZWhRDK07xSj4YF8RFZQbYWxh_GRF8hYMFA&s=10'
WHERE id = 'b1000000-0000-4000-8000-000000000003';

UPDATE products SET
  name = 'Heritage Cloth Work',
  category = 'barkcloth',
  image_url = 'https://garlandmag.com/wp-content/uploads/2024/05/IMG_9891-2.jpg'
WHERE id = 'b1000000-0000-4000-8000-000000000004';

UPDATE products SET
  name = 'Heritage Geometric Bead Sash',
  category = 'beadwork',
  image_url = '/images/rukiga-heritage-beadwork.png'
WHERE id = 'b1000000-0000-4000-8000-000000000005';

-- Product gallery images
UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1630939516949-9e928211efa8?w=800&auto=format&fit=crop&q=80'
WHERE product_id = 'b1000000-0000-4000-8000-000000000001' AND sort_order = 1;

UPDATE product_images SET image_url = 'https://plus.unsplash.com/premium_photo-1765575812975-3e0190d674ae?w=800&auto=format&fit=crop&q=80'
WHERE product_id = 'b1000000-0000-4000-8000-000000000001' AND sort_order = 2;

UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1776841115715-0dd95378b89c?w=800&auto=format&fit=crop&q=80'
WHERE product_id = 'b1000000-0000-4000-8000-000000000004' AND sort_order = 1;

-- Catch any remaining old Unsplash seed URLs
UPDATE products SET image_url = 'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q='
WHERE image_url LIKE '%photo-1596464716127%' OR image_url LIKE '%photo-1610701596007%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1641582163466-e4d573078f98?w=800&auto=format&fit=crop&q=80'
WHERE image_url LIKE '%photo-1511379938547%';

UPDATE products SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVBF365i0OOd15XPtt7rQ76WeP3Gf3tiwW-BlyAj-kA&s'
WHERE image_url LIKE '%photo-1611591437281%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1776841115715-0dd95378b89c?w=800&auto=format&fit=crop&q=80'
WHERE image_url LIKE '%photo-1601121141461%';

UPDATE product_images SET image_url = 'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q='
WHERE image_url LIKE '%photo-1596464716127%' OR image_url LIKE '%photo-1610701596007%';

UPDATE artisans SET photo_url = 'https://media.istockphoto.com/id/172134865/photo/a-series-of-hand-woven-african-sea-grass-baskets.webp?a=1&b=1&s=612x612&w=0&k=20&c=AfG7uah7eIRGox9edVaSqHT6TXykgod14-zRZYcES3Q='
WHERE photo_url LIKE '%photo-1596464716127%' OR photo_url LIKE '%photo-1610701596007%';

UPDATE artisans SET photo_url = 'https://images.unsplash.com/photo-1641582163466-e4d573078f98?w=800&auto=format&fit=crop&q=80'
WHERE photo_url LIKE '%photo-1511379938547%';
