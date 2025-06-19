const taskService = {
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
          { field: { Name: "crop_id" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        return { 
          success: false, 
          error: response.message || 'Failed to fetch tasks' 
        };
      }

      // Map database fields to UI expected format
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        farmId: task.farm_id,
        cropId: task.crop_id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority
      }));

      return { success: true, data: tasks };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch tasks' 
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
          { field: { Name: "crop_id" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success || !response.data) {
        return { 
          success: false, 
          error: response.message || 'Task not found' 
        };
      }

      // Map database fields to UI expected format
      const task = {
        Id: response.data.Id,
        farmId: response.data.farm_id,
        cropId: response.data.crop_id,
        title: response.data.title,
        description: response.data.description,
        dueDate: response.data.due_date,
        status: response.data.status,
        priority: response.data.priority
      };

      return { success: true, data: task };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch task' 
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
          { field: { Name: "crop_id" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } }
        ],
        where: [
          {
            FieldName: "farm_id",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        return { 
          success: false, 
          error: response.message || 'Failed to fetch tasks by farm' 
        };
      }

      // Map database fields to UI expected format
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        farmId: task.farm_id,
        cropId: task.crop_id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority
      }));

      return { success: true, data: tasks };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch tasks by farm' 
      };
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: taskData.title, // Using title as Name field
          farm_id: taskData.farmId,
          crop_id: taskData.cropId,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          status: taskData.status,
          priority: taskData.priority
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return { 
          success: false, 
          error: response.message || 'Failed to create task' 
        };
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return { 
            success: false, 
            error: failedRecords[0].message || 'Failed to create task' 
          };
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          // Map back to UI format
          const task = {
            Id: createdTask.Id,
            farmId: createdTask.farm_id,
            cropId: createdTask.crop_id,
            title: createdTask.title,
            description: createdTask.description,
            dueDate: createdTask.due_date,
            status: createdTask.status,
            priority: createdTask.priority
          };

          return { success: true, data: task };
        }
      }

      return { 
        success: false, 
        error: 'No data returned from server' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to create task' 
      };
    }
  },

  async update(id, taskData) {
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
          Name: taskData.title, // Using title as Name field
          farm_id: taskData.farmId,
          crop_id: taskData.cropId,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          status: taskData.status,
          priority: taskData.priority
        }]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return { 
          success: false, 
          error: response.message || 'Failed to update task' 
        };
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return { 
            success: false, 
            error: failedRecords[0].message || 'Failed to update task' 
          };
        }

        if (successfulRecords.length > 0) {
          const updatedTask = successfulRecords[0].data;
          // Map back to UI format
          const task = {
            Id: updatedTask.Id,
            farmId: updatedTask.farm_id,
            cropId: updatedTask.crop_id,
            title: updatedTask.title,
            description: updatedTask.description,
            dueDate: updatedTask.due_date,
            status: updatedTask.status,
            priority: updatedTask.priority
          };

          return { success: true, data: task };
        }
      }

      return { 
        success: false, 
        error: 'No data returned from server' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update task' 
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

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return { 
          success: false, 
          error: response.message || 'Failed to delete task' 
        };
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return { 
            success: false, 
            error: failedDeletions[0].message || 'Failed to delete task' 
          };
        }

        return { success: true, data: true };
      }

      return { 
        success: false, 
        error: 'No response from server' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to delete task' 
      };
    }
  }
};

export default taskService;