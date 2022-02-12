const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const CONFIG = require('./config/config');
const {
	REDIS_PORT,
	PORT,
	SESSION_SECRET,
	REDIS_URL,
	MONGO_USER,
	MONGO_PASS,
	MONGO_HOST,
	MONGO_PORT,
} = CONFIG;

const mongoConnectionString = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/app?authSource=admin`;
const redisConnectionString = `redis://${REDIS_URL}:${REDIS_PORT}`;

const { createClient } = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = createClient({
	url: redisConnectionString,
	legacyMode: true,
});

const connectMongoWithRetry = async () => {
	try {
		console.log('Mongo connection string:', mongoConnectionString);
		await mongoose.connect(mongoConnectionString);
		console.log('Successfully connected to mongo.');
	} catch (error) {
		console.log(error);
		setTimeout(connectMongoWithRetry, 5000);
	}
};

const connectToRedisWithRetry = async () => {
	try {
		console.log('Redis connection string:', redisConnectionString);
		await redisClient.connect();
		console.log('Successfully connected to redis.');
	} catch (error) {
		console.log(error);
		setTimeout(connectToRedisWithRetry, 5000);
	}
};

connectMongoWithRetry();
connectToRedisWithRetry();

app.enable('trust proxy');
app.use(cors());
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: SESSION_SECRET,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 30000,
		},
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.json());
app.get('/api/v1/test', (req, res) => {
	console.log('Running...');
	res.send('<h1>Hello</h1>');
});
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
