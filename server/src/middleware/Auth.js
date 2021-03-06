import jwt from "jsonwebtoken";

import db from "../db/index";

const Auth = {
    async verifyToken(req, res, next) {
        const { token } = req.cookies['x-access-token'];

        if(!token) {
            return res.status(400).send({'message': "Token is not provided"});
        }
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await db.query(text, [decoded.userId]);

            if(!rows[0]) {
                return res.status(400).send({'message': 'The token you provided is invalid'});
            }
            req.user = { id: decoded.userId };
            next();
        } catch(error) {
            return res.status(400).send(error);
        }
    },

    async verifyAdminToken(req, res, next) {
        const { token } = req.cookies['x-access-token'];

        if(!token) {
            return res.status(400).send({'message': "Token is not provided"});
        }
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = 'SELECT * FROM admins WHERE user_id = $1';
            const { rows } = await db.query(text, [decoded.userId]);

            if(!rows[0]) {
                return res.status(400).send({'message': 'You are not authorized'});
            }
            req.user = { id: decoded.userId };
            next();
        } catch(error) {
            return res.status(400).send(error);
        }
    },
    async decodeToken(req, res) {
        const token  = req.body['x-access-token'];

        if(!token) {

            // token not provided
            return res.status(400).send({"message" : "Provide access token"})
        }


        try {
            const {admin, userId, firstName, lastName} = await jwt.verify(token, process.env.SECRET);



            return res.status(200).send({admin, userId, firstName, lastName})
        } catch (err) {
            return res.status(400).send({"message": "Unable to decode the token"})
        }

    }


}

export default Auth;