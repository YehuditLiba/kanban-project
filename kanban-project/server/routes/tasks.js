const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/tasks - יצירת משימה חדשה עם בדיקת WIP
router.post('/', (req, res) => {
    const { title, description, column_id, priority, assignee, color_label } = req.body;

    // בדיקת WIP Limit
    const checkSql = `SELECT wip_limit, (SELECT COUNT(*) FROM tasks WHERE column_id = ?) as current_count 
                      FROM columns WHERE id = ?`;

    db.get(checkSql, [column_id, column_id], (err, row) => {
        if (row && row.wip_limit > 0 && row.current_count >= row.wip_limit) {
            return res.status(400).json({ error: `Column WIP limit (${row.wip_limit}) reached` });
        }

        const sql = `INSERT INTO tasks (title, description, column_id, priority, assignee, color_label) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [title, description, column_id, priority, assignee, color_label], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, ...req.body });
        });
    });
});

// PATCH /api/tasks/:id/move - הזזת משימה (מה שהיה לך קודם)
router.patch('/:id/move', (req, res) => {
    const { id } = req.params;
    const { column_id } = req.body;

    const checkSql = `SELECT c.wip_limit, (SELECT COUNT(*) FROM tasks WHERE column_id = ?) as current_count 
                      FROM columns c WHERE c.id = ?`;

    db.get(checkSql, [column_id, column_id], (err, row) => {
        if (err || !row) return res.status(500).json({ error: "Column not found" });
        if (row.wip_limit > 0 && row.current_count >= row.wip_limit) {
            return res.status(400).json({ error: `WIP limit reached!` });
        }

        db.run(`UPDATE tasks SET column_id = ? WHERE id = ?`, [column_id, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

// DELETE /api/tasks/:id - מחיקת משימה
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task deleted" });
    });
});
// PUT 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority, assignee } = req.body;
    const sql = `UPDATE tasks SET title = ?, description = ?, priority = ?, assignee = ? WHERE id = ?`;

    db.run(sql, [title, description, priority, assignee, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task updated successfully" });
    });
});

// DELETE 
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task deleted" });
    });
});
module.exports = router;