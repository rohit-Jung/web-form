ALTER TABLE "forms" ADD COLUMN "theme" varchar(50) DEFAULT 'minimal' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "primary_color" varchar(20);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "accent_color" varchar(20);