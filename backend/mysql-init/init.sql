-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS softwareassignmentdb;
USE softwareassignmentdb;

-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    users_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(255) NOT NULL UNIQUE,
    login_pwd VARCHAR(255) NOT NULL,
    point BIGINT NOT NULL,
    users_name VARCHAR(10) NOT NULL,
    users_description VARCHAR(255),
    users_birthday DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    profile_image_url VARCHAR(500),
    login_fail_count INT NOT NULL DEFAULT 0
);

-- Games 테이블 생성
CREATE TABLE IF NOT EXISTS games (
    games_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    games_name VARCHAR(255) NOT NULL
);

-- Gamemates 테이블 생성
CREATE TABLE IF NOT EXISTS gamemates (
    gamemates_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    users_id BIGINT NOT NULL,
    games_id BIGINT NOT NULL,
    price BIGINT NOT NULL,
    tier VARCHAR(45) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users (users_id),
    FOREIGN KEY (games_id) REFERENCES games (games_id)
);

-- Reviews 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
    reviews_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gamemates_id BIGINT NOT NULL,
    users_id BIGINT NOT NULL,
    score INT NOT NULL,
    reviews_description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gamemates_id) REFERENCES gamemates (gamemates_id),
    FOREIGN KEY (users_id) REFERENCES users (users_id)
);

-- Coin 테이블 생성
CREATE TABLE IF NOT EXISTS coin (
    coin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    users_id BIGINT NOT NULL,
    coin_amount INT NOT NULL,
    payment_amount INT NOT NULL,
    payment_method VARCHAR(45) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (users_id)
);

-- files 테이블 생성
CREATE TABLE IF NOT EXISTS files (
    files_id BIGINT PRIMARY KEY,
    files_url VARCHAR(255) NOT NULL,
    users_id BIGINT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users (users_id)
);

-- marks 테이블 생성
CREATE TABLE IF NOT EXISTS marks (
  marks_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  users_id BIGINT NOT NULL,
  marked_users_id BIGINT NOT NULL,
  FOREIGN KEY (users_id) REFERENCES users (users_id)
);

-- matches 테이블 생성
CREATE TABLE IF NOT EXISTS matches (
  orders_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  users_id BIGINT NOT NULL,
  ordered_users_id BIGINT NOT NULL,
  order_users_id BIGINT NOT NULL,
  orders_game_id BIGINT NOT NULL,
  order_status VARCHAR(255),
  FOREIGN KEY (users_id) REFERENCES users (users_id)
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
  FOREIGN KEY (users_id) REFERENCES users (users_id)
);


-- Users dummy data (10 users)
-- Passwords are just plain text for dummy data. In a real application, they should be hashed.
INSERT INTO users (login_id, login_pwd, point, users_name, users_description, users_birthday, gender, profile_image_url, login_fail_count) VALUES
('user1', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 10000, '김철수', '안녕하세요! 게임을 좋아하는 김철수입니다.', '1995-01-10', '남', 'http://example.com/profile1.jpg', 0),
('user2', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 15000, '이영희', '함께 즐겁게 게임해요!', '1998-03-22', '여', 'http://example.com/profile2.jpg', 0),
('user3', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 20000, '박민준', '주로 FPS 게임을 즐깁니다.', '1992-07-15', '남', 'http://example.com/profile3.jpg', 0),
('user4', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 5000, '최지우', '초보지만 열심히 할게요!', '2000-11-30', '여', 'http://example.com/profile4.jpg', 0),
('user5', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 30000, '정승호', '다양한 게임을 경험해보고 싶습니다.', '1996-05-25', '남', 'http://example.com/profile5.jpg', 0),
('user6', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 12000, '윤서연', 'RPG 게임 전문가입니다.', '1994-09-08', '여', 'http://example.com/profile6.jpg', 0),
('user7', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 8000, '한지훈', '전략 게임을 좋아합니다.', '1999-02-18', '남', 'http://example.com/profile7.jpg', 0),
('user8', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 25000, '송예진', '즐겜 유저입니다. :)', '1997-12-01', '여', 'http://example.com/profile8.jpg', 0),
('user9', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 18000, '강현우', '새로운 친구를 사귀고 싶어요.', '1993-06-12', '남', 'http://example.com/profile9.jpg', 0),
('user10', '$2a$10$GX9auCX4yJHxgxbHlkQUBO68rJ05BHKTsZdFzGifGoNqrHYpGn3.O', 40000, '임나영', '게임은 즐거워야죠!', '2001-08-05', '여', 'http://example.com/profile10.jpg', 0);

