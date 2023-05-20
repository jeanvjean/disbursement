import { createContainer, asValue } from 'awilix';
import { inject } from 'awilix-express';
import { Unauthorize } from '../tools/errors';
import ResponseTransformer from '../utils/ResponseTransformer';

module.exports = (userType) =>
  inject(({ database, queries }) => async (req, res, next) => {
    try {
      const user = await database.query.oneOrNone(
        queries.user.getUserById,
        [ req.user.id ]
      );

      if (user.user_type.toLowerCase() !== userType.toLowerCase()) {
        return ResponseTransformer.error(
          req,
          res,
          new Unauthorize('You are not authorized to perform this action')
        );
      }

      next();
    } catch (err) {
      return ResponseTransformer.error(
        req,
        res,
        new Unauthorize(
          'something went wrong while getting your client details'
        )
      );
    }
  });
