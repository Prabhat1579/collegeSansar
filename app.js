const chalk = require('chalk');
const express = require('express');
const { PORT } = require('./config/env');
const db = require('./config/db');
const serveStaticAssets = require('./config/serveStatics');
const middlewareInits = require('./config/middlewareInits');

const app = express();

db.connect();
db.sequelize.sync();
middlewareInits(app);
serveStaticAssets(app);

app.use('/', require('./routes/client'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => {
   console.log(chalk.bold.yellow(`server running in port ${PORT}`));
});

