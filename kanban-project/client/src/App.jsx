import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filter, setFilter] = useState({ assignee: 'All', priority: 'All' });

  // Modal and Form States
  const [showModal, setShowModal] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '', description: '', column_id: 1, priority: 'medium', assignee: '', color_label: '#546fbe'
  });
  const [newCol, setNewCol] = useState({ name: '', wip_limit: 0, color: '#546fbe' });

  // Initial Data Fetch
  const fetchBoard = async () => {
    try {
      const data = await api.fetchBoard();
      setColumns(data.columns || []);
      setLoading(false);
    } catch (err) {
      console.error("Board fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoard(); }, []);

  // Filter Logic: Filtering tasks based on user selection
  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(task => {
      const matchAssignee = filter.assignee === 'All' || task.assignee === filter.assignee;
      const matchPriority = filter.priority === 'All' || task.priority === filter.priority;
      return matchAssignee && matchPriority;
    })
  }));

  // Unique list of assignees for the filter dropdown
  const allAssignees = [...new Set(columns.flatMap(c => c.tasks.map(t => t.assignee)).filter(Boolean))];

  // Column Handlers
  const handleAddColumn = async (e) => {
    e.preventDefault();
    try {
      await api.createColumn(newCol);
      setShowColModal(false);
      fetchBoard();
      setNewCol({ name: '', wip_limit: 0, color: '#546fbe' });
    } catch (err) { alert(err.error || "Error adding column"); }
  };

  // Task Handlers
  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateTask(newTask.id, newTask);
      } else {
        await api.createTask(newTask);
      }
      setShowModal(false);
      fetchBoard();
    } catch (err) {
      alert(err.error); // Show WIP Limit error from server
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.deleteTask(id);
      fetchBoard();
    } catch (err) { console.error("Delete error:", err); }
  };

  const onDrop = async (e, colId) => {
    const taskId = e.dataTransfer.getData('taskId');
    try {
      await api.moveTask(taskId, colId);
      fetchBoard();
    } catch (err) { alert(err.error); }
  };

  // UI Helpers
  const openAddModalForColumn = (colId) => {
    setNewTask({ title: '', description: '', column_id: colId, priority: 'medium', assignee: '', color_label: '#546fbe' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setNewTask(task);
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading board...</div>;

  return (
    <div className="board-container">
      {/* Header Section with Filters */}
      <div className="header">
        <h1>Kanban Board</h1>

        <div className="filters-group" style={{ display: 'flex', gap: '10px' }}>
          <select
            className="filter-select"
            value={filter.assignee}
            onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
          >
            <option value="All">All Assignees</option>
            {allAssignees.map(name => <option key={name} value={name}>{name}</option>)}
          </select>

          <select
            className="filter-select"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="All">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="actions-group">
          <button className="btn-secondary" onClick={() => setShowColModal(true)}>+ New Column</button>
          <button className="btn-primary" onClick={() => openAddModalForColumn(columns[0]?.id || 1)}>+ New Task</button>
        </div>
      </div>

      {/* Kanban Board Grid using filtered data */}
      <div className="board">
        {filteredColumns.map(col => (
          <div key={col.id} className="column" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, col.id)}>
            <div className="column-header">
              <h3>{col.name} ({col.tasks.length})</h3>
              <small>
                {col.wip_limit > 0 ? `WIP: ${col.tasks.length}/${col.wip_limit}` : 'WIP: ∞'}
              </small>
            </div>

            {/* WIP Status Bar */}
            <div
              style={{
                height: '4px',
                borderRadius: '2px',
                marginBottom: '15px',
                backgroundColor: col.wip_limit > 0 && col.tasks.length >= col.wip_limit ? '#ef4444' : col.color
              }}
            />

            <div className="task-list">
              {col.tasks.map(task => (
                <div
                  key={task.id}
                  className="card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                  style={{ borderLeft: `4px solid ${task.color_label || '#546fbe'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="task-title">{task.title}</div>
                    <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                      <span onClick={() => openEditModal(task)}>✏️</span>
                      <span onClick={() => deleteTask(task.id)}>🗑️</span>
                    </div>
                  </div>
                  <div className="task-desc">{task.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{
                      fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold',
                      ...priorityStyles[task.priority]
                    }}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>👤 {task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => openAddModalForColumn(col.id)}>
              + Add Task
            </button>
          </div>
        ))}
      </div>

      {/* Modals - Remain the same for CRUD functionality */}
      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSaveTask}>
            <h3>{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
            <input placeholder="Title" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            {!isEditing && (
              <select value={newTask.column_id} onChange={e => setNewTask({ ...newTask, column_id: parseInt(e.target.value) })}>
                {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input placeholder="Assignee" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
            <div className="actions-group" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showColModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleAddColumn}>
            <h3>Add New Column</h3>
            <input placeholder="Column Name" required value={newCol.name} onChange={e => setNewCol({ ...newCol, name: e.target.value })} />
            <input type="number" placeholder="WIP Limit" value={newCol.wip_limit} onChange={e => setNewCol({ ...newCol, wip_limit: parseInt(e.target.value) })} />
            <input type="color" value={newCol.color} style={{ height: '40px', padding: '2px' }} onChange={e => setNewCol({ ...newCol, color: e.target.value })} />
            <div className="actions-group" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn-primary">Add Column</button>
              <button type="button" className="btn-secondary" onClick={() => setShowColModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const priorityStyles = {
  high: { backgroundColor: '#fee2e2', color: '#991b1b' },
  medium: { backgroundColor: '#fef3c7', color: '#92400e' },
  low: { backgroundColor: '#dcfce7', color: '#166534' }
};