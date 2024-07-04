CREATE TABLE IF NOT EXISTS "mentor_manager_matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentorId" varchar(256),
	"studentId" integer NOT NULL,
	"totalMeetings" integer,
	"meetingsCompleted" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_manager_meetings" (
	"id" serial PRIMARY KEY NOT NULL,
	"matchId" integer NOT NULL,
	"estimatedTime" integer,
	"meetingNotes" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentor_manager_students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_manager_matches" ADD CONSTRAINT "mentor_manager_matches_studentId_mentor_manager_students_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."mentor_manager_students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mentor_manager_meetings" ADD CONSTRAINT "mentor_manager_meetings_matchId_mentor_manager_matches_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."mentor_manager_matches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mentorId_idx" ON "mentor_manager_matches" ("mentorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "studentId_idx" ON "mentor_manager_matches" ("studentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "matchId_idx" ON "mentor_manager_meetings" ("matchId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "mentor_manager_students" ("name");