const express = require('express');
const router = express.Router();
const url = require('url');

module.exports = (server) => {

	router.get('/courses', (req, res, next) => {
		let url_parts = url.parse(req.originalUrl, true),
			query = url_parts.query,
			from = query.start,
			to = +query.start + +query.count,
			sort = query.sort,
			queryStr = query.query,
			courses = server.db.getState().courses;
		if (queryStr) {
			courses = courses.filter(item => item.name.toLowerCase().indexOf(queryStr.toLowerCase()) > -1);
		}

		const total = courses.length;
		if (total < to) {
			to = total;
		}
		courses = courses.slice(from, to);

		res.json({
			courses: courses,
			total: total,
		});
	});

	router.get('/courses/authors', (req, res, next) => {
		let dbState = server.db.getState();
		let authors = dbState.courses.reduce(
			(result, item) => result.concat(item.authors), []);

		res.json(authors);
	});

	return router;
};
