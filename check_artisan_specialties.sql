SELECT a.id, a.name, a.district, a.craft_specialty,
       p.id AS product_id, p.name AS product_name, p.category
FROM artisans a
LEFT JOIN products p ON p.artisan_id = a.id
ORDER BY a.name, p.category;
