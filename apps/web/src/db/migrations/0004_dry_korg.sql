CREATE TABLE "focus_room_video" (
	"id" text PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"video_title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
