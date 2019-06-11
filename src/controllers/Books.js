import moment, { updateLocale } from "moment";
import uuidv4 from "uuid/v4";

import db from "../db/index";

import utils from "../utils/utils";
import {columnNames} from "../utils/columnNames";


const Books = {
    async insert(req, res) {

        if (!req.body.title || !req.body.authorFirst || !req.body.authorLast || !req.body.lang || !req.body.isbn) {
            return res.status(400).send({ "message": "Please, provide all required values..." });
        };

        const searchAuthorQuery = `SELECT author_id
        FROM authors
        WHERE LOWER(first_name) = '${req.body.authorFirst.toLowerCase()}'
        AND
            LOWER(last_name) = '${req.body.authorLast.toLowerCase()}'`;;

            
            try {
                const { rows: authorId } = await db.query(searchAuthorQuery);

            
                const insertQuery = `INSERT INTO
                books(book_id, title, author_id, series, edition, genre_id, 
                    keywords, ukd, lang, pub_year, translator_id, pub_id, isbn, create_date)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                returning *`;
        
                

            if(!authorId[0]) {
                const query = `INSERT INTO
                authors(first_name, last_name, origin)
                VALUES($1, $2, $3)
                RETURNING *`;

                const values = [
                    req.body.authorFirst,
                    req.body.authorLast,
                    req.body.authorOrigin
                ];

                const authorResponse = await db.query(query, values);

                if(!authorResponse.rows[0]) {
                    return res.status(400).send({"message": "Something went wrong with adding author to the database."})
                }

                const insertValuesAlt = [
                    uuidv4(),
                    req.body.title,
                    authorResponse.rows[0].author_id,
                    req.body.series,
                    req.body.edition,
                    req.body.genreId,
                    req.body.keywords,
                    req.body.ukd,
                    req.body.lang,
                    req.body.pubYear,
                    req.body.translatorId,
                    req.body.pubId,
                    req.body.isbn,
                    moment(new Date())
                ];

                
                const { rows } = await db.query(insertQuery, insertValuesAlt);
                return res.status(201).send(rows[0]);

            }
            const insertValues = [
                uuidv4(),
                req.body.title,
                authorId[0].author_id,
                req.body.series,
                req.body.edition,
                req.body.genreId,
                req.body.keywords,
                req.body.ukd,
                req.body.lang,
                req.body.pubYear,
                req.body.translatorId,
                req.body.pubId,
                req.body.isbn,
                moment(new Date())
            ];
            const { rows } = await db.query(insertQuery, insertValues);
            return res.status(201).send(rows[0]);
        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async remove(req, res) {
        if(!req.body.bookId) {
            return res.status(400).send({'message': "Provide id of the book to delete"});
        }

        const query = `DELETE
        FROM books
        WHERE book_id = '${req.body.bookId}'
        RETURNING *`;

        try {
            const { rows } = await db.query(query);

            if(!rows[0]) {
                return res.status(404).send({"message": "book not found"})
            }
            return res.status(200).send({"message": "The book has been deleted."});
        } catch (err) {
            return res.status(400).send(err);
        }
    },

    async update(req, res) {
        if(!req.body.bookId) {
            return res.status(400).send({'message': "Provide id of the book to update"})
        }


        const dbColumns = utils.setColumnsNames(req, columnNames.books);
        const values = utils.setBooksValuesNames(req);

        console.log(values);
        const setQueries = dbColumns.map((el, idx) => `${el} = ${values[idx]}`);

        const query = `UPDATE books
        SET last_update = '${moment(new Date()).format()}',
            ${setQueries}
        WHERE book_id = '${req.body.bookId}'
        RETURNING *`;

        console.log(query);
    

        try {
            const { rows } = await db.query(query);

            if(!rows[0]) {
                return res.status(404).send({'message': "book not found"});
            }
            return res.status(200).send({'message': "The book has beed updated."})
        } catch (err) {
            return res.status(400).send(err);
        }
    }

}



export default Books;