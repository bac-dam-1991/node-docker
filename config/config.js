module.exports = {
	PORT: process.env.PORT || 3000,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASS: process.env.MONGO_PASS,
	MONGO_HOST: process.env.MONGO_HOST || 'mongo',
	MONGO_PORT: process.env.MONGO_PORT,
	NODE_ENV: process.env.NODE_ENV,
	APP_NAME: process.env.APP_NAME,
	NODE_ENV: process.env.NODE_ENV,
	REDIS_URL: process.env.REDIS_URL || 'redis',
	REDIS_PORT: process.env.REDIS_PORT || 6379,
	SESSION_SECRET: process.env.SESSION_SECRET,
};
