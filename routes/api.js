var express = require('express');
var router = express.Router();
/* Import apis controllers */
var mapController = require('../controllers/map');


/* GET maps listing. */
router.post('/maps/', isLoggedIn, mapController.postMaps )
	.get('/maps/', isLoggedIn, mapController.getMaps )
	.get('/maps/:map_id', isLoggedIn, mapController.getMap )
	.get('/mapsuser/:user_id', isLoggedIn, mapController.getMapuser )
	.put('/maps/:map_id', isLoggedIn, mapController.putMap )
	.delete('/maps/:map_id', isLoggedIn, mapController.deleteMap );

router.get('/user/', isLoggedIn, function(req, res, next){
	res.json( {user:req.user} );
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/auth/');
}