import db from "../db/index";

import { searchQueries }  from "../utils/searchQueries";


const Authors = {
    async insert(req, res) {
        if(!req.body.firstName || !req.body.lastName) {
            return res.status(400).send({'message': "Provide name and last name of the author."})
        }

        const searchQuery = `SELECT *
        FROM authors
        WHERE LOWER(first_name) = '${req.body.firstName.toLowerCase()}'
        AND
            LOWER(last_name) = '${req.body.lastName.toLowerCase()}'`;

        const query = `INSERT INTO
        authors(first_name, last_name, origin)
        VALUES($1, $2, $3)
        RETURNING *`;

        try {
            // search if provided names match already existing author 
            const { rows } = await db.query(searchQuery); 

            if(rows[0]) {
                return res.status(400).send({'message': 'This author already exists.'})
            }
            const values = [
                req.body.firstName,
                req.body.lastName,
                req.body.origin
            ];

            const response = await db.query(query, values);

            return res.status(201).send({"message": "Author has been created"});
        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async remove(req,res) {
        if(!req.body.authorId) {
            return res.status(400).send({'message': "Provide data to start the query."})
        }

        const query = `DELETE
        FROM authors
        WHERE author_id = ${req.body.authorId}
        RETURNING *`;

        try {
            const { rows } = await db.query(query);

            if(!rows[0]) {
                return res.status(404).send({"message": "Author not found."})
            }

            return res.status(200).send({"message": "Author has been deleted"})

        } catch(err) {
            return res.status(400).send(err);
        }
    },
    async update(req, res) {
        if(!req.body.authorId) {
            return res.status(400).send({"message": "Provide author id"})
        }

        const findOne = `SELECT *
        FROM authors
        WHERE author_id = ${req.body.authorId}`;

        try {
            const { rows } = await db.query(findOne);
            // return res.send( rows[0]);

            if(!rows[0]) {
                return res.status(404).send({"message": "Author not found"})
            }

            const head = {
                first: req.body.firstName,
                last: req.body.lastName,
                origin: req.body.origin
            };

            const values = {
                firstName: head.first.length == 0 && !head.first ? rows[0].firstName : head.first,
                lastName: head.last.length == 0 && !head.last ? rows[0].lastName : head.last,
                origin: head.origin.length == 0 && !head.origin ? rows[0].origin : head.origin
            };

            // return res.send(values);

            const updateQuery = `UPDATE authors
            SET first_name = '${values.firstName}',
                last_name = '${values.lastName}',
                origin = '${values.origin}'
            WHERE author_id = ${req.body.authorId}
            RETURNING *`
            ;
            
            const response = await db.query(updateQuery);

            return res.status(200).send({"message": "Author has been updated."});
        } catch (err) {
            return res.status(400).send(err);
        }


    },
    async getAuthor(req, res) {
        if(!req.body.authorId) {
            return res.status(400).send({"message": "Please, provide author's id."})
        }

        const getAuthorQuery = `SELECT * FROM authors
        WHERE author_id = '${req.body.authorId}'`;

        try {
            const { rows: authorResult } = await db.query(getAuthorQuery);

            if(!authorResult[0]) {
                return res.status(400).send({"message": "Author not found"})
            }

            return res.status(200).send(authorResult)
        } catch (err) {
            return res.status(400).send(err)
        }
    },
    async getAuthorAndBooks(req, res) {
        if(!req.body.authorId) {
            return res.status(200).send({"message": "Please, provide author's id."})
        }

        const getAuthorQuery = `SELECT * FROM authors
        WHERE author_id = '${req.body.authorId}'`;

        const getBooksQuery = searchQueries.selectBook + `\n WHERE A.author_id = '${req.body.authorId}'`;

        try {
            const [
                { rows: author },
                { rows: books}
            ] = await Promise.all([
                db.query(getAuthorQuery),
                db.query(getBooksQuery)
            ]);

            return res.status(200).send({
                author,
                books
            })
        } catch(err) {
            return res.status(400).send(err);
        }
    },
    async getAllAuthors(req, res) {
        const getAllAuthors = 'SELECT * FROM authors';

        try {
            const { rows: authors } = await db.query(getAllAuthors);

            if(!authors[0]) {
                return res.status(400).send({"message": "Unable to get authors."})
            }

            return res.status(200).send(authors);
        } catch(err) {
            return res.status(400).send(err);
        }
    }
}

export default Authors;