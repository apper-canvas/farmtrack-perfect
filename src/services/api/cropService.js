import cropData from '../mockData/crops.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let crops = [...cropData];

const cropService = {
  async getAll() {
    try {
      await delay(300);
      return {
        success: true,
        data: [...crops],
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch crops'
      };
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const crop = crops.find(c => c.Id === parseInt(id, 10));
      if (!crop) {
        throw new Error('Crop not found');
      }
      return {
        success: true,
        data: { ...crop },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch crop'
      };
    }
  },

  async getByFarmId(farmId) {
    try {
      await delay(250);
      const farmCrops = crops.filter(c => c.farmId === parseInt(farmId, 10));
      return {
        success: true,
        data: farmCrops,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch crops for farm'
      };
    }
  },

  async create(cropData) {
    try {
      await delay(400);
      const newCrop = {
        ...cropData,
        Id: Math.max(...crops.map(c => c.Id), 0) + 1
      };
      crops.push(newCrop);
      return {
        success: true,
        data: { ...newCrop },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create crop'
      };
    }
  },

  async update(id, cropData) {
    try {
      await delay(400);
      const index = crops.findIndex(c => c.Id === parseInt(id, 10));
      if (index === -1) {
        throw new Error('Crop not found');
      }
      const updatedCrop = { ...crops[index], ...cropData };
      crops[index] = updatedCrop;
      return {
        success: true,
        data: { ...updatedCrop },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update crop'
      };
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const index = crops.findIndex(c => c.Id === parseInt(id, 10));
      if (index === -1) {
        throw new Error('Crop not found');
      }
      crops.splice(index, 1);
      return {
        success: true,
        data: true,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error.message || 'Failed to delete crop'
      };
    }
  }
};

export default cropService;