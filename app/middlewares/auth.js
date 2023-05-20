import { asValue } from 'awilix';
import { inject } from 'awilix-express';
import ResponseTransformer from '../utils/ResponseTransformer';

module.exports = inject(
  ({ database, queries, helper, errors, userFactory }) => async (req, res, next) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
        return ResponseTransformer.error(
          req,
          res,
          new errors.Unauthorize('Invalid Bearer token')
        );
      }

      const token = bearerToken.split(' ')[1];

      let { data } = await helper.verifyToken(token);

      // const user = await database.query.oneOrNone(queries.user.getUserById, [
      //   data.id,
      // ]);

      const user = await userFactory.getUser(data.id);

      if (!user) {
        return ResponseTransformer.error(
          req,
          res,
          new errors.Unauthorize('Authorization fails')
        );
      }

      req.user = user;

      if(user.deactivate) {
        return ResponseTransformer.error(
          req,
          res,
          new errors.Unauthorize('Account is deactivated')
        );
      }

      req.container.register({
        currentUser: asValue(user),
      });

      next();
    } catch (err) {
      return ResponseTransformer.error(
        req,
        res,
        new errors.Unauthorize('Authorization Error')
      );
    }
  }
);
