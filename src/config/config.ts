export default {
	app: {
		frontend: {
			baseUrl: 'https://main.d255kynncwqvj1.amplifyapp.com',
			accountSetup: '/accountSetup',
		},
		backend: {
			baseUrl: 'http://localhost:3001',
		},
	},
	email: {
		host: 'smtp.gmail.com',
		port: 587,
		fromEmail: 'chakradharkavalakuntla@gmail.com',
		secure: false,
		auth: {
			user: 'chakradharkavalakuntla@gmail.com',
			pass: 'nuqqgqtpajukbnkl',
		},
		logger: true,
	},
	jwtSecretKey: 'PhillyBestPizza',
};
