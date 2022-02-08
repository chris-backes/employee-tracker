const cTable = require("console.table");
const mysql = require("mysql2");
const db = require("./db/connection");
const prompt = require('./utils/prompt')
const redirectQuestion = require("./utils/redirectQuestion");



prompt()
.then((data) => {
    return redirectQuestion(data.options);
})
.catch(err => {
    console.log(err);
});
