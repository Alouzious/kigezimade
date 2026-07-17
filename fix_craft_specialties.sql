
BEGIN;

-- Sarah Akankunda genuinely spans multiple crafts — single-value field

-- can't honestly describe barkcloth + beadwork + cowhide + papyrus,

-- so use a combined descriptor instead of picking one and hiding the rest.

UPDATE artisans

SET craft_specialty = 'Beadwork, barkcloth, cowhide & papyrus craft'

WHERE id = 'a1000000-0000-4000-8000-000000000003';

-- Nyirahabimana Grace (Kisoro, bccccbbe...) — her only product is a basket,

-- and her bio describes both mat and basket weaving traditions.

UPDATE artisans

SET craft_specialty = ' mat weaving'

WHERE id = 'bccccbbe-9311-4247-8610-515dacae42e5';

COMMIT;

