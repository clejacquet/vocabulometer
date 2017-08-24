const mongoose = require('mongoose');

module.exports = (cb) => {
	mongoose.connect('mongodb://localhost/vocabnalyze');

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		const UserSchema = mongoose.Schema({
			name: String,
			words: [{
				word: String,
				time: Date
			}]
		});

		const User = mongoose.model('User', UserSchema);

		User.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId("59673bdd51e3cc2f885c37f4")
				}    
			},
			{
				$unwind: "$words"
			},
			{
				$project: {
					word: {
						value: "$words.word",
						time: "$words.time"
					}
				}
			},
			{
				$sort: {
					"word.time": -1
				}
			},
			{
				$group: {
					_id: "$word.value",
					times: {
						$push: "$word.time"
					},
					size: {
						$sum: 1
					}
				}
			},
			{
				$sort: {
					size: -1
				}
			}
		], cb)
	});
}