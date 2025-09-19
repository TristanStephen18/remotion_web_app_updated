ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text;