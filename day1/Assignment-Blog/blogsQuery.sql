CREATE TABLE blogs (

	post_id SERIAL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	body TEXT NOT NULL,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	is_published BOOLEAN DEFAULT FALSE



)

-- CREATE NEW POST IN TABLE
INSERT INTO blogs (title, body, is_published)
VALUES('Hello World', 'This is my first blog post', TRUE)


SELECT * FROM blogs2;


-- DELETE SPECIFIC POST 
DELETE FROM blogs2
WHERE post_id = 2