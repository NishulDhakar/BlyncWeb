CREATE TABLE "user_streak" (
	"userId" text PRIMARY KEY NOT NULL,
	"currentStreak" integer DEFAULT 1 NOT NULL,
	"longestStreak" integer DEFAULT 1 NOT NULL,
	"lastActivityDate" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_streak" ADD CONSTRAINT "user_streak_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;