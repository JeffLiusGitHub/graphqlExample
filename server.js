const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const app = express();

// ID String Int Float Boolean List - []

let message = 'This is a message';

const schema = buildSchema(`

    type Post {
        userId:Int
        id:Int
        title:String
        body:String
    }

    type User {
        name:String
        age: Int
        college:String
    }

    type Query {
        hello:String!
        welcomeMessage(name:String,dayOfWeek:String!):String
        getUser:User
        getUsers:[User]
        getPostsFromJSPlaceHolder:[Post]
        message:String
    }

    input UserInput{
        name:String!
        age:Int!
        college:String!
    }

    type Mutation {
        setMessage(newMessage:String):String
        createUser(user:UserInput):User

    }
`);

const root = {
	hello: () => {
		return 'Hello World';
		// return null;
	},
	welcomeMessage: (args) => {
		// console.log(args);
		return `hey yo! ${args.name} today is ${args.dayOfWeek}`;
	},
	getUser: () => {
		const user = {
			name: 'Jeff',
			age: 30,
			college: 'Monash',
		};
		return user;
	},
	getUsers: () => {
		const users = [
			{
				name: 'Jeff',
				age: 30,
				college: 'Monash',
			},
			{
				name: 'Jasmine',
				age: 23,
				college: 'CDU',
			},
		];
		return users;
	},
	getPostsFromJSPlaceHolder: async () => {
		const result = await axios.get(
			'https://jsonplaceholder.typicode.com/posts'
		);
		return result.data;
	},
	setMessage: ({ newMessage }) => {
		message = newMessage;
		return message;
	},
	message: () => {
		return message;
	},
	createUser: (args) => {
		console.log(args);
		return args.user;
	},
};

app.use(
	'/graphql',
	graphqlHTTP({
		graphiql: true,
		schema: schema,
		rootValue: root,
	})
);

app.listen(8080, () => console.log('server is running!'));
