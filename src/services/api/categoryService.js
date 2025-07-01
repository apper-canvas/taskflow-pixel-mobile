import categoriesData from '@/services/mockData/categories.json';

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  // Simulate API delay
  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  }

  async create(categoryData) {
    await this.delay();
    
    const newId = Math.max(...this.categories.map(c => c.Id), 0) + 1;
    const newCategory = {
      Id: newId,
      name: categoryData.name,
      color: categoryData.color || '#5B4FE9',
      order: categoryData.order || this.categories.length + 1,
      ...categoryData
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = { ...this.categories[index], ...updateData };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories.splice(index, 1);
    return true;
  }
}

export default new CategoryService();