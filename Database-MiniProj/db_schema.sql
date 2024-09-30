
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

-- CREATE TABLE IF NOT EXISTS testUsers (
--     test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     test_name TEXT NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS testUserRecords (
--     test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     test_record_value TEXT NOT NULL,
--     test_user_id  INT, --the user that the record belongs to
--     FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
-- );

--insert default data (if necessary here)

-- INSERT INTO testUsers (test_name) VALUES ('Simon Star');
-- INSERT INTO testUserRecords (test_record_value, test_user_id) VALUES('Lorem ipsum dolor sit amet', 1); --try changing the test_user_id to a different number and you will get an error

-- COMMIT;


--Personal Table Creation

CREATE TABLE IF NOT EXISTS Author (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    author_subTitle TEXT NOT NULL,
    author_desc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_title TEXT NOT NULL,
    post_sub_title TEXT NOT NULL,
    post_date TIMESTAMP DEFAULT NULL,
    post_last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_desc TEXT NOT NULL,
    is_draft BOOLEAN DEFAULT true,
    likes INTEGER DEFAULT 0,
    author_id INTEGER DEFAULT 1,
    FOREIGN KEY (author_id) REFERENCES Author(author_id)
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    post_id INTEGER,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

INSERT INTO Author (author_name, author_subTitle, author_desc) VALUES('Mttjy', '~ Welcome to my blog ~','"Welcome to my vibrant blog, where joy and excitement meet! Iam fun-loving soul, and I can not wait to share my world of adventure with you all."');

INSERT INTO Posts (post_title, post_sub_title, post_date, post_last_modified, post_desc, is_draft, likes)
VALUES
    ('Hiking Adventure', 'Explore the beauty of nature.', '', '2023/07/09 - 13:20', 'Embark on an exciting hiking adventure and witness breathtaking views of mountains and valleys. Experience the serenity of the wilderness while trekking through lush green forests and crossing crystal-clear streams.', 1, 0),
    ('Delicious Recipes', 'Taste the flavors of the world.', '2023/06/15 - 15:45', '2023/07/10 - 09:45', 'Discover a culinary journey with a collection of delightful recipes from around the globe. From savory dishes to mouthwatering desserts, these recipes will tantalize your taste buds and inspire your inner chef.', 0, 23),
    ('Artistic Creations', 'Celebrate creativity and imagination.', '2023/06/20 - 12:00', '2023/07/11 - 16:30', 'Immerse yourself in the world of art and witness a gallery of stunning artistic creations. From mesmerizing paintings to captivating sculptures, this exhibition showcases the brilliance of human imagination.', 0, 72),
    ('Sailing Escape', 'Feel the breeze on the open sea.', '', '2023/07/12 - 11:10', 'Set sail on a thrilling sailing adventure and feel the freedom of the open sea. Bask in the warm sunlight as you navigate through the vast ocean, and experience the joy of being one with the waves.', 1, 0),
    ('Photography Masterclass', 'Capture moments that last forever.', '2023/06/05 - 14:00', '2023/07/13 - 14:50', 'Join a photography masterclass and learn the art of capturing unforgettable moments. From stunning landscapes to candid portraits, this class will hone your photography skills and teach you the secrets of visual storytelling.', 0, 41),
    ('Mindfulness Retreat', 'Find inner peace and tranquility.', '2023/06/25 - 11:30', '2023/07/14 - 10:30', 'Embark on a journey of self-discovery and inner peace with a mindfulness retreat. Unplug from the busy world and immerse yourself in meditation and yoga, connecting with your inner self amidst serene surroundings.', 0, 37),
    ('Incredible Wildlife', 'Witness the wonders of the animal kingdom.', '2023/06/08 - 08:45', '2023/07/15 - 17:15', 'Embark on a wildlife safari and witness the majesty of the animal kingdom. From magnificent elephants to elusive big cats, this adventure offers a rare glimpse into the diverse and fascinating world of wildlife.', 0, 20),
    ('Night Sky Stargazing', 'Unravel the mysteries of the cosmos.', '2023/07/01 - 20:00', '2023/07/16 - 12:00', 'Spend a night under the starry sky and unravel the mysteries of the cosmos. Join an astronomy expert to observe celestial wonders, from shimmering constellations to dazzling shooting stars.', 0, 15);

INSERT INTO Comments (comment_text, post_id, comment_date) VALUES
('Great job!', 2, '2023-07-10T09:45:00Z'),
('Awesome content!', 2, '2023-07-11T15:30:00Z'),
('Well done!', 2, '2023-07-12T18:20:00Z'),
('Really helpful.', 2, '2023-07-13T11:55:00Z'),
('Impressed with your skills.', 2, '2023-07-14T16:10:00Z'),
('Fantastic explanation!', 2, '2023-07-14T17:05:00Z'),

('Nice article!', 3, '2023-07-10T14:25:00Z'),
('Thanks for sharing your knowledge.', 3, '2023-07-11T10:15:00Z'),
('Keep it up!', 3, '2023-07-12T12:30:00Z'),
('Thoroughly enjoyed it.', 3, '2023-07-13T08:40:00Z'),

('Well-written.', 5, '2023-07-15T13:50:00Z'),
('Insightful points.', 5, '2023-07-16T10:20:00Z'),
('Impressive insights.', 5, '2023-07-17T15:15:00Z'),
('Fantastic explanation!', 5, '2023-07-14T17:05:00Z'),
('Thumbs up!', 5, '2023-07-18T11:30:00Z'),
('Really enjoyed this.', 5, '2023-07-19T14:45:00Z'),

('Loved the examples.', 6, '2023-07-15T12:10:00Z'),
('Brilliant explanations.', 6, '2023-07-16T09:25:00Z'),
('Engaging read.', 6, '2023-07-17T16:35:00Z'),
('Fantastic work!', 6, '2023-07-18T14:50:00Z'),
('Well-done!', 6, '2023-07-19T17:40:00Z'),

('Thoroughly impressed.', 7, '2023-07-20T10:05:00Z'),
('Great insights.', 7, '2023-07-21T15:20:00Z'),
('Well-explained concepts.', 7, '2023-07-22T11:30:00Z'),
('Keep it up!', 7, '2023-07-12T12:30:00Z'),
('Thoroughly enjoyed it.', 7, '2023-07-13T08:40:00Z'),
('Thanks for sharing!', 7, '2023-07-23T16:15:00Z'),
('Enjoyed it a lot.', 7, '2023-07-23T12:50:00Z'),

('Nice coding skills!', 8, '2023-07-20T14:30:00Z'),
('Interesting approach.', 8, '2023-07-21T09:40:00Z'),
('Thanks for sharing!', 8, '2023-07-23T16:15:00Z'),
('Thumbs up for your efforts.', 8, '2023-07-22T13:25:00Z'),
('Great work!', 8, '2023-07-23T16:50:00Z'),
('Looking forward to your next project.', 8, '2023-07-21T10:15:00Z');

COMMIT;