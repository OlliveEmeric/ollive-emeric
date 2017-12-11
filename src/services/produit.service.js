"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "products",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "products.create" --title "" --description "" --price ""
		create: {
			params: {
				title: "string",
				description: "string",
				price: "number"
			},
			handler(ctx) {
				var product = new Models.Product(ctx.params).create();
				console.log("Products - create - ", product);
				if (product) {
					return Database()
						.then((db) => {
							return db.get("products")
								.push(product)
								.write()
								.then(() => {
									return product;
								})
								.catch(() => {
									return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Products", 417, "ERR_PRODUCT", { code: 417, message: "Product is not valid" } )
				}
			}
		},

		//	call "products.getAll"
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

		//	call "products.get" --id_product ""
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var product = db.get("products").find({ id_product: ctx.params.id_product }).value();;
								return product;
							})
							.catch(() => {
								return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Products", 404, "ERR_PRODUCT", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "products.verify" --id_product ""
		verify: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("products")
										.filter({ id_product: ctx.params.id_product })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "products.edit" --id_product "" --title "" --description "" --price ""
		edit: {
			params: {
				id_product: "string",
				title: "string",
				description: "string",
				price: "number"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.title = ctx.params.title || db_product.title;
							product.description = ctx.params.description || db_product.description;
							product.price = ctx.params.price || db_product.price;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product.id_product;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//call "products.increment" --id_product ""
		increment: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.quantity = db_product.quantity + 1;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return [product.id_product, product.quantity];
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "products.decrement" --id_product ""
		decrement: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.quantity = db_product.quantity - 1;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return [product.id_product,product.quantity];
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}

	}
};