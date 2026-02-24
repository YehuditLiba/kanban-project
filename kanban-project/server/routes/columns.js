const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/columns - יצירת עמודה חדשה (דרישה 1 במפרט)
router.post('/', (req, res) => {
    const { name, wip_limit, color } = req.body;

    // מציאת המיקום האחרון בלוח
    db.get("SELECT MAX(position) as maxPos FROM columns", (err, row) => {
        const nextPos = (row.maxPos || 0) + 1;

        const sql = `INSERT INTO columns (name, position, wip_limit, color) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, nextPos, wip_limit || 0, color || '#546fbe'], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, position: nextPos, wip_limit, color });
        });
    });
});

module.exports = router;