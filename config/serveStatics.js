const express = require('express');
const path = require('path');
const chalk = require('chalk');

const serveStaticAssets = (app) => {
   const publicPath = path.join(__dirname, '..', 'public');
   const uploadsPath = path.join(__dirname, '..', 'uploads');

   console.log(chalk.bold.blue(uploadsPath));

   app.use(express.static(publicPath));
   app.use('/uploads', express.static(uploadsPath));
};

module.exports = serveStaticAssets;
