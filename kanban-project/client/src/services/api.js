const API_URL = 'http://localhost:5000/api';

export const api = {
    fetchBoard: async () => {
        const res = await fetch(`${API_URL}/board`);
        return res.json();
    },
    createTask: async (taskData) => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    updateTask: async (id, taskData) => {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    moveTask: async (id, column_id) => {
        const res = await fetch(`${API_URL}/tasks/${id}/move`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ column_id, position: 0 })
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    deleteTask: async (id) => {
        const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
        return res.json();
    },
    createColumn: async (colData) => {
        const res = await fetch(`${API_URL}/columns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(colData)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    }
};