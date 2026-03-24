CREATE TABLE "focus_room_tag" (
	"slug" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
UPDATE "focus_room_video" SET "tag" = CASE "tag"
	WHEN 'Lofi' THEN 'lofi'
	WHEN 'lofi' THEN 'lofi'
	WHEN 'Christmas' THEN 'christmas'
	WHEN 'christmas' THEN 'christmas'
	WHEN 'City' THEN 'city'
	WHEN 'city' THEN 'city'
	WHEN 'Cafe' THEN 'cafe'
	WHEN 'cafe' THEN 'cafe'
	WHEN 'Library' THEN 'library'
	WHEN 'library' THEN 'library'
	ELSE COALESCE(
		NULLIF(
			trim(both '-' from regexp_replace(
				regexp_replace(
					regexp_replace(lower(trim(both from "tag")), '\s+', '-', 'g'),
					'[^a-z0-9-]',
					'',
					'g'
				),
				'-+',
				'-',
				'g'
			)),
			''
		),
		'lofi'
	)
END;
--> statement-breakpoint
INSERT INTO "focus_room_tag" ("slug", "label", "sort_order", "created_at", "updated_at") VALUES
	('lofi', 'Lofi', 0, now(), now()),
	('christmas', 'Christmas', 1, now(), now()),
	('city', 'City', 2, now(), now()),
	('cafe', 'Cafe', 3, now(), now()),
	('library', 'Library', 4, now(), now());
--> statement-breakpoint
INSERT INTO "focus_room_tag" ("slug", "label", "sort_order", "created_at", "updated_at")
SELECT DISTINCT v."tag",
	initcap(replace(v."tag", '-', ' ')),
	100,
	now(),
	now()
FROM "focus_room_video" v
WHERE NOT EXISTS (
	SELECT 1 FROM "focus_room_tag" t WHERE t."slug" = v."tag"
);
--> statement-breakpoint
ALTER TABLE "focus_room_video" ALTER COLUMN "tag" SET DEFAULT 'lofi';--> statement-breakpoint
ALTER TABLE "focus_room_video" ADD CONSTRAINT "focus_room_video_tag_focus_room_tag_slug_fk" FOREIGN KEY ("tag") REFERENCES "public"."focus_room_tag"("slug") ON DELETE no action ON UPDATE no action;
