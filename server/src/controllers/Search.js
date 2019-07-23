import db from "../db/index";
import {searchQueries, queryFormat } from "../utils/searchQueries";

const Search = {
    async search(req, res) {
        const params = req.query;
        if(Object.entries(params).length == 0) {
            return res.status(400).send({"message": "Enter at least one value to search"});
        }
        
        // build yearRange object depending on available query string parameters
        let yearRange = {};
        Object.entries(params).forEach(el => {
            if(el[0] === 'yearStart') {
                yearRange.yearStart = el[1];
            } else if (el[0] === 'yearEnd') {
                yearRange.yearEnd = el[1];
            }
        });

        // check query string for specific parameters
        const areYears = Object.keys(yearRange).length === 0 ? false : true;
        const hasCols = Object.keys(params).includes('col');
        const whereClause = hasCols ? queryFormat.whereClause(params.col, params.value, params.query) : '';
        const orderQuery =  params.order ? queryFormat.orderBy(params.order) : '';
        const genreClause = () => {
            if(params.query === 'a' || params.genreId === 'all') {
                return ''
            } else {
                return ` AND D.genre_id = ${params.genreId}` 
            }
        }
        const genreQuery = params.genreId ? genreClause() : '';

        // check if years data is supplied and if it's not searching in authors - 'a'
        const yearRangeClauseFn = () => {
            if(areYears) {
                if(params.query === 'a') {
                    return ''
                } else {
                    return queryFormat.yearRange(yearRange, hasCols)
                }
            }
            return ''
        }

        const query = searchQueries.select(params.query) + whereClause
            + yearRangeClauseFn() + genreQuery + orderQuery;

            console.log('Search.js query: ', query);


        try {
            const { rows } = await db.query(query);
            // console.log(rows);
            if(!rows[0]) {
                return res.status(404).send({"message": "Book not found"})
            }
            return res.status(200).send(rows);
        } catch(err) {
            return res.status(400).send({"message": "something went wrong with search"});
        }


    }
}


export default Search;