import { Router } from 'express';
import { acl } from '../db/acl';

export const routes = Router();

routes.use('/', async (req, res, next) => {
  const enforcer = await acl.getEnforcer();

  const { originalUrl: path, method } = req;
  console.log('path, method', path, method);

  if (enforcer.enforce(req.session.id, path, method)) {
    next();
  } else {
    res.status(403).json({ 403: 'Forbidden' });
    return;
  }
});
