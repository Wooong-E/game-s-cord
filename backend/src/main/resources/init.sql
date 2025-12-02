-- ============================================
-- Gamescord Dummy Data SQL (FIXED Version)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE matches;
TRUNCATE TABLE marks;
TRUNCATE TABLE coin;
TRUNCATE TABLE profiles;
TRUNCATE TABLE gamemates;
TRUNCATE TABLE games;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. GAMES
-- ============================================
INSERT INTO games (games_id, games_name) VALUES
                                             (1, 'League of Legends'),
                                             (2, 'Valorant'),
                                             (3, 'Overwatch 2'),
                                             (4, 'PUBG'),
                                             (5, 'MapleStory'),
                                             (6, 'Lost Ark'),
                                             (7, 'FIFA Online 4'),
                                             (8, 'StarCraft 2'),
                                             (9, 'Diablo 4'),
                                             (10, 'Genshin Impact');

-- ============================================
-- 2. USERS (users_name max 10 chars)
-- Password: password123
-- ============================================
INSERT INTO users (users_id, login_id, login_pwd, email, point, users_name, users_description, users_birthday, gender, profile_image_url, login_fail_count, lockout_until, enabled) VALUES
                                                                                                                                                                                        (1, 'gamer001', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'gamer001@test.com', 50000, 'ProGamer', 'LoL Diamond player. I teach kindly!', '1995-03-15', 'Male', 'https://example.com/profile1.jpg', 0, NULL, 1),
                                                                                                                                                                                        (2, 'valoking', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'valoking@test.com', 30000, 'ValoKing', 'Valorant Radiant player. Aim coaching specialist!', '1998-07-22', 'Male', 'https://example.com/profile2.jpg', 0, NULL, 1),
                                                                                                                                                                                        (3, 'overgirl', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'overgirl@test.com', 20000, 'OverGirl', 'Overwatch Grandmaster. Healer main here!', '2000-01-10', 'Female', 'https://example.com/profile3.jpg', 0, NULL, 1),
                                                                                                                                                                                        (4, 'pubgmaster', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'pubgmaster@test.com', 45000, 'PubgMaster', 'PUBG Ranked Top 1% player here.', '1997-11-05', 'Male', 'https://example.com/profile4.jpg', 0, NULL, 1),
                                                                                                                                                                                        (5, 'maplestar', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'maplestar@test.com', 100000, 'MapleStar', '10 year MapleStory veteran. Boss raid together!', '1992-05-20', 'Female', 'https://example.com/profile5.jpg', 0, NULL, 1),
                                                                                                                                                                                        (6, 'lostark77', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'lostark77@test.com', 80000, 'LoaExpert', 'Lost Ark 1620 Supporter. Raid support specialist!', '1996-09-12', 'Male', 'https://example.com/profile6.jpg', 0, NULL, 1),
                                                                                                                                                                                        (7, 'fifapro', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'fifapro@test.com', 25000, 'FifaPro', 'FIFA Champions rank player here.', '1999-02-28', 'Male', 'https://example.com/profile7.jpg', 0, NULL, 1),
                                                                                                                                                                                        (8, 'starking', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'starking@test.com', 15000, 'StarKing', 'StarCraft Grandmaster. Terran main!', '1990-12-01', 'Male', 'https://example.com/profile8.jpg', 0, NULL, 1),
                                                                                                                                                                                        (9, 'diablogirl', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'diablogirl@test.com', 35000, 'DiabloGirl', 'Diablo 4 Hardcore specialist here!', '1994-08-18', 'Female', 'https://example.com/profile9.jpg', 0, NULL, 1),
                                                                                                                                                                                        (10, 'genshinlove', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'genshinlove@test.com', 60000, 'GenshinPro', 'Genshin Impact all clear. Spiral Abyss together!', '2001-04-25', 'Female', 'https://example.com/profile10.jpg', 0, NULL, 1),
                                                                                                                                                                                        (11, 'normaluser1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'normal1@test.com', 10000, 'TestUser1', 'Looking for gaming friends to play!', '1998-06-14', 'Male', NULL, 0, NULL, 1),
                                                                                                                                                                                        (12, 'normaluser2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'normal2@test.com', 5000, 'TestUser2', 'Game beginner here. Please help me!', '2002-10-30', 'Female', NULL, 0, NULL, 1);

-- ============================================
-- 3. GAMEMATES
-- ============================================
INSERT INTO gamemates (gamemates_id, users_id, games_id, price, tier) VALUES
                                                                          (1, 1, 1, 5000, 'Diamond'),
                                                                          (2, 2, 1, 8000, 'Master'),
                                                                          (3, 2, 2, 10000, 'Radiant'),
                                                                          (4, 4, 2, 6000, 'Immortal'),
                                                                          (5, 3, 3, 4000, 'Grandmaster'),
                                                                          (6, 1, 3, 3000, 'Master'),
                                                                          (7, 4, 4, 7000, 'Top 1%'),
                                                                          (8, 5, 5, 3000, 'Lv.280'),
                                                                          (9, 6, 6, 8000, '1620'),
                                                                          (10, 5, 6, 6000, '1600'),
                                                                          (11, 7, 7, 5000, 'Champions'),
                                                                          (12, 8, 8, 4000, 'Grandmaster'),
                                                                          (13, 9, 9, 6000, 'Torment 16'),
                                                                          (14, 10, 10, 4000, 'AR60'),
                                                                          (15, 3, 10, 3500, 'AR58');

-- ============================================
-- 4. PROFILES
-- ============================================
INSERT INTO profiles (profiles_id, images_url, gamemates_id) VALUES
                                                                 (1, 'https://example.com/gamemate/lol_diamond1.jpg', 1),
                                                                 (2, 'https://example.com/gamemate/lol_diamond2.jpg', 1),
                                                                 (3, 'https://example.com/gamemate/lol_master1.jpg', 2),
                                                                 (4, 'https://example.com/gamemate/valorant_radiant1.jpg', 3),
                                                                 (5, 'https://example.com/gamemate/valorant_radiant2.jpg', 3),
                                                                 (6, 'https://example.com/gamemate/valorant_immortal1.jpg', 4),
                                                                 (7, 'https://example.com/gamemate/overwatch_gm1.jpg', 5),
                                                                 (8, 'https://example.com/gamemate/overwatch_master1.jpg', 6),
                                                                 (9, 'https://example.com/gamemate/pubg_top1.jpg', 7),
                                                                 (10, 'https://example.com/gamemate/maple_280.jpg', 8),
                                                                 (11, 'https://example.com/gamemate/lostark_1620.jpg', 9),
                                                                 (12, 'https://example.com/gamemate/lostark_1600.jpg', 10),
                                                                 (13, 'https://example.com/gamemate/fifa_champ.jpg', 11),
                                                                 (14, 'https://example.com/gamemate/starcraft_gm.jpg', 12),
                                                                 (15, 'https://example.com/gamemate/diablo_t16.jpg', 13),
                                                                 (16, 'https://example.com/gamemate/genshin_ar60.jpg', 14),
                                                                 (17, 'https://example.com/gamemate/genshin_ar58.jpg', 15);

-- ============================================
-- 5. MATCHES
-- ============================================
INSERT INTO matches (orders_id, users_id, ordered_users_id, order_users_id, orders_game_id, order_status) VALUES
                                                                                                              (1, 11, 1, 11, 1, 'PENDING'),
                                                                                                              (2, 12, 2, 12, 2, 'ACCEPTED'),
                                                                                                              (3, 11, 3, 11, 3, 'ACCEPTED'),
                                                                                                              (4, 12, 5, 12, 5, 'PENDING'),
                                                                                                              (5, 11, 6, 11, 6, 'ACCEPTED'),
                                                                                                              (6, 12, 10, 12, 10, 'PENDING');

-- ============================================
-- 6. REVIEWS
-- ============================================
INSERT INTO reviews (reviews_id, gamemates_id, users_id, score, reviews_description, created_at) VALUES
                                                                                                     (1, 1, 11, 5, 'Very kind teacher! I went from Gold to Platinum thanks to him.', NOW() - INTERVAL 10 DAY),
                                                                                                     (2, 1, 12, 4, 'Great skills and explains well. Want to play again!', NOW() - INTERVAL 5 DAY),
                                                                                                     (3, 3, 11, 5, 'Best aim coaching! My headshot rate improved a lot.', NOW() - INTERVAL 8 DAY),
                                                                                                     (4, 3, 12, 5, 'Radiant skills are different. Highly recommend!', NOW() - INTERVAL 3 DAY),
                                                                                                     (5, 5, 11, 4, 'Really good healer play. Game became easier.', NOW() - INTERVAL 7 DAY),
                                                                                                     (6, 9, 12, 5, 'Perfect raid support. Easy clear!', NOW() - INTERVAL 2 DAY),
                                                                                                     (7, 9, 11, 5, '1620 supporter skills are amazing. Want to play again.', NOW() - INTERVAL 1 DAY),
                                                                                                     (8, 14, 12, 4, 'Spiral Abyss together was so fun!', NOW() - INTERVAL 4 DAY);

-- ============================================
-- 7. MARKS
-- ============================================
INSERT INTO marks (marks_id, users_id, marked_users_id) VALUES
                                                            (1, 11, 1),
                                                            (2, 11, 2),
                                                            (3, 11, 6),
                                                            (4, 12, 3),
                                                            (5, 12, 5),
                                                            (6, 12, 10);

-- ============================================
-- 8. COIN
-- ============================================
INSERT INTO coin (coin_id, users_id, coin_amount, payment_amount, payment_method, created_at) VALUES
                                                                                                  (1, 11, 10000, 10000, 'CHARGE', NOW() - INTERVAL 30 DAY),
                                                                                                  (2, 11, 5000, 5000, 'CHARGE', NOW() - INTERVAL 15 DAY),
                                                                                                  (3, 12, 20000, 20000, 'CHARGE', NOW() - INTERVAL 25 DAY),
                                                                                                  (4, 1, 5000, 0, 'GAMEMATE_PAYOUT', NOW() - INTERVAL 10 DAY),
                                                                                                  (5, 2, 10000, 0, 'GAMEMATE_PAYOUT', NOW() - INTERVAL 5 DAY),
                                                                                                  (6, 3, 4000, 0, 'GAMEMATE_PAYOUT', NOW() - INTERVAL 7 DAY),
                                                                                                  (7, 6, 8000, 0, 'GAMEMATE_PAYOUT', NOW() - INTERVAL 2 DAY);

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================
INSERT INTO notifications (notification_id, users_id, notification_type, match_id, message, is_read, created_at) VALUES
                                                                                                                     (1, 1, 'MATCH_REQUEST', 1, 'TestUser1 requested LoL gamemate.', 0, NOW() - INTERVAL 1 HOUR),
                                                                                                                     (2, 5, 'MATCH_REQUEST', 4, 'TestUser2 requested MapleStory gamemate.', 0, NOW() - INTERVAL 30 MINUTE),
                                                                                                                     (3, 10, 'MATCH_REQUEST', 6, 'TestUser2 requested Genshin Impact gamemate.', 1, NOW() - INTERVAL 2 HOUR),
                                                                                                                     (4, 12, 'MATCH_ACCEPTED', 2, 'ValoKing accepted your match request!', 1, NOW() - INTERVAL 1 DAY),
                                                                                                                     (5, 11, 'MATCH_ACCEPTED', 3, 'OverGirl accepted your match request!', 1, NOW() - INTERVAL 2 DAY),
                                                                                                                     (6, 11, 'MATCH_ACCEPTED', 5, 'LoaExpert accepted your match request!', 0, NOW() - INTERVAL 12 HOUR);

-- ============================================
-- Test Account Info:
-- Login: gamer001~genshinlove, normaluser1, normaluser2
-- Password: password123
-- ============================================
