import express from 'express'
import compression from 'compression';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import cors from 'cors';
import { db } from './db';

process.env.APP_ENV && dotenv.config({ path: process.env.APP_ENV });
console.log('APP_ENV::', process.env.APP_ENV);
console.log('APP_PORT::', process.env.APP_PORT);
console.log('APP_SECRET::', process.env.APP_SECRET);
console.log('DATABASE_DB::', process.env.DATABASE_DB);
console.log('DATABASE_USER::', process.env.DATABASE_USER);
console.log('DATABASE_PASS::', process.env.DATABASE_PASS);
console.log('DATABASE_HOST::', process.env.DATABASE_HOST);
console.log('DATABASE_PORT::', process.env.DATABASE_PORT);



import { routes as usersRouter } from './routes/UsersRouter';
import { routes as groupRouter } from './routes/GroupsRouter';
import { routes as registerRouter } from './routes/RegisterandAuthorizationRouter';
import { routes as authMiddlewareRouter } from './routes/AuthMiddlewareRouter';
import { routes as aCLMidlewareRouter } from './routes/ACLMidlewareRouter';
import { acl } from './db/acl';
import { UserAttributes } from './db/models/UserModel';
import { UserService } from './services/userService';
import { GroupAttributes } from './db/models/GroupModel';
import { GroupService } from './services/groupService';
import { router as seedRouter } from './routes/SeedRouter';



const app = express();

db.sequelize.sync().then(async () => {
  console.log(`Database & tables created!`)
  const super_User: UserAttributes = {
    firstName: process.env.APP_SUPER_USER || 'super_user',
    lastName: process.env.APP_SUPER_USER || 'super_user',
    password: process.env.APP_SUPER_PASS || 'super_user',
    email: process.env.APP_SUPER_USER || 'super_user@mail.ru'
  };
  try {
    const dbUser = await UserService.createUser(super_User);
    console.log('Super User Created');

    const Group: GroupAttributes = {
      name: "superAdmin",
      methods: "*",
      users: [<UserAttributes>dbUser.id]
    };
    await GroupService.createGroup(Group);
  } catch (error) {
    console.log('Superuser already exists');

  }
})

app.set('port', process.env.APP_PORT || 3004);
app.set('superSecret', process.env.APP_SECRET);

app.use(morgan('dev'));

app.use(cors());

app.options('*', cors());

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/syncacl', function (req, res) {
  acl.sync().then(() => {
    res.send({ message: 'ACL Synched Success!!' });
  });
});

app.get('/', (req, res) => res.send('Hello'))

app.use('/', registerRouter);
app.use('/seed', seedRouter);


app.use('/api', authMiddlewareRouter);
app.use('/api', aCLMidlewareRouter);

app.use('/api/user', usersRouter);
app.use('/api/group', groupRouter);

export default app;
