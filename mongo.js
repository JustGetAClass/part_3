const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://JOJOWICK:${password}@fullstack.smq0mze.mongodb.net/phoneBook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
});

if (process.argv.length === 3) {
	console.log("phonebook:");
	Person.find({}).then((persons) => {
		persons.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
} else {
	person.save().then((result) => {
		console.log(
			`added ${process.argv[3]} number ${process.argv[4]} to phonebook`
		);
		mongoose.connection.close();
	});
}
