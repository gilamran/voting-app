import { Router } from 'express';
import * as config from '../config';
import { getManifest } from './manifest-manager';

export function pagesRouter() {
  const router = Router({ mergeParams: true });

  router.get(`**`, async (_, res) => {
    const manifest = await getManifest();
    res.render('page.ejs', { manifest, APP_VERSION: config.APP_VERSION });
  });

  return router;
}
