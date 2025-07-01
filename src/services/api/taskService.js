import tasksData from '@/services/mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await this.delay();
    
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1;
    const newTask = {
      Id: newId,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      categoryId: taskData.categoryId,
      createdAt: new Date().toISOString(),
      order: this.tasks.length + 1,
      ...taskData
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await this.delay();
    return this.tasks.filter(task => task.categoryId === categoryId.toString());
  }

  async toggleComplete(id) {
    await this.delay();
    
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.completed = !task.completed;
    return { ...task };
  }
}

export default new TaskService();