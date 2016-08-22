var auth = require('./auth')

module.exports = function(app){

    var index = require('.././routes/index');
    var movies = require('.././routes/movies');
    var authRouter = require('.././routes/authRoutes');

    app.use('/', index);
    app.use('/movies', movies);
    app.use('/auth', authRouter);

    app.post('/login', auth.authenticate);

};