import { seedService } from '../services/SeedServices';
import { Request, Response, Router } from 'express';

export const router = Router();

router.get('/test-data', (req: Request, res: Response) => {
  seedService.populateDBWithData().then(result => {
    return res.send(result);
  })
    .catch((error: Error) => {
      console.error(error);
      return res.status(409).send(error);
    });
});
