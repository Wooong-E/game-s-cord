-- Users dummy data (10 users)
-- Passwords are just plain text for dummy data. In a real application, they should be hashed.
INSERT INTO users (login_id, login_pwd, point, users_name, users_description, users_birthday, gender, profile_image_url, login_fail_count) VALUES
('user1', 'password', 10000, '김철수', '안녕하세요! 게임을 좋아하는 김철수입니다.', '1995-01-10', '남', 'http://example.com/profile1.jpg', 0),
('user2', 'password', 15000, '이영희', '함께 즐겁게 게임해요!', '1998-03-22', '여', 'http://example.com/profile2.jpg', 0),
('user3', 'password', 20000, '박민준', '주로 FPS 게임을 즐깁니다.', '1992-07-15', '남', 'http://example.com/profile3.jpg', 0),
('user4', 'password', 5000, '최지우', '초보지만 열심히 할게요!', '2000-11-30', '여', 'http://example.com/profile4.jpg', 0),
('user5', 'password', 30000, '정승호', '다양한 게임을 경험해보고 싶습니다.', '1996-05-25', '남', 'http://example.com/profile5.jpg', 0),
('user6', 'password', 12000, '윤서연', 'RPG 게임 전문가입니다.', '1994-09-08', '여', 'http://example.com/profile6.jpg', 0),
('user7', 'password', 8000, '한지훈', '전략 게임을 좋아합니다.', '1999-02-18', '남', 'http://example.com/profile7.jpg', 0),
('user8', 'password', 25000, '송예진', '즐겜 유저입니다. :)', '1997-12-01', '여', 'http://example.com/profile8.jpg', 0),
('user9', 'password', 18000, '강현우', '새로운 친구를 사귀고 싶어요.', '1993-06-12', '남', 'http://example.com/profile9.jpg', 0),
('user10', 'password', 40000, '임나영', '게임은 즐거워야죠!', '2001-08-05', '여', 'http://example.com/profile10.jpg', 0);

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
