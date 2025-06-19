import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import CropTable from '@/components/organisms/CropTable';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Badge from '@/components/atoms/Badge';
import { cropService, farmService } from '@/services';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: '',
    name: '',
    variety: '',
    fieldLocation: '',
    plantingDate: '',
    expectedHarvest: '',
    status: 'planted',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [cropsResponse, farmsResponse] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      
      // Handle service responses properly
      if (cropsResponse.success && farmsResponse.success) {
        setCrops(Array.isArray(cropsResponse.data) ? cropsResponse.data : []);
        setFarms(Array.isArray(farmsResponse.data) ? farmsResponse.data : []);
      } else {
        const errorMsg = cropsResponse.error || farmsResponse.error || 'Failed to load data';
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err.message || 'Failed to load crops');
      toast.error('Failed to load crops');
      // Set empty arrays as fallback
      setCrops([]);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.fieldLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmId) errors.farmId = 'Farm selection is required';
    if (!formData.name.trim()) errors.name = 'Crop name is required';
    if (!formData.variety.trim()) errors.variety = 'Variety is required';
    if (!formData.fieldLocation.trim()) errors.fieldLocation = 'Field location is required';
    if (!formData.plantingDate) errors.plantingDate = 'Planting date is required';
    if (!formData.expectedHarvest) errors.expectedHarvest = 'Expected harvest date is required';
    
    // Validate dates
    if (formData.plantingDate && formData.expectedHarvest) {
      const plantingDate = new Date(formData.plantingDate);
      const harvestDate = new Date(formData.expectedHarvest);
      
      if (harvestDate <= plantingDate) {
        errors.expectedHarvest = 'Harvest date must be after planting date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10)
      };

      if (editingCrop) {
        const response = await cropService.update(editingCrop.Id, cropData);
        if (response.success && response.data) {
          setCrops(prevCrops => 
            Array.isArray(prevCrops) 
              ? prevCrops.map(c => c.Id === editingCrop.Id ? response.data : c)
              : [response.data]
          );
          toast.success('Crop updated successfully');
        } else {
          throw new Error(response.error || 'Failed to update crop');
        }
      } else {
        const response = await cropService.create(cropData);
        if (response.success && response.data) {
          setCrops(prevCrops => 
            Array.isArray(prevCrops) 
              ? [...prevCrops, response.data]
              : [response.data]
          );
          toast.success('Crop added successfully');
        } else {
          throw new Error(response.error || 'Failed to create crop');
        }
      }

      resetForm();
    } catch (err) {
      toast.error(err.message || (editingCrop ? 'Failed to update crop' : 'Failed to add crop'));
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId.toString(),
      name: crop.name,
      variety: crop.variety,
      fieldLocation: crop.fieldLocation,
      plantingDate: format(new Date(crop.plantingDate), 'yyyy-MM-dd'),
      expectedHarvest: format(new Date(crop.expectedHarvest), 'yyyy-MM-dd'),
      status: crop.status,
      notes: crop.notes || ''
    });
    setShowAddForm(true);
  };

const handleDelete = async (crop) => {
    if (window.confirm(`Are you sure you want to delete ${crop.name} (${crop.variety})?`)) {
      try {
        const response = await cropService.delete(crop.Id);
        if (response.success) {
          setCrops(prevCrops => 
            Array.isArray(prevCrops) 
              ? prevCrops.filter(c => c.Id !== crop.Id)
              : []
          );
          toast.success('Crop deleted successfully');
        } else {
          throw new Error(response.error || 'Failed to delete crop');
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete crop');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: '',
      name: '',
      variety: '',
      fieldLocation: '',
      plantingDate: '',
      expectedHarvest: '',
      status: 'planted',
      notes: ''
    });
    setFormErrors({});
    setEditingCrop(null);
    setShowAddForm(false);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  const statusOptions = [
    { value: 'planted', label: 'Planted' },
    { value: 'growing', label: 'Growing' },
    { value: 'ready', label: 'Ready to Harvest' },
    { value: 'harvested', label: 'Harvested' }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-64"></div>
        </div>
        <SkeletonLoader count={1} type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crops</h1>
          <p className="text-gray-600">
            Track your planted crops and monitor their growth progress
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(true)}
          disabled={farms.length === 0}
        >
          Add Crop
        </Button>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No farms available"
          description="You need to add a farm before you can track crops"
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <SearchBar
              placeholder="Search crops by name, variety, or field..."
              onSearch={setSearchTerm}
              className="flex-1 max-w-md"
            />
            
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Status' },
                { key: 'planted', label: 'Planted' },
                { key: 'growing', label: 'Growing' },
                { key: 'ready', label: 'Ready' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${statusFilter === key 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Add/Edit Form Modal */}
          <AnimatePresence>
            {showAddForm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={resetForm}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                        </h2>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="X"
                          onClick={resetForm}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="select"
                          label="Farm"
                          value={formData.farmId}
                          onChange={(value) => handleFormChange('farmId', value)}
                          options={farmOptions}
                          error={formErrors.farmId}
                          required
                        />

                        <FormField
                          label="Crop Name"
                          value={formData.name}
                          onChange={(value) => handleFormChange('name', value)}
                          error={formErrors.name}
                          required
                          placeholder="e.g., Corn, Tomatoes, Wheat"
                        />

                        <FormField
                          label="Variety"
                          value={formData.variety}
                          onChange={(value) => handleFormChange('variety', value)}
                          error={formErrors.variety}
                          required
                          placeholder="e.g., Sweet Corn, Roma Tomatoes"
                        />

                        <FormField
                          label="Field Location"
                          value={formData.fieldLocation}
                          onChange={(value) => handleFormChange('fieldLocation', value)}
                          error={formErrors.fieldLocation}
                          required
                          placeholder="e.g., North Field, Greenhouse 1"
                        />

                        <FormField
                          type="date"
                          label="Planting Date"
                          value={formData.plantingDate}
                          onChange={(value) => handleFormChange('plantingDate', value)}
                          error={formErrors.plantingDate}
                          required
                        />

                        <FormField
                          type="date"
                          label="Expected Harvest"
                          value={formData.expectedHarvest}
                          onChange={(value) => handleFormChange('expectedHarvest', value)}
                          error={formErrors.expectedHarvest}
                          required
                        />

                        <div className="md:col-span-2">
                          <FormField
                            type="select"
                            label="Status"
                            value={formData.status}
                            onChange={(value) => handleFormChange('status', value)}
                            options={statusOptions}
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <FormField
                            type="textarea"
                            label="Notes"
                            value={formData.notes}
                            onChange={(value) => handleFormChange('notes', value)}
                            placeholder="Optional notes about this crop..."
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1"
                        >
                          {editingCrop ? 'Update Crop' : 'Add Crop'}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Crops Table */}
          {filteredCrops.length === 0 ? (
            <EmptyState
              icon="Wheat"
              title={searchTerm || statusFilter !== 'all' ? 'No crops match your filters' : 'No crops planted yet'}
              description={searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Start by planting your first crop'}
              actionLabel={!(searchTerm || statusFilter !== 'all') ? 'Plant Your First Crop' : undefined}
              onAction={!(searchTerm || statusFilter !== 'all') ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            <CropTable
              crops={filteredCrops}
              farms={farms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Crops;