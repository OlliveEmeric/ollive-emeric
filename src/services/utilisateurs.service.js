"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = { 
	name: "utilisateurs",

	settings: {
 		state: {

 		}
	}, 

	actions: {

		//	call "utilisateurs.create" --email "" --lastName "" --firstName ""
		create: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				var utilisateur = new Models.Utilisateur(ctx.params).create();
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists == false) {
						console.log("Utilisateurs - create - ", utilisateur);
						if (utilisateur) {
							return Database()
								.then((db) => {
									return db.get("utilisateurs")
										.push(utilisateur)
										.write()
										.then(() => {
											return utilisateur;
										})
										.catch(() => {
											return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
										});
							});
						} else {
							return new MoleculerError("Utilisateurs", 417, "ERR_CRITIAL", { code: 417, message: "Utilisateur is not valid" } )
						}
					} else {
						return new MoleculerError("Utilisateurs", 409, "ERR_CRITIAL", { code: 409, message: "Utilisateur already exists" } )
					}		
				});
			}		
		},

		//	call "utilisateurs.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.values().__wrapped__;
					});
			}
		},


		//	call "utilisateurs.get" --email ""
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var utilisateur = db.get("utilisateurs").find({ email: ctx.params.email }).value();
								return utilisateur;
							})
							.catch(() => {
								return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateurs", 404, "ERR_CRITIAL", { code: 404, message: "Todo doesn't exists" } )
					}
				})
			}
		},

		//	call "utilisateurs.verify" --email ""
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateurs")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "utilisateurs.edit" --email "" --lastName "" --firstName ""
		edit: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.get", { email: ctx.params.email })
						.then((db_utilisateur) => {
							//
							var utilisateur = new Models.Utilisateur(db_utilisateur).create();
							utilisateur.lastName = ctx.params.lastName || db_utilisateur.lastName;
							utilisateur.firstName = ctx.params.firstName || db_utilisateur.firstName;
							//
							return Database()
								.then((db) => {
									return db.get("utilisateurs")
										.find({ email: ctx.params.email })
										.assign(utilisateur)
										.write()
										.then(() => {
											return utilisateur.email;
										})
										.catch(() => {
											return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}



	}
};
