const cropService = {
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
          { field: { Name: "farm_id" } },
          { field: { Name: "variety" } },
          { field: { Name: "field_location" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: response.message || 'Failed to fetch crops'
        };
      }

      // Map database fields to UI expected format
      const crops = (response.data || []).map(crop => ({
        Id: crop.Id,
        farmId: crop.farm_id,
        name: crop.Name,
        variety: crop.variety,
        fieldLocation: crop.field_location,
        plantingDate: crop.planting_date,
        expectedHarvest: crop.expected_harvest,
        status: crop.status,
        notes: crop.notes
      }));

      return {
        success: true,
        data: crops,
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "variety" } },
          { field: { Name: "field_location" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.getRecordById('crop', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          error: response.message || 'Crop not found'
        };
      }

      // Map database fields to UI expected format
      const crop = {
        Id: response.data.Id,
        farmId: response.data.farm_id,
        name: response.data.Name,
        variety: response.data.variety,
        fieldLocation: response.data.field_location,
        plantingDate: response.data.planting_date,
        expectedHarvest: response.data.expected_harvest,
        status: response.data.status,
        notes: response.data.notes
      };

      return {
        success: true,
        data: crop,
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "variety" } },
          { field: { Name: "field_location" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        where: [
          {
            FieldName: "farm_id",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: response.message || 'Failed to fetch crops for farm'
        };
      }

      // Map database fields to UI expected format
      const crops = (response.data || []).map(crop => ({
        Id: crop.Id,
        farmId: crop.farm_id,
        name: crop.Name,
        variety: crop.variety,
        fieldLocation: crop.field_location,
        plantingDate: crop.planting_date,
        expectedHarvest: crop.expected_harvest,
        status: crop.status,
        notes: crop.notes
      }));

      return {
        success: true,
        data: crops,
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
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: cropData.name,
          farm_id: cropData.farmId,
          variety: cropData.variety,
          field_location: cropData.fieldLocation,
          planting_date: cropData.plantingDate,
          expected_harvest: cropData.expectedHarvest,
          status: cropData.status,
          notes: cropData.notes
        }]
      };

      const response = await apperClient.createRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: null,
          error: response.message || 'Failed to create crop'
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
            error: failedRecords[0].message || 'Failed to create crop'
          };
        }

        if (successfulRecords.length > 0) {
          const createdCrop = successfulRecords[0].data;
          // Map back to UI format
          const crop = {
            Id: createdCrop.Id,
            farmId: createdCrop.farm_id,
            name: createdCrop.Name,
            variety: createdCrop.variety,
            fieldLocation: createdCrop.field_location,
            plantingDate: createdCrop.planting_date,
            expectedHarvest: createdCrop.expected_harvest,
            status: createdCrop.status,
            notes: createdCrop.notes
          };

          return {
            success: true,
            data: crop,
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
        error: error.message || 'Failed to create crop'
      };
    }
  },

  async update(id, cropData) {
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
          Name: cropData.name,
          farm_id: cropData.farmId,
          variety: cropData.variety,
          field_location: cropData.fieldLocation,
          planting_date: cropData.plantingDate,
          expected_harvest: cropData.expectedHarvest,
          status: cropData.status,
          notes: cropData.notes
        }]
      };

      const response = await apperClient.updateRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: null,
          error: response.message || 'Failed to update crop'
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
            error: failedRecords[0].message || 'Failed to update crop'
          };
        }

        if (successfulRecords.length > 0) {
          const updatedCrop = successfulRecords[0].data;
          // Map back to UI format
          const crop = {
            Id: updatedCrop.Id,
            farmId: updatedCrop.farm_id,
            name: updatedCrop.Name,
            variety: updatedCrop.variety,
            fieldLocation: updatedCrop.field_location,
            plantingDate: updatedCrop.planting_date,
            expectedHarvest: updatedCrop.expected_harvest,
            status: updatedCrop.status,
            notes: updatedCrop.notes
          };

          return {
            success: true,
            data: crop,
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
        error: error.message || 'Failed to update crop'
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

      const response = await apperClient.deleteRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          data: false,
          error: response.message || 'Failed to delete crop'
        };
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return {
            success: false,
            data: false,
            error: failedDeletions[0].message || 'Failed to delete crop'
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
        data: false,
        error: 'No response from server'
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