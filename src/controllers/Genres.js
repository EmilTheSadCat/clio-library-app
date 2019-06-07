import db from "../db/index";

const Genres = {
    async add(req, res) {
        if(!req.body.genreName) {
            return res.status(400).send({"message": "Please, provide name for the new genre."})
        }

        const searchQuery = `SELECT genre_id
        FROM genres
        WHERE 
            LOWER(genre_name) = '${req.body.genreName.toLowerCase()}'`
        ;

        try {

            const { rows: genreExists } = await db.query(searchQuery);

            if(genreExists[0]) {
                const genreId = genreExists[0].genre_id;
                return res.status(400).send({'message': `Genre with that name already exists with an id of: ${genreId}` })
            }

            const insertQuery = `INSERT INTO
            genres(genre_name)
            VALUES($1)
            returning *`;

            const { rows: genre } = await db.query(insertQuery, [req.body.genreName]);

            if(!genre) {
                return res.status(400).send({'message': "something went wrong with the query"})
            }
            return res.status(200).send(genre[0]);

        } catch (err) {
            return res.status(400).send(err);
        }
    },
    async remove(req, res){
        if(!req.body.genreId) {
            return res.status(400).send({"message": "Please, provide id of a genre to remove."})
        }

        const query = `DELETE FROM genres
        WHERE genre_id = ${req.body.genreId}
        RETURNING *`;
        

        try {
            const { rows: deletedGenre } = await db.query(query);

            if(!deletedGenre[0]) {
                return res.status(404).send({"message": "No such genre in the database."})
            }

            return res.status(200).send({"message": `Genre has been deleted.`})


        } catch (err) {
            return res.status(400).send(err);
        }
    }
}

export default Genres;