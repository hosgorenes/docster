-- Add file_type column with default value for existing records
ALTER TABLE `jobs` ADD `file_type` text;
UPDATE `jobs` SET `file_type` = 'application/pdf' WHERE `file_type` IS NULL;
-- Note: SQLite doesn't support adding NOT NULL constraint via ALTER TABLE
-- The constraint is enforced at the application level via Drizzle schema