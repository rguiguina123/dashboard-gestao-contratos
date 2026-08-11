CREATE TABLE `data_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_key` varchar(512),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`payload` longtext NOT NULL,
	`summary` longtext NOT NULL,
	`created_by` int NOT NULL,
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `data_imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `data_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payload` longtext NOT NULL,
	`is_current` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `data_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
