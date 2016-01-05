var express = require('express');
var router = express.Router();
/* Import apis controllers */
var mapController = require('../controllers/map');


/* GET maps listing. */
router.post('/maps/', mapController.postMaps )
	.get('/maps/', mapController.getMaps )
	.get('/maps/:map_id', mapController.getMap )
	.get('/mapsuser/:user_id', mapController.getMapuser )
	.put('/maps/:map_id', mapController.putMap )
	.delete('/maps/:map_id', mapController.deleteMap );

module.exports = router;