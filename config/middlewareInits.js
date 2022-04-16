const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const { SECRET_KEY } = require('./env');

const middlewareInits = (app) => {
   app.use(morgan('common'));
   app.use(helmet());
   app.use(cors());
   app.use(
      session({
         secret: SECRET_KEY,
         resave: false,
         saveUninitialized: true,
      })
   );
   app.use(compression());
   app.use(bodyParser.urlencoded({ extended: true }));

   app.set('view engine', 'hbs');
};

module.exports = middlewareInits;
