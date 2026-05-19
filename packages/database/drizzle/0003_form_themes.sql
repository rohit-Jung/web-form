ALTER TABLE "forms" ADD COLUMN "theme" varchar(50) DEFAULT 'minimal' NOT NULL;
ALTER TABLE "forms" ADD COLUMN "primary_color" varchar(20);
ALTER TABLE "forms" ADD COLUMN "accent_color" varchar(20);
