const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
    const sql = `
        SELECT c.id as col_id, c.name as col_name, c.wip_limit, c.color as col_color,
               t.id as task_id, t.title, t.description, t.priority, t.column_id, t.assignee, t.color_label
        FROM columns c
        LEFT JOIN tasks t ON c.id = t.column_id
        ORDER BY c.position, t.position
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const board = rows.reduce((acc, row) => {
            let col = acc.find(c => c.id === row.col_id);
            if (!col) {
                col = { id: row.col_id, name: row.col_name, wip_limit: row.wip_limit, color: row.col_color, tasks: [] };
                acc.push(col);
            }
            if (row.task_id) {
                col.tasks.push({
                    id: row.task_id, title: row.title, description: row.description,
                    priority: row.priority, assignee: row.assignee, color_label: row.color_label
                });
            }
            return acc;
        }, []);
        res.json({ columns: board });
    });
});

module.exports = router;