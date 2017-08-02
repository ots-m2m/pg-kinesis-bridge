const pg = require("pg");
const AWS = require("aws-sdk");

exports.run = function(pg_config, kinesis_config, channel, streamName) {
	const client = new pg.Client(pg_config);
	const kinesis = new AWS.Kinesis(kinesis_config);

	const onnotify = function(msg) {
		let params = {
			StreamName: streamName,
			PartitionKey: msg.channel,
			Data: msg.payload
		};
		kinesis.putRecord(params, function(err, data) {
			if (err) {
				console.error(err, err.stack);
			}
		});
	};

	/* Set up DB connection */
	return client.connect()
		.then(() => {
			client.on("notification", onnotify);

			/* Subscribe to channel(s) */
			return client.query("LISTEN " + channel); /* TODO: escaping */
		});
};
