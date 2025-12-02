-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS softwareassignmentdb;
USE softwareassignmentdb;

-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    users_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(255) NOT NULL UNIQUE,
    login_pwd VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    point BIGINT NOT NULL,
    users_name VARCHAR(10) NOT NULL,
    users_description VARCHAR(255),
    users_birthday DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    profile_image_url VARCHAR(500),
    login_fail_count INT NOT NULL DEFAULT 0,
    lockout_until DATETIME NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME
);

-- Games 테이블 생성
CREATE TABLE IF NOT EXISTS games (
    games_id BIGINT PRIMARY KEY,
    games_name VARCHAR(255) NOT NULL
);

-- Gamemates 테이블 생성
CREATE TABLE IF NOT EXISTS gamemates (
    gamemates_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    users_id BIGINT NOT NULL,
    games_id BIGINT NOT NULL,
    price BIGINT NOT NULL,
    tier VARCHAR(45) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(users_id),
    FOREIGN KEY (games_id) REFERENCES games(games_id)
);

-- Reviews 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
    reviews_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gamemates_id BIGINT NOT NULL,
    users_id BIGINT NOT NULL,
    score INT NOT NULL,
    reviews_description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gamemates_id) REFERENCES gamemates(gamemates_id),
    FOREIGN KEY (users_id) REFERENCES users(users_id)
);

-- Coin 테이블 생성
CREATE TABLE IF NOT EXISTS coin (
    coin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    users_id BIGINT NOT NULL,
    coin_amount INT NOT NULL,
    payment_amount INT NOT NULL,
    payment_method VARCHAR(45) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users(users_id)
);

-- files 테이블 생성
CREATE TABLE IF NOT EXISTS files (
    files_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    files_url VARCHAR(255) NOT NULL,
    users_id BIGINT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(users_id)
);

-- refresh_tokens 테이블 생성
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(users_id)
);

-- marks 테이블 생성
CREATE TABLE IF NOT EXISTS marks (
  marks_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  users_id BIGINT NOT NULL,
  marked_users_id BIGINT NOT NULL,
  FOREIGN KEY (users_id) REFERENCES users(users_id),
  FOREIGN KEY (marked_users_id) REFERENCES users(users_id)
);

-- matches 테이블 생성
CREATE TABLE IF NOT EXISTS matches (
  orders_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  users_id BIGINT NOT NULL,
  ordered_users_id BIGINT NOT NULL,
  order_users_id BIGINT NOT NULL,
  orders_game_id BIGINT NOT NULL,
  order_status VARCHAR(255),

  FOREIGN KEY (users_id) REFERENCES users(users_id),
  FOREIGN KEY (ordered_users_id) REFERENCES users(users_id),
  FOREIGN KEY (order_users_id) REFERENCES users(users_id),
  FOREIGN KEY (orders_game_id) REFERENCES games(games_id)
);

-- notifications 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
  notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  users_id BIGINT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  match_id BIGINT,
  message VARCHAR(500),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(users_id),
  FOREIGN KEY (match_id) REFERENCES matches(orders_id)
);


-- Users dummy data (20 users)
-- Passwords are just plain text for dummy data. In a real application, they should be hashed.
INSERT INTO users (login_id, login_pwd, email, point, users_name, users_description, users_birthday, gender, profile_image_url, login_fail_count) VALUES
('user1', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user1@test.com', 10000, '김철수', '안녕하세요! 게임을 좋아하는 김철수입니다.', '1995-01-10', '남', 'http://example.com/profile1.jpg', 0),
('user2', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user2@test.com', 15000, '이영희', '함께 즐겁게 게임해요!', '1998-03-22', '여', 'http://example.com/profile2.jpg', 0),
('user3', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user3@test.com', 20000, '박민준', '주로 FPS 게임을 즐깁니다.', '1992-07-15', '남', 'http://example.com/profile3.jpg', 0),
('user4', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user4@test.com', 5000, '최지우', '초보지만 열심히 할게요!', '2000-11-30', '여', 'http://example.com/profile4.jpg', 0),
('user5', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user5@test.com', 30000, '정승호', '다양한 게임을 경험해보고 싶습니다.', '1996-05-25', '남', 'http://example.com/profile5.jpg', 0),
('user6', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user6@test.com', 12000, '윤서연', 'RPG 게임 전문가입니다.', '1994-09-08', '여', 'http://example.com/profile6.jpg', 0),
('user7', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user7@test.com', 8000, '한지훈', '전략 게임을 좋아합니다.', '1999-02-18', '남', 'http://example.com/profile7.jpg', 0),
('user8', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user8@test.com', 25000, '송예진', '즐겜 유저입니다. :)', '1997-12-01', '여', 'http://example.com/profile8.jpg', 0),
('user9', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user9@test.com', 18000, '강현우', '새로운 친구를 사귀고 싶어요.', '1993-06-12', '남', 'http://example.com/profile9.jpg', 0),
('user10', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user10@test.com', 40000, '임나영', '게임은 즐거워야죠!', '2001-08-05', '여', 'http://example.com/profile10.jpg', 0),
('user11', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user11@test.com', 9000,  '조성민', '서포터 전문', '1995-02-14', '남', 'http://example.com/profile11.jpg', 0),
('user12', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user12@test.com', 16000, '김다은', '마이크 좋음', '1997-09-18', '여', 'http://example.com/profile12.jpg', 0),
('user13', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user13@test.com', 12000, '이준하', '탱커 전문', '1991-04-11', '남', 'http://example.com/profile13.jpg', 0),
('user14', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user14@test.com', 22000, '서하린', '소통 좋아함', '1998-10-01', '여', 'http://example.com/profile14.jpg', 0),
('user15', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user15@test.com', 31000, '홍지훈', '게임 애호가', '1995-06-19', '남', 'http://example.com/profile15.jpg', 0),
('user16', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user16@test.com', 17500, '차윤진', '밝은 성격', '1996-11-04', '여', 'http://example.com/profile16.jpg', 0),
('user17', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user17@test.com', 23000, '백도현', '빠른 손', '1994-12-12', '남', 'http://example.com/profile17.jpg', 0),
('user18', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user18@test.com', 26000, '정하윤', '게임 사랑', '1993-10-27', '여', 'http://example.com/profile18.jpg', 0),
('user19', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user19@test.com', 14500, '최유준', '적극적 플레이', '1999-03-03', '남', 'http://example.com/profile19.jpg', 0),
('user20', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 'user20@test.com', 33000, '윤가은', '차분한 유저', '2002-04-21', '여', 'http://example.com/profile20.jpg', 0);

-- Games dummy data (3 games)
INSERT INTO games (games_id, games_name) VALUES
(1, '리그 오브 레전드'),
(2, '배틀그라운드'),
(3, '오버워치');

-- Gamemates dummy data (20 gamemates)
-- users_id from 1 to 20 will be gamemates
INSERT INTO gamemates (users_id, games_id, price, tier) VALUES
(1, 1, 2000, 'S'), -- 김철수, 리그 오브 레전드
(2, 2, 3000, 'A'), -- 이영희, 배틀그라운드
(3, 3, 2500, 'B'), -- 박민준, 오버워치
(4, 1, 1500, 'C'), -- 최지우, 리그 오브 레전드
(5, 2, 4000, 'S'), -- 정승호, 배틀그라운드
(6, 1, 5000, 'F'), -- 윤서연, 리그 오브 레전드
(7, 3, 4500, 'S'), -- 한지훈, 오버워치
(8, 1, 3500, 'S'), -- 송예진, 리그 오브 레전드
(9, 1, 2800, 'C'), -- 강현우, 리그 오브 레전드
(10, 3, 2600, 'B'), -- 임나영, 오버워치
(11, 2, 4200, 'S'), -- 조성민, 배틀그라운드
(12, 3, 3000, 'A'), -- 김다은, 오버워치
(13, 1, 3700, 'A'), -- 이준하, 리그 오브 레전드
(14, 2, 3400, 'B'), -- 서하린, 배틀그라운드
(15, 3, 3900, 'S'), -- 홍지훈, 오버워치
(16, 1, 2400, 'B'), -- 차윤진, 리그 오브 레전드
(17, 2, 3600, 'A'), -- 백도현, 배틀그라운드
(18, 3, 4100, 'S'), -- 정하윤, 오버워치
(19, 3, 2800, 'B'), -- 최유준, 오버워치
(20, 2, 3200, 'A'); -- 윤가은, 배틀그라운드

-- Reviews dummy data
-- gamemates_id will be 1 to 20 from the above inserts
-- users_id 1 to 20 will be reviewers
INSERT INTO reviews (gamemates_id, users_id, score, reviews_description, created_at) VALUES
-- LOL (game_id = 1)
-- gamemates_id 1 (user1)
(1, 6, 5, '정말 친절하고 실력도 좋으세요! 다음에 또 같이 하고 싶어요.', NOW()),
(1, 7, 4, '설명도 잘해주시고 매너 좋았습니다.', NOW()),
(1, 8, 5, '항상 친절하고 캐리력 좋습니다!', NOW()),
(1, 9, 4, '팀워크 최고였습니다.', NOW()),

-- gamemates_id 4 (user4)
(4, 3, 4, '즐겁게 게임했습니다.', NOW()),
(4, 8, 3, '소통은 괜찮았지만 약간 아쉬웠습니다.', NOW()),
(4, 10, 5, '성실하게 잘 해주셨습니다.', NOW()),

-- gamemates_id 6 (user6)
(6, 7, 4, '전체적으로 안정적인 플레이.', NOW()),
(6, 9, 5, '정말 멋진 캐리였습니다.', NOW()),
(6, 10, 4, '실력이 좋아요!', NOW()),

-- gamemates_id 8 (user8)
(8, 6, 4, '소통이 잘 됩니다.', NOW()),
(8, 7, 5, '완전 캐리해주셨어요!', NOW()),
(8, 9, 5, '게임이 매우 수월했습니다.', NOW()),

-- gamemates_id 9 (user9)
(9, 6, 5, '완벽한 캐리였습니다.', NOW()),
(9, 7, 4, '매너가 좋습니다.', NOW()),
(9, 8, 4, '게임 템포를 잘 끌어가요.', NOW()),

-- gamemates_id 13 (user13)
(13, 6, 5, '라인전이 매우 강했습니다.', NOW()),
(13, 8, 4, '전체적으로 템포가 좋았어요.', NOW()),
(13, 10, 5, '정말 편안하게 게임했습니다.', NOW()),

-- gamemates_id 16 (user16)
(16, 6, 4, '원딜 보호가 좋았습니다.', NOW()),
(16, 8, 5, '게임을 잘 풀어나가네요.', NOW()),
(16, 12, 4, '무난하게 게임했습니다.', NOW()),

-- 배틀그라운드 (game_id = 2)
-- gamemates_id 2 (user2)
(2, 6, 5, '치킨 먹고 갑니다.', NOW()),
(2, 7, 4, '재밌게 게임했어요!', NOW()),
(2, 8, 5, '최고의 파트너!', NOW()),
(2, 9, 5, '전술적으로 훌륭했습니다.', NOW()),

-- gamemates_id 5 (user5)
(5, 7, 5, '프로급 실력입니다!', NOW()),
(5, 8, 5, '실력도 좋고 매너도 최고!', NOW()),
(5, 9, 4, '전략적으로 잘 이끌어줌.', NOW()),
(5, 10, 5, '최고의 팀원입니다.', NOW()),

-- gamemates_id 11 (user11)
(11, 6, 4, '생각보다 잘하시네요.', NOW()),
(11, 4, 4, '전체적으로 괜찮았어요.', NOW()),
(11, 10, 3, '무난했습니다.', NOW()),

-- gamemates_id 14 (user14)
(14, 6, 5, '정확한 판단력으로 캐리!', NOW()),
(14, 7, 5, '정말 즐겁게 플레이했습니다.', NOW()),
(14, 12, 4, '안정적인 플레이.', NOW()),
(14, 15, 4, '좋은 팀워크 보여주심.', NOW()),

-- gamemates_id 17 (user17)
(17, 7, 5, '치킨 먹었습니다! 최고!', NOW()),
(17, 8, 4, '안정적인 판단력.', NOW()),
(17, 12, 5, '매우 만족스러운 경기.', NOW()),
(17, 18, 4, '팀워크가 잘 맞았습니다.', NOW()),

-- gamemates_id 20 (user20)
(20, 6, 5, '좋은 정보 공유 감사합니다.', NOW()),
(20, 7, 5, '전술 센스 최고.', NOW()),
(20, 12, 4, '밸런스 좋은 플레이.', NOW()),

-- 오버워치 (game_id = 3)
-- gamemates_id 3 (user3)
(3, 6, 4, '밸런스 좋은 플레이였습니다.', NOW()),
(3, 7, 5, '완전 캐리해주셨어요.', NOW()),
(3, 8, 4, '기본기가 탄탄합니다.', NOW()),

-- gamemates_id 7 (user7)
(7, 3, 5, '유쾌하고 매너 좋습니다.', NOW()),
(7, 6, 5, '엄청난 캐리! 다음에도 부탁드립니다.', NOW()),
(7, 8, 5, '완벽한 지원 플레이!', NOW()),

-- gamemates_id 10 (user10)
(10, 6, 5, '극한의 팀플레이!', NOW()),
(10, 7, 5, '팀워크가 정말 좋습니다.', NOW()),
(10, 8, 4, '플레이 스타일이 잘 맞았어요.', NOW()),

-- gamemates_id 12 (user12)
(12, 6, 5, '정말 안정적인 캐리 능력.', NOW()),
(12, 9, 4, '매너 좋음.', NOW()),
(12, 11, 4, '소통 능력이 좋습니다.', NOW()),

-- gamemates_id 15 (user15)
(15, 8, 5, '팀 전체를 잘 보조해주는 느낌.', NOW()),
(15, 11, 5, '센스가 뛰어납니다.', NOW()),
(15, 14, 4, '의사소통이 좋았습니다.', NOW()),

-- gamemates_id 18 (user18)
(18, 6, 5, '팀 시너지가 정말 좋았어요.', NOW()),
(18, 12, 4, '궁 연계가 좋았습니다.', NOW()),
(18, 15, 5, '게임 내내 즐거웠습니다.', NOW()),

-- gamemates_id 19 (user19)
(19, 7, 5, '포지션 선정이 훌륭합니다.', NOW()),
(19, 9, 4, '궁 활용이 좋았습니다.', NOW()),
(19, 14, 4, '전체적으로 무난했습니다.', NOW());


-- matches dummy data (orders_id는 AUTO_INCREMENT)
INSERT INTO matches (users_id, ordered_users_id, order_users_id, orders_game_id, order_status) VALUES
(1, 4, 1, 1, 'ACCEPTED'),   -- PK: 1
(2, 6, 2, 2, 'ACCEPTED'),   -- PK: 2
(3, 10, 3, 3, 'ACCEPTED'),  -- PK: 3
(4, 9, 4, 1, 'ACCEPTED'),   -- PK: 4
(5, 11, 5, 2, 'ACCEPTED'),  -- PK: 5
(6, 2, 6, 1, 'ACCEPTED'),   -- PK: 6
(7, 10, 7, 3, 'ACCEPTED'),  -- PK: 7
(8, 12, 8, 1, 'ACCEPTED'),  -- PK: 8
(9, 1, 9, 1, 'ACCEPTED'),   -- PK: 9
(10, 7, 10, 3, 'ACCEPTED'), -- PK: 10
(11, 5, 11, 2, 'ACCEPTED'), -- PK: 11
(12, 3, 12, 3, 'ACCEPTED'), -- PK: 12
(13, 2, 13, 1, 'ACCEPTED'), -- PK: 13
(14, 3, 14, 2, 'ACCEPTED'), -- PK: 14
(15, 6, 15, 3, 'ACCEPTED'), -- PK: 15
(16, 4, 16, 1, 'ACCEPTED'), -- PK: 16
(17, 14, 17, 2, 'ACCEPTED'),-- PK: 17
(18, 16, 18, 3, 'ACCEPTED'),-- PK: 18
(19, 13, 19, 3, 'ACCEPTED'),-- PK: 19
(20, 18, 20, 2, 'ACCEPTED');-- PK: 20


-- Notifications dummy data (REQUEST / ACCEPTED / DECLINED)
INSERT INTO notifications (users_id, notification_type, match_id, message, is_read, created_at) VALUES
(1, 'REQUEST', 1, 'user4님이 매칭을 요청했습니다.', FALSE, NOW()),
(1, 'ACCEPTED', 1, '매칭이 수락되었습니다!', FALSE, NOW()),

(2, 'REQUEST', 2, 'user6님이 매칭을 요청했습니다.', FALSE, NOW()),
(2, 'ACCEPTED', 2, '매칭이 수락되었습니다!', TRUE, NOW()),

(3, 'REQUEST', 3, 'user10님이 매칭을 요청했습니다.', FALSE, NOW()),
(3, 'ACCEPTED', 3, '매칭이 수락되었습니다!', TRUE, NOW()),

(4, 'REQUEST', 4, 'user9님이 매칭을 요청했습니다.', FALSE, NOW()),
(4, 'ACCEPTED', 4, '매칭이 수락되었습니다!', TRUE, NOW()),

(5, 'REQUEST', 5, 'user11님이 매칭을 요청했습니다.', FALSE, NOW()),
(5, 'ACCEPTED', 5, '매칭이 수락되었습니다!', TRUE, NOW()),

(6, 'REQUEST', 6, 'user2님이 매칭을 요청했습니다.', FALSE, NOW()),
(6, 'ACCEPTED', 6, '매칭이 수락되었습니다!', TRUE, NOW()),

(7, 'REQUEST', 7, 'user10님이 매칭을 요청했습니다.', FALSE, NOW()),
(7, 'ACCEPTED', 7, '매칭이 수락되었습니다!', FALSE, NOW()),

(8, 'REQUEST', 8, 'user12님이 매칭을 요청했습니다.', FALSE, NOW()),
(8, 'ACCEPTED', 8, '매칭이 수락되었습니다!', TRUE, NOW()),

(9, 'REQUEST', 9, 'user1님이 매칭을 요청했습니다.', FALSE, NOW()),
(9, 'ACCEPTED', 9, '매칭이 수락되었습니다!', TRUE, NOW()),

(10, 'REQUEST', 10, 'user7님이 매칭을 요청했습니다.', FALSE, NOW()),
(10, 'ACCEPTED', 10, '매칭이 수락되었습니다!', TRUE, NOW()),

(11, 'REQUEST', 11, 'user5님이 매칭을 요청했습니다.', FALSE, NOW()),
(11, 'ACCEPTED', 11, '매칭이 수락되었습니다!', TRUE, NOW()),

(12, 'REQUEST', 12, 'user3님이 매칭을 요청했습니다.', FALSE, NOW()),
(12, 'ACCEPTED', 12, '매칭이 수락되었습니다!', TRUE, NOW()),

(13, 'REQUEST', 13, 'user2님이 매칭을 요청했습니다.', FALSE, NOW()),
(13, 'ACCEPTED', 13, '매칭이 수락되었습니다!', TRUE, NOW()),

(14, 'REQUEST', 14, 'user3님이 매칭을 요청했습니다.', FALSE, NOW()),
(14, 'ACCEPTED', 14, '매칭이 수락되었습니다!', TRUE, NOW()),

(15, 'REQUEST', 15, 'user6님이 매칭을 요청했습니다.', FALSE, NOW()),
(15, 'ACCEPTED', 15, '매칭이 수락되었습니다!', TRUE, NOW()),

(16, 'REQUEST', 16, 'user4님이 매칭을 요청했습니다.', FALSE, NOW()),
(16, 'ACCEPTED', 16, '매칭이 수락되었습니다!', TRUE, NOW()),

(17, 'REQUEST', 17, 'user14님이 매칭을 요청했습니다.', FALSE, NOW()),
(17, 'ACCEPTED', 17, '매칭이 수락되었습니다!', TRUE, NOW()),

(18, 'REQUEST', 18, 'user16님이 매칭을 요청했습니다.', FALSE, NOW()),
(18, 'ACCEPTED', 18, '매칭이 수락되었습니다!', TRUE, NOW()),

(19, 'REQUEST', 19, 'user13님이 매칭을 요청했습니다.', FALSE, NOW()),
(19, 'ACCEPTED', 19, '매칭이 수락되었습니다!', TRUE, NOW()),

(20, 'REQUEST', 20, 'user18님이 매칭을 요청했습니다.', FALSE, NOW()),
(20, 'ACCEPTED', 20, '매칭이 수락되었습니다!', TRUE, NOW());
