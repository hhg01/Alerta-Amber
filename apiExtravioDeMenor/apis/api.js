var Arrow = require('arrow');

var TestAPI = Arrow.API.extend({
	group: 'reporteExtravioDeMenor',
	path: '/api/reporteExtravioDeMenor/:id',
	method: 'GET',
	description: 'this is an api that shows how to implement an API',
	model: 'reporteExtravioDeMenor',	
	parameters: {
		id: {description:'the test user id'}
	},
	action: function (req, resp, next) {
		// invoke the model find method passing the id parameter
		// stream the result back as response
		resp.stream(req.model.find, req.params.id, next);
	}
});

module.exports = TestAPI;