-- Create tournament action logs for lightweight audit history
CREATE TABLE "public"."tournament_action_logs" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "actor_id" TEXT,
    "actor_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_action_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tournament_action_logs_tournament_id_created_at_idx"
ON "public"."tournament_action_logs"("tournament_id", "created_at");

ALTER TABLE "public"."tournament_action_logs"
ADD CONSTRAINT "tournament_action_logs_tournament_id_fkey"
FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
