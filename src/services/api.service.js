"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/status/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/api/v1/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					"POST user": "utilisateurs.create",
					"GET user/:email": "utilisateurs.get",
					"PATCH user/:email": "utilisateurs.edit",
					"POST product": "products.create",
					"GET product/:id_product": "products.get",
					"PATCH product/:id_product": "products.edit",
					"PATCH product/:id_product/increment": "products.increment",
					"PATCH product/:id_product/decrement": "products.decrement",
					"POST order/user/:id_utilisateur": "commandes.create",
					"GET order/:id_commande": "commandes.get",
					"GET order/user/:id_utilisateur": "commandes.getUtilisateur",
					"PATCH order/:id_commande/product/:id_product/increment": "commandes.increment",
					"PATCH order/:id_commande/product/:id_product/decrement": "commandes.decrement",
					"PATCH order/:id_commande" : "commandes.validation"

				}
			}
		]

	}
};
