import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const credentials = dotenv.parse(readFileSync('credentials.env'));

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
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

    connection.query(
        'SELECT id FROM users WHERE email = ? AND pass = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error querying the datase' });
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

app.post('/getData', (req, res) => {
    const { id } = req.body;

    connection.query(
        'SELECT vehicle, rent, grocery, entertainment, resturant  FROM user_data WHERE id = ?',
        [id],
        (err, results) => {
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

app.post('/saveData', (req, res) => {
    const { vehicle, rent, grocery, entertainment, resturant, id } = req.body;

    connection.query(
        'UPDATE user_data SET vehicle = ?, rent = ?, grocery = ?, entertainment = ?, resturant = ? WHERE id = ?',
        [vehicle, rent, grocery, entertainment, resturant, id],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error Updating Data' });
            } else {
                res.json({ message: 'Data Updated Successfully' });
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});