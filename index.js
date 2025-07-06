const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

app.get('/jobs', async (req, res) => {
  const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/jobs', async (req, res) => {
  const { title, company, description } = req.body;
  const result = await pool.query(
    'INSERT INTO jobs (title, company, description) VALUES ($1, $2, $3) RETURNING *',
    [title, company, description]
  );
  res.status(201).json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
