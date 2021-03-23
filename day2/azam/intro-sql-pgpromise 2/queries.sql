/*
CREATE TABLE books(

	book_id SERIAL PRIMARY KEY, 
	name TEXT NOT NULL, 
	isbn VARCHAR(20) NOT NULL, 
	author VARCHAR(50) NOT NULL, 
	is_published BOOLEAN DEFAULT TRUE  

)*/ 

ALTER TABLE books
ADD COLUMN rating INTEGER 


/*
CRUD 
C - CREATE 
R - READ 
U - UPDATE 
D - DELETE 
*/

-- INSERT BOOK INTO THE TABLE 
INSERT INTO books(name, isbn, author, is_published) VALUES('Intro to JS', '44455', 'John Resig',FALSE); 

-- SELECT EVERYTHING FROM A TABLE 
-- SELECT * FROM books; 

-- SELECT EVERYTHING FROM A TABLE 
SELECT book_id, name, isbn, author, is_published, rating FROM books 

-- select all the books that are published 
SELECT book_id, name FROM books 
WHERE is_published = TRUE 


-- DELETE all books from the books table 
--DELETE FROM books; 

-- DELETE A SINGLE BOOK FROM The books table 
DELETE FROM books 
WHERE book_id = 1 

-- UPDATE A BOOK 
UPDATE books 
SET author = 'John Smith', isbn = '555555' 
WHERE book_id = 3 