-- Games dummy data (3 games)
INSERT INTO games (games_id, games_name) VALUES
(1, '리그 오브 레전드'),
(2, '배틀그라운드'),
(3, '오버워치');

-- Gamemates dummy data (10 gamemates)
-- users_id from 1 to 5 will be gamemates
INSERT INTO gamemates (users_id, games_id, price, tier) VALUES
(1, 1, 2000, 'S'), -- 김철수, 리그 오브 레전드
(2, 2, 3000, 'A'), -- 이영희, 배틀그라운드
(3, 3, 2500, 'B'), -- 박민준, 오버워치
(4, 1, 1500, 'C'), -- 최지우, 리그 오브 레전드
(5, 2, 4000, 'S'), -- 정승호, 배틀그라운드
(1, 2, 2200, 'A'), -- 김철수, 배틀그라운드
(2, 3, 3300, 'B'), -- 이영희, 오버워치
(3, 1, 2800, 'C'), -- 박민준, 리그 오브 레전드
(6, 1, 5000, 'F'), -- 윤서연, 리그 오브 레전드
(7, 3, 4500, 'S'); -- 한지훈, 오버워치

-- Reviews dummy data
-- gamemates_id will be 1 to 10 from the above inserts
-- users_id 6 to 10 will be reviewers
INSERT INTO reviews (gamemates_id, users_id, score, reviews_description, created_at) VALUES
(1, 6, 5, '정말 친절하고 실력도 좋으세요! 다음에 또 같이 하고 싶어요.', NOW()),
(1, 7, 4, '재미있었습니다. 설명도 잘해주세요.', NOW()),
(2, 8, 5, '최고의 파트너! 덕분에 치킨 먹었습니다.', NOW()),
(2, 9, 5, '시간 가는 줄 모르고 게임했네요. 강추!', NOW()),
(3, 10, 3, '조금 아쉬웠지만 그래도 괜찮았어요.', NOW()),
(4, 1, 2, '약속 시간에 나타나지 않았어요.', NOW()),
(5, 2, 5, '매너도 좋으시고 실력도 출중합니다!', NOW());

-- Notifications dummy data (요청/수락/거절)
INSERT INTO notifications (users_id, notification_type, match_id, message, is_read, created_at) VALUES
(1, 'REQUEST', 1, 'user2님이 매칭을 요청했습니다.', FALSE, NOW()),
(1, 'ACCEPTED', 1, '매칭이 수락되었습니다!', FALSE, NOW()),
(2, 'REQUEST', 2, 'user5님이 매칭을 요청했습니다.', FALSE, NOW()),
(2, 'DECLINED', 2, '매칭 요청이 거절되었습니다.', FALSE, NOW()),
(3, 'ACCEPTED', 3, '매칭이 수락되었습니다!', TRUE, NOW()),
(3, 'DECLINED', 3, '매칭 요청이 거절되었습니다.', TRUE, NOW()),
(4, 'REQUEST', 4, 'user7님이 매칭을 요청했습니다.', FALSE, NOW()),
(4, 'ACCEPTED', 4, '매칭이 수락되었습니다!', FALSE, NOW()),
(5, 'REQUEST', 5, 'user3님이 매칭을 요청했습니다.', FALSE, NOW()),
(5, 'DECLINED', 5, '매칭 요청이 거절되었습니다.', TRUE, NOW());
