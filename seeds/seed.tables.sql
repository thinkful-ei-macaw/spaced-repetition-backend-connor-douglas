BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Latin', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'veneficus', 'warlock', 2),
  (2, 1, 'praeliator', 'warrior', 3),
  (3, 1, 'sacerdos', 'priest', 4),
  (4, 1, 'magus', 'mage', 5),
  (5, 1, 'perfide', 'rogue', 6),
  (6, 1, 'venandi', 'hunter', 7),
  (7, 1, 'monachus', 'monk', 8),
  (8, 1, 'druidae', 'druid', 9),
  (9, 1, 'flaminis', 'shaman', 10),
  (10, 1, 'paladinus', 'paladin', 11),
  (11, 1, 'mors miles', 'death knight', 12),
  (12, 1, 'daemonium venator', 'demon-hunter', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
