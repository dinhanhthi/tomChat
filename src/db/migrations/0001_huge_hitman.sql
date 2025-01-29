ALTER TABLE "chats" ALTER COLUMN "pinned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "archived" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "created_at" SET NOT NULL;