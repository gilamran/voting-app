import * as express from 'express';
import * as path from 'path';
import * as config from './config';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

const app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(staticsRouter());
app.use(pagesRouter());

app.listen(config.SERVER_PORT, () => {
  console.log(`App listening on port ${config.SERVER_PORT}!`);
});