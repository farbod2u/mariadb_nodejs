// app.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// --- CRUD Operations ---

// CREATE
app.post('/personal', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query(
            'INSERT INTO personal (name, email, age) VALUES (?, ?, ?)',
            [name, email, age]
        );
        conn.release();
        res.status(201).json({ id: result.insertId, name, email, age });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ ALL
app.get('/personal', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM personal');
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ ONE
app.get('/personal/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM personal WHERE id = ?', [id]);
        conn.release();
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
app.put('/personal/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query(
            'UPDATE personal SET name = ?, email = ?, age = ? WHERE id = ?',
            [name, email, age, id]
        );
        conn.release();
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ id, name, email, age });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
app.delete('/personal/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM personal WHERE id = ?', [id]);
        conn.release();
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
