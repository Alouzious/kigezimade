INSERT INTO artisans (id, name, bio, district, craft_specialty, photo_url, workshop_video_url, map_embed_url, latitude, longitude)
VALUES
(
    'a1000000-0000-4000-8000-000000000001',
    'Grace Ninsiima',
    'Grace learned basket weaving from her grandmother in the hills above Lake Bunyonyi. For twenty years she has taught young women in Kabale how to turn local grasses into income — and pride.',
    'Kabale',
    'Basket weaving',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75!2d29.985!3d-1.248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTQnNTIuOCJTIDI5wrA1OScwNi4wIkU!5e0!3m2!1sen!2sug!4v1',
    -1.248,
    29.985
),
(
    'a1000000-0000-4000-8000-000000000002',
    'Emmanuel Byaruhanga',
    'A third-generation drum maker from Kisoro, Emmanuel carves ceremonial drums from mvule wood. His workshop sits at the foot of the Virunga volcanoes.',
    'Kisoro',
    'Drum making',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75!2d29.685!3d-1.285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMDYuMCJTIDI5wrA0MScwNi4wIkU!5e0!3m2!1sen!2sug!4v1',
    -1.285,
    29.685
),
(
    'a1000000-0000-4000-8000-000000000003',
    'Sarah Akankunda',
    'Sarah''s beadwork tells stories of Bakiga heritage — each color and pattern carries meaning passed down through generations of women in Rukiga.',
    'Rukiga',
    'Beadwork',
    'https://images.unsplash.com/photo-1610701596007-7610059003fe?w=800&q=80',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75!2d30.015!3d-1.015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMDAnNTQuMCJTIDMwcDAwJzU0LjAiRQ!5e0!3m2!1sen!2sug!4v1',
    -1.015,
    30.015
);

INSERT INTO products (id, artisan_id, name, description, price, category, image_url)
VALUES
(
    'b1000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    'Lake Bunyonyi Storage Basket',
    'Hand-woven from local papyrus and banana fibre. Used traditionally for storing grain and gifts at weddings.',
    45000.00,
    'baskets',
    'https://images.unsplash.com/photo-1610701596007-7610059003fe?w=800&q=80'
),
(
    'b1000000-0000-4000-8000-000000000002',
    'a1000000-0000-4000-8000-000000000001',
    'Wedding Gift Basket',
    'A ceremonial basket with intricate geometric patterns, gifted to brides in Bakiga tradition.',
    65000.00,
    'baskets',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80'
),
(
    'b1000000-0000-4000-8000-000000000003',
    'a1000000-0000-4000-8000-000000000002',
    'Virunga Ceremonial Drum',
    'Carved from mvule wood with cowhide head. Used in community celebrations and storytelling gatherings.',
    280000.00,
    'drums',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'
),
(
    'b1000000-0000-4000-8000-000000000004',
    'a1000000-0000-4000-8000-000000000003',
    'Heritage Bead Necklace',
    'Glass and clay beads arranged in traditional Bakiga patterns. Each necklace takes three days to complete.',
    35000.00,
    'beadwork',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
),
(
    'b1000000-0000-4000-8000-000000000005',
    'a1000000-0000-4000-8000-000000000003',
    'Ceremonial Bead Belt',
    'Worn during traditional dances and festivals. Red and orange beads symbolize vitality and community.',
    42000.00,
    'beadwork',
    'https://images.unsplash.com/photo-1601121141461-9d61f0208e9d?w=800&q=80'
);

INSERT INTO product_stories (product_id, story_text)
VALUES
(
    'b1000000-0000-4000-8000-000000000001',
    'On the misty shores of Lake Bunyonyi, Grace Ninsiima gathers papyrus reeds at dawn when the fibres are strongest. Each strand is split by hand, dried in the sun, and woven using techniques her grandmother taught her fifty years ago. In Bakiga culture, a storage basket is not merely a container — it holds the harvest that feeds a family through the rainy season, and gifting one at a wedding blesses the new couple with abundance. This basket carries that blessing in every coil.'
),
(
    'b1000000-0000-4000-8000-000000000004',
    'Sarah Akankunda sits in her Rukiga workshop surrounded by bowls of colored beads — red for courage, white for peace, black for the ancestors. She learned this craft from her mother, who learned from hers, in an unbroken line of women keeping Bakiga stories alive through ornament. Each necklace takes three full days: stringing, patterning, and finally blessing the finished piece before it leaves her hands.'
);

INSERT INTO translations (product_story_id, language_code, translated_text)
SELECT ps.id, 'fr',
    CASE ps.product_id::text
        WHEN 'b1000000-0000-4000-8000-000000000001' THEN
            'Sur les rives brumeuses du lac Bunyonyi, Grace Ninsiima récolte les roseaux de papyrus à l''aube, lorsque les fibres sont les plus solides. Chaque brin est fendu à la main, séché au soleil et tissé selon des techniques que sa grand-mère lui a enseignées il y a cinquante ans.'
        WHEN 'b1000000-0000-4000-8000-000000000004' THEN
            'Sarah Akankunda est assise dans son atelier de Rukiga, entourée de bols de perles colorées — rouge pour le courage, blanc pour la paix, noir pour les ancêtres. Elle a appris cet art de sa mère, qui l''a reçu de la sienne, dans une lignée ininterrompue de femmes qui maintiennent vivantes les histoires bakiga à travers l''ornement.'
        ELSE ''
    END
FROM product_stories ps
WHERE ps.product_id IN (
    'b1000000-0000-4000-8000-000000000001',
    'b1000000-0000-4000-8000-000000000004'
);
