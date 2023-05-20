import { createContainer, asValue } from 'awilix';
import { inject } from 'awilix-express';
import { Unauthorize } from '../tools/errors';
import ResponseTransformer from '../utils/ResponseTransformer';


module.exports = inject(({ database, queries }) => async(req, res, next) => {
    try {
        const secret_key = req.headers['secret-key'];

        if (!secret_key) {
            return ResponseTransformer.error(req, res, new Unauthorize('Please provide secret key'));
        }
        
        const client = await database.query.oneOrNone(queries.client.getBySecret, { secret_key });

        if (!client) {
            return ResponseTransformer.error(req, res, new Unauthorize('Invalid Secret Key provided'));
        }

        req.client = client;

        req.container.register({
            currentClient: asValue(client)
        });

        next();
    } catch (err) {
        return ResponseTransformer.error(req, res, new Unauthorize('something went wrong while getting your client details'));
    }
});
