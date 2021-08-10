const express = require('express')
const mysql = require('mysql')
const fake = require('faker');
const app = express()
const port = 3000

const config = {
    host: 'db-app',
    user: 'root',
    password: 'root',
    database: 'database-app'
}

const conn = mysql.createConnection(config)
conn.query(
    `
    CREATE TABLE IF NOT EXISTS PEOPLE (
        ID INT NOT NULL AUTO_INCREMENT,
        NAME VARCHAR(100),
        PRIMARY KEY(ID)
    )
    `
)
conn.end()

const selectAllPeople = `
    SELECT PPL.* 
      FROM PEOPLE PPL
     ORDER BY PPL.NAME ASC
`

function insertPeople(name) {
    return `INSERT INTO PEOPLE(NAME) VALUES ('${name}')`
}

app.get('/', (req, res) => {

    let tableDataPeople = '';

    const conn = mysql.createConnection(config)
    conn.query(insertPeople(fake.name.findName()))

    conn.query(selectAllPeople, function (err, result, fields) {

        if (err) {
            throw err;
        }

        if (result) {
            result.forEach(people => {
                tableDataPeople +=
                    `<tr>
                        <td>${people.ID}</td>
                        <td>${people.NAME}</td>
                    </tr>`
            });
        }

        res.send(
            `<h1>Full Cycle Rocks!</h1>
            <table>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                </tr>
                ${tableDataPeople}
            </table>`
        );

    })
    conn.end()

})

app.listen(port, () => {
    console.log('Server Running on Port: ' + port);
})