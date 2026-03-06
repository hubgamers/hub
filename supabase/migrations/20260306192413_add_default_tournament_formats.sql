-- Insert default tournament formats
INSERT INTO tournament_formats (id, name, description, min_participants, icon, is_active, default_settings) VALUES
('SINGLE_ELIM', 'Élimination Simple', 'Tournoi à élimination directe où chaque défaite élimine une équipe', 2, '🏆', true, '{
  "points_per_win": 1,
  "points_per_draw": 0,
  "has_loser_bracket": false,
  "nb_qualified_per_group": null,
  "seed_type": "random",
  "match_format": "BO1",
  "allow_self_report": false
}'::jsonb),
('DOUBLE_ELIM', 'Double Élimination', 'Tournoi avec bracket gagnant et perdant, nécessite deux défaites pour être éliminé', 4, '🌳', true, '{
  "points_per_win": 1,
  "points_per_draw": 0,
  "has_loser_bracket": true,
  "nb_qualified_per_group": null,
  "seed_type": "skill_based",
  "match_format": "BO3",
  "allow_self_report": false
}'::jsonb),
('SWISS', 'Suisse', 'Système suisse où les équipes affrontent des adversaires de niveau similaire', 4, '🔷', true, '{
  "points_per_win": 3,
  "points_per_draw": 1,
  "has_loser_bracket": false,
  "nb_qualified_per_group": null,
  "seed_type": "skill_based",
  "match_format": "BO1",
  "allow_self_report": true
}'::jsonb),
('POULES', 'Poules + Élimination', 'Phase de poules suivie d''une phase éliminatoire', 8, '🏆', true, '{
  "points_per_win": 3,
  "points_per_draw": 1,
  "has_loser_bracket": false,
  "nb_qualified_per_group": 2,
  "seed_type": "random",
  "match_format": "BO1",
  "allow_self_report": true
}'::jsonb),
('FFA', 'Free For All', 'Tous contre tous, classement par points ou position', 3, '⚔️', true, '{
  "points_per_win": 3,
  "points_per_draw": 1,
  "has_loser_bracket": false,
  "nb_qualified_per_group": null,
  "seed_type": "random",
  "match_format": "BO1",
  "allow_self_report": true
}'::jsonb);