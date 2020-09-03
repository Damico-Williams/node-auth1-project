const knex = require("knex")
const knexfile = require("../knexfile")

module.exports = knex(knexfile.development) //added .development to remove error
                                            // knex: Required configuration option 'client' is missing.
