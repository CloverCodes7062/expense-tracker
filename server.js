import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { exec } from 'child_process';

dotenv.config();

const credentials = dotenv.parse(readFileSync('credentials.env'));

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 0,
    host: credentials.DB_HOST,
    user: credentials.DB_USER,
    password: credentials.DB_PASSWORD,
    database: credentials.DB_DATABASE,
    ssl: {
        mode: 'require',
    },
});

app.post('/checkCredentials', (req, res) => {
    const { email, password } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting database connection' });
            return;
        }

        connection.query(
            'SELECT id FROM users WHERE email = ? AND pass = ?',
            [email, password],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error querying the database' });
                } else {
                    if (results.length > 0) {
                        res.json({ message: 'Credentials are valid', id: results[0].id });
                    } else {
                        res.status(401).json({ message: 'Invalid credentials' });
                    }
                }
            }
        );
    });
});

app.post('/getData', (req, res) => {
    const { id } = req.body;

    pool.getConnection((err, connection) => {

        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting database connection' });
            return;
        }

        connection.query(
            'SELECT vehicle, rent, grocery, entertainment, resturant  FROM user_data WHERE id = ?',
            [id],
            (err, results) => {
                connection.release();

                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error querying the datase' });
                } else {
                    if (results.length > 0) {
                        res.json({ 
                            message: 'Data Retreived Successfully',
                            vehicle: results[0].vehicle,
                            rent: results[0].rent,
                            grocery: results[0].grocery,
                            entertainment: results[0].entertainment,
                            resturant: results[0].resturant,
                        });
                    } else {
                        res.status(401).json({ message: 'Error Retreiving Data' });
                    }
                }
            }
        );    
    });
});

app.post('/saveData', (req, res) => {
    const { vehicle, rent, grocery, entertainment, resturant, id } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting database connection' });
            return;
        }

        connection.query(
            'UPDATE user_data SET vehicle = ?, rent = ?, grocery = ?, entertainment = ?, resturant = ? WHERE id = ?',
            [vehicle, rent, grocery, entertainment, resturant, id],
            (err) => {
                connection.release();

                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Error Updating Data' });
                } else {
                    res.json({ message: 'Data Updated Successfully' });
                }
            }
        );

    });

});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting database connection' });
            return;
        }

        connection.query(
            'SELECT COUNT(*) AS count FROM users',
            (err, results) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    res.status(500).json({ message: 'Error Generating New ID' });
                    return;
                } else {
                    const id = results[0].count + 1;
                    connection.query(
                        'INSERT INTO users (id, email, pass) VALUES (?, ?, ?)',
                        [id, email, password],
                        (err) => {
                            if (err) {
                                console.error(err);
                                connection.release();
                                res.status(500).json({ message: 'Invalid Email or Passowrd' });
                                return;
                            } else {
                                res.json({ message: 'Sign Up Successful', id: id });
                            }
                        }
                    );

                    connection.query(
                        'INSERT INTO user_data (id, vehicle, rent, grocery, entertainment, resturant) VALUES (?, ?, ?, ?, ?, ?)',
                        [id, 500, 900, 400, 200, 150],
                        (err) => {
                            connection.release();

                            if (err) {
                                console.error(err);
                                res.status(500).json({ message: 'Error Adding User Data' });
                            } else {
                                const serverProcess = exec('node server.js');

                                serverProcess.on('close', (code) => {
                                    console.log(`Server process exited with code ${code}`);
                                });

                                res.json({ message: 'Successfully Added User Data', id: id});
                            }
                        }
                    );
                }
            }
        );
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});