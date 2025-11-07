CREATE TABLE `jobs` (
	`job_id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`file_name` text NOT NULL,
	`user_email` text NOT NULL,
	`file_url` text,
	`status` text NOT NULL,
	`output` text DEFAULT '',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`finished_at` integer
);
