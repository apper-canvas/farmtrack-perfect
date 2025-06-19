const farmService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } },
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('farm', params);
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: response.message || 'Failed to fetch farms'
        };
      }

      // Map database fields to UI expected format
      const farms = (response.data || []).map(farm => ({
        Id: farm.Id,
        name: farm.Name,
        location: farm.location,
        size: farm.size,
        sizeUnit: farm.size_unit,
        createdAt: farm.created_at
      }));

      return {
        success: true,
        data: farms,
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } },
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.getRecordById('farm', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          error: response.message || 'Farm not found'
        };
      }

      // Map database fields to UI expected format
      const farm = {
        Id: response.data.Id,
        name: response.data.Name,
        location: response.data.location,
        size: response.data.size,
        sizeUnit: response.data.size_unit,
        createdAt: response.data.created_at
      };

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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: farmData.name,
          location: farmData.location,
          size: farmData.size,
          size_unit: farmData.sizeUnit,
          created_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: null,
          error: response.message || 'Failed to create farm'
        };
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return {
            success: false,
            data: null,
            error: failedRecords[0].message || 'Failed to create farm'
          };
        }

        if (successfulRecords.length > 0) {
          const createdFarm = successfulRecords[0].data;
          // Map back to UI format
          const farm = {
            Id: createdFarm.Id,
            name: createdFarm.Name,
            location: createdFarm.location,
            size: createdFarm.size,
            sizeUnit: createdFarm.size_unit,
            createdAt: createdFarm.created_at
          };

          return {
            success: true,
            data: farm,
            error: null
          };
        }
      }

      return {
        success: false,
        data: null,
        error: 'No data returned from server'
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name,
          location: farmData.location,
          size: farmData.size,
          size_unit: farmData.sizeUnit
        }]
      };

      const response = await apperClient.updateRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: null,
          error: response.message || 'Failed to update farm'
        };
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return {
            success: false,
            data: null,
            error: failedRecords[0].message || 'Failed to update farm'
          };
        }

        if (successfulRecords.length > 0) {
          const updatedFarm = successfulRecords[0].data;
          // Map back to UI format
          const farm = {
            Id: updatedFarm.Id,
            name: updatedFarm.Name,
            location: updatedFarm.location,
            size: updatedFarm.size,
            sizeUnit: updatedFarm.size_unit,
            createdAt: updatedFarm.created_at
          };

          return {
            success: true,
            data: farm,
            error: null
          };
        }
      }

      return {
        success: false,
        data: null,
        error: 'No data returned from server'
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('farm', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: null,
          error: response.message || 'Failed to delete farm'
        };
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return {
            success: false,
            data: null,
            error: failedDeletions[0].message || 'Failed to delete farm'
          };
        }

        return {
          success: true,
          data: true,
          error: null
        };
      }

      return {
        success: false,
        data: null,
        error: 'No response from server'
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