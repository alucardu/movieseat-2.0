var auth = require('./auth')

module.exports = function(app){

    app.post('/login', auth.authenticate);

};