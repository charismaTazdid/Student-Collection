import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'first_db',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Server Successfully Connected with Database")
})

// CREATE USER
app.post('/users', (req, res) => {
    let user = req.body;
    const sql = "SET @user_id = ?;SET @user_name = ?;SET @user_email = ?;SET @phone_id = ?;  CALL userAddOrEdit(@user_id, @user_name, @user_email, @phone_id); ";
    mysqlConnection.query(sql, [user.user_id, user.user_name, user.user_email, user.phone_id], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('New User ID is :: ' + element[0].user_id);
            });
        else
            console.log(err);
    })
});

// READ USERs DATA
app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM userdetails', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// READ SINGLE USER BY ID
app.get('/users/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM userdetails WHERE user_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//UPDATE USER
app.put('/users', (req, res) => {
    let user = req.body;
    const sql = "SET @user_id = ?;SET @user_name = ?;SET @user_email = ?;SET @phone_id = ?; CALL userAddOrEdit(@user_id,@user_name,@user_email,@phone_id);";
    mysqlConnection.query(sql, [user.user_id, user.user_name, user.user_email, user.phone_id], (err, rows, fields) => {
        if (!err)
            res.send('User Details Updated Successfully');
        else
            console.log(err);
    })
});








const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`))