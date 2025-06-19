import farmData from '../mockData/farms.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let farms = [...farmData];

const farmService = {
  async getAll() {
    await delay(300);
    return [...farms];
  },

  async getById(id) {
    await delay(200);
    const farm = farms.find(f => f.Id === parseInt(id, 10));
    if (!farm) {
      throw new Error('Farm not found');
    }
    return { ...farm };
  },

  async create(farmData) {
    await delay(400);
    const newFarm = {
      ...farmData,
      Id: Math.max(...farms.map(f => f.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay(400);
    const index = farms.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Farm not found');
    }
    const updatedFarm = { ...farms[index], ...farmData };
    farms[index] = updatedFarm;
    return { ...updatedFarm };
  },

  async delete(id) {
    await delay(300);
    const index = farms.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Farm not found');
    }
    farms.splice(index, 1);
    return true;
  }
};

export default farmService;