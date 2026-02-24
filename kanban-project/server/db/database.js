const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'kanban.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS tasks");
    db.run("DROP TABLE IF EXISTS columns");

    db.run(`CREATE TABLE columns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position INTEGER NOT NULL,
        wip_limit INTEGER DEFAULT 0,
        color TEXT DEFAULT '#546fbe',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        column_id INTEGER REFERENCES columns(id),
        position INTEGER NOT NULL DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        assignee TEXT,
        color_label TEXT DEFAULT '#546fbe',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed columns exactly from spec
    const colStmt = db.prepare("INSERT INTO columns (name, position, wip_limit, color) VALUES (?, ?, ?, ?)");
    colStmt.run('Todo', 0, 0, '#64748b');
    colStmt.run('In Progress', 1, 3, '#3b82f6');
    colStmt.run('Review', 2, 2, '#f59e0b');
    colStmt.run('Done', 3, 0, '#22c55e');
    colStmt.finalize();

    // Seed tasks exactly from spec table
    const taskStmt = db.prepare("INSERT INTO tasks (title, description, column_id, position, priority, assignee, color_label) VALUES (?, ?, ?, ?, ?, ?, ?)");
    taskStmt.run('Setup project', 'Init repo and dependencies', 4, 0, 'high', 'David', '#ef4444');
    taskStmt.run('Design API', 'Define REST endpoints', 3, 0, 'high', 'Sarah', '#8b5cf6');
    taskStmt.run('Build auth', 'JWT login system', 2, 0, 'medium', 'David', '#3b82f6');
    taskStmt.run('Write tests', 'Unit + integration tests', 1, 0, 'low', 'Mike', '#22c55e');
    taskStmt.run('Deploy to prod', 'CI/CD pipeline', 1, 1, 'medium', 'Sarah', '#f59e0b');
    taskStmt.finalize();

    console.log("Database initialized with exact specification data.");
});

module.exports = db;