const db = require("../db/connection")

class View {
    constructor(table = '') {
        this.table = table
        this.statement = `SELECT * FROM ${this.table} ORDER BY id`
    }
    getTable() {
        db.execute(
            this.statement, (err, results, fields) => {
                if (err) {
                    return console.log("There was an error with your request")
                }
                return console.log(results)
            }
        )
    }
}

module.exports = View