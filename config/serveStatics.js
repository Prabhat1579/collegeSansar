const express = require('express');
const path = require('path');

const serveStaticAssets = (app) => {
   const publicPath = path.join(__dirname, '..', 'public');
   app.use(express.static(publicPath));
};

module.exports = serveStaticAssets;
