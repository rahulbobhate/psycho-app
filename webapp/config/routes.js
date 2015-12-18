var facebook = require('../controller/facebook');

module.exports = function(app, passport) {
  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_likes', 'user_posts'] }));
     
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      var data = req.user;
      delete data.id
      console.log(req.user)
      res.send(data)
  });

  app.get('/fetchLikes', facebook.fetchLikes)

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}