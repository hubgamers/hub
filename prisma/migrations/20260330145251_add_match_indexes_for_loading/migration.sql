-- CreateIndex
CREATE INDEX "matches_phase_id_scheduled_at_created_at_idx" ON "matches"("phase_id", "scheduled_at", "created_at");

-- CreateIndex
CREATE INDEX "matches_phase_id_status_scheduled_at_idx" ON "matches"("phase_id", "status", "scheduled_at");
