BEGIN;

UPDATE artisans
SET craft_specialty = 'Bead making'
WHERE id = 'a1000000-0000-4000-8000-000000000003'; -- Sarah Akankunda

COMMIT;
