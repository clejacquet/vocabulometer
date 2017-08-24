const db = require('./db');

const f = (x) => {
	return -(Math.atan(1.5 * x - 3) / (3.1415 * 3 / 2)) + 0.5 + 0.25 * 2/3;
}

const score = (intervals) => {
	return intervals.reverse().reduce((acc, interval) => {
		return acc * f(interval) + 1;
	}, 0);
}

const dayIntervals = (times) => {
	return times.reduce((acc, time) => {
		let arr, last;
		[arr, last] = acc;
		arr.push((last - time) / (1000 * 60 * 60 * 24));

		return [ arr, time ];
	}, [ [], new Date() ])[0];
}

db((err, result) => {
	if (err) {
		return console.error(err);
	}

	scores = [];
	result.forEach(function(word) {
		scores.push({
			word: word._id,
			score: score(dayIntervals(word.times))
		});
	});

	scores.sort((a, b) => b.score - a.score).forEach(elem => console.log(elem.word + ': ' + elem.score));
})