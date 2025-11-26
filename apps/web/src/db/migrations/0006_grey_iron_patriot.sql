CREATE TABLE "canvas_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"canvas_id" integer NOT NULL,
	"course_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"due_at" timestamp,
	"unlock_at" timestamp,
	"lock_at" timestamp,
	"points_possible" integer,
	"submission_types" text,
	"submitted" boolean DEFAULT false,
	"graded" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canvas_course" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"canvas_id" integer NOT NULL,
	"name" text NOT NULL,
	"course_code" text,
	"start_at" timestamp,
	"end_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "canvas_url" text DEFAULT 'https://canvas.instructure.com' NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "canvas_assignment_id" text;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "canvas_course_id" text;--> statement-breakpoint
ALTER TABLE "canvas_assignment" ADD CONSTRAINT "canvas_assignment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_assignment" ADD CONSTRAINT "canvas_assignment_course_id_canvas_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."canvas_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canvas_course" ADD CONSTRAINT "canvas_course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;