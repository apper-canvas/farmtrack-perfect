import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    try {
      await delay(300);
      const result = [...tasks];
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch tasks' };
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const task = tasks.find(t => t.Id === parseInt(id, 10));
      if (!task) {
        return { success: false, error: 'Task not found' };
      }
      return { success: true, data: { ...task } };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch task' };
    }
  },

  async getByFarmId(farmId) {
    try {
      await delay(250);
      const result = tasks.filter(t => t.farmId === parseInt(farmId, 10));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch tasks by farm' };
    }
  },

  async create(taskData) {
    try {
      await delay(400);
      const newTask = {
        ...taskData,
        Id: Math.max(...tasks.map(t => t.Id), 0) + 1
      };
      tasks.push(newTask);
      return { success: true, data: { ...newTask } };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create task' };
    }
  },

  async update(id, taskData) {
    try {
      await delay(400);
      const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (index === -1) {
        return { success: false, error: 'Task not found' };
      }
      const updatedTask = { ...tasks[index], ...taskData };
      tasks[index] = updatedTask;
      return { success: true, data: { ...updatedTask } };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update task' };
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (index === -1) {
        return { success: false, error: 'Task not found' };
      }
      tasks.splice(index, 1);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete task' };
    }
  }
};

export default taskService;