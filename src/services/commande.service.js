"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commandes",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "commandes.create" --id_utilisateur ""
		create: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				console.log("Commandes - create - ", commande);
				if (commande) {
					return Database()
						.then((db) => {
							return db.get("commandes")
								.push(commande)
								.write()
								.then(() => {
									return commande;
								})
								.catch(() => {
									return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Todos", 417, "ERR_CRITIAL", { code: 417, message: "Todo is not valid" } )
				}
			}
		},

		//	call "commandes.getAll"
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


		//	call "commandes.get" --id_commande ""
		getCommande: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id_commande: ctx.params.id_commande }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "Commandes doesn't exists" } )
					}
				})
			}
		},


		//	call "commandes.getUtilisateur" --id_utilisateur ""
		getUtilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyUtilisateur", { id_utilisateur: ctx.params.id_utilisateur })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commandeUser = db.get("commandes").map( "id_commande" ).value();;
								return commandeUser;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical_Error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "Commande Does Not Exists", { code: 404, message: "Commande Does Not Exists" } )
					}
				})
			}
		},

		//	call "commandes.verify" --id_commande
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_commande: ctx.params.id_commande })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.verifyUtilisateur" --id_utilisateur
		verifyUtilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_utilisateur: ctx.params.id_utilisateur })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

/*		//	call "todos.edit" --id_todo  --name --completed
		edit: {
			params: {
				id_todo: "string",
				name: "string",
				completed: "boolean"
			},
			handler(ctx) {
				return ctx.call("todos.get", { id_todo: ctx.params.id_todo })
						.then((db_todo) => {
							//
							var todo = new Models.Todo(db_todo).create();
							todo.name = ctx.params.name || db_todo.name;
							todo.completed = ctx.params.completed || false;
							//
							return Database()
								.then((db) => {
									return db.get("todos")
										.find({ id: ctx.params.id_todo })
										.assign(todo)
										.write()
										.then(() => {
											return todo;
										})
										.catch(() => {
											return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		} */


		//	call "commandes.increment" --id_commande "" --id_product ""
		increment: {
			params: {
				id_commande : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getCommande", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity + 1;
							
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande.quantity;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical_Error" } )
										});
								})
						})
			}
		},

		
		//	call "commandes.decrement" --id_commande "" --id_product ""
		decrement: {
			params: {
				id_commande : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getCommande", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity - 1;
							
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande.quantity;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical_Error" } )
										});
								})
						})
			}
		},

		//	call "commandes.validation" --id_commande ""
		validation: {
			params: {
				id_commande : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getCommande", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							
							var commande = new Models.Commande(db_commandes).create();
							commande.validation = "true" || db_commandes.validation;
							
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical_Error" } )
										});
								})
						})
			}
		}

	}
};