CREATE TABLE `users` (
	`user_id` int not null auto_increment,
    `user_age` int default 0,
    `user_status` int default 0,
    `user_name` nvarchar(128) collate utf8mb3_bin default null,
    `user_email` nvarchar(128) collate utf8mb3_bin default null,
    `user_address` nvarchar(128) collate utf8mb3_bin default null,   
    
    -- KEY INDEX
    primary key (user_id),
    key `idx_email_age_name` (`user_email`, `user_age`, `user_name`),
    key `idx_status` (`user_status`)
) engine=InnoDB AUTO_INCREMENT=4 default charset=utf8mb3 collate utf8mb3_bin;

SELECT * FROM users;
SELECT version();
INSERT INTO users (user_id, user_age, user_status, user_name, user_email, user_address) VALUES
(1, 43, 1, 'Lee Chong Wei', 'lcw.malaysia@badminton.com', 'Penang, Malaysia'),
(2, 32, 1, 'Lin Dan', 'lindan.china@badminton.com', 'Fujian, China'),
(3, 21, 0, 'Triệu Hoàng Thiên Ân', 'thienan.work@outlook.com.vn', 'Ben Tre, Viet Nam');

EXPLAIN SELECT * FROM users WHERE user_id=1;
EXPLAIN SELECT * FROM users WHERE user_email='lcw.malaysia@badminton.com';
EXPLAIN SELECT * FROM users WHERE user_email='lindan.china@badminton.com' AND user_age=32;
EXPLAIN SELECT * FROM users WHERE user_email='thienan.work@outlook.com.vn' AND user_age=21 AND user_name='Triệu Hoàng Thiên Ân';
-- idx_email_age_name
EXPLAIN SELECT * FROM users WHERE user_age=21 AND user_name='Triệu Hoàng Thiên Ân';

EXPLAIN SELECT user_age FROM users WHERE user_name='Triệu Hoàng Thiên Ân';
EXPLAIN SELECT * FROM users WHERE user_email like '%an';