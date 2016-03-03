var express = require('express');
var app = express();
var port = Number(process.env.PORT || 3000);
app.use(express.static(__dirname + '/'));
app.listen(port, function() {
    console.log('Servidor iniciado en: http://localhost:' + port);
});