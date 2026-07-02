ALTER TABLE artisans ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_artisans_email_unique
ON artisans (LOWER(email))
WHERE email IS NOT NULL AND email != '';
