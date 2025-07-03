// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'productivity-db';
const STORE_NAME = 'tasks';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const addTask = async (task) => {
  const db = await initDB();
  await db.put(STORE_NAME, task);
  return task;
};

export const getAllTasks = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getActiveTasks = async () => {
  const db = await initDB();
  const allTasks = await db.getAll(STORE_NAME);
  // 过滤掉已归档的任务
  return allTasks.filter(task => !task.archived);
};

export const updateTask = async (taskId, updates) => {
  const db = await initDB();
  const existingTask = await db.get(STORE_NAME, taskId);
  if (existingTask) {
    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await db.put(STORE_NAME, updatedTask);
    return updatedTask;
  }
  return null;
};

export const deleteTask = async (taskId) => {
  const db = await initDB();
  await db.delete(STORE_NAME, taskId);
};

export const getTasksByQuadrant = async (quadrant) => {
  const db = await initDB();
  const allTasks = await getActiveTasks();
  return allTasks
    .filter(task => task.quadrant === quadrant)
    .sort((a, b) => a.order - b.order);
};

export const getUnassignedTasks = async () => {
  const db = await initDB();
  const allTasks = await getActiveTasks();
  return allTasks
    .filter(task => task.quadrant === 'none')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getMaxOrderInQuadrant = async (quadrant) => {
  const tasks = await getTasksByQuadrant(quadrant);
  return tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;
};

export const updateTasksOrder = async (updates) => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  
  for (const update of updates) {
    const existingTask = await transaction.objectStore(STORE_NAME).get(update.id);
    if (existingTask) {
      const updatedTask = {
        ...existingTask,
        ...update,
        updatedAt: new Date().toISOString()
      };
      await transaction.objectStore(STORE_NAME).put(updatedTask);
    }
  }
  
  await transaction.complete;
};

export const toggleTaskCompleted = async (taskId) => {
  const db = await initDB();
  const existingTask = await db.get(STORE_NAME, taskId);
  if (existingTask) {
    const updatedTask = {
      ...existingTask,
      completed: !existingTask.completed,
      updatedAt: new Date().toISOString()
    };
    await db.put(STORE_NAME, updatedTask);
    return updatedTask;
  }
  return null;
};
