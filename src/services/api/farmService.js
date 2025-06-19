import farmData from '../mockData/farms.json';

// Utility function to simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const farms = [...farmData];

const farmService = {
  async getAll() {
    try {
      await delay(300);
      return {
        success: true,
        data: [...farms],
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch farms'
      };
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const farm = farms.find(f => f.Id === id);
      if (!farm) {
        return {
          success: false,
          data: null,
          error: 'Farm not found'
        };
      }
      return {
        success: true,
        data: farm,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch farm'
      };
    }
  },

  async create(farmData) {
    try {
      await delay(500);
      const newFarm = {
        ...farmData,
        Id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      farms.push(newFarm);
      return {
        success: true,
        data: newFarm,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create farm'
      };
    }
  },

  async update(id, farmData) {
    try {
      await delay(400);
      const index = farms.findIndex(f => f.Id === id);
      if (index === -1) {
        return {
          success: false,
          data: null,
          error: 'Farm not found'
        };
      }
      
      const updatedFarm = {
        ...farms[index],
        ...farmData,
        updatedAt: new Date().toISOString()
      };
      farms[index] = updatedFarm;
      
      return {
        success: true,
        data: updatedFarm,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update farm'
      };
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const index = farms.findIndex(f => f.Id === id);
      if (index === -1) {
        return {
          success: false,
          data: null,
          error: 'Farm not found'
        };
      }
      
      const deletedFarm = farms.splice(index, 1)[0];
      return {
        success: true,
        data: deletedFarm,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to delete farm'
      };
    }
  }
};

export default farmService;