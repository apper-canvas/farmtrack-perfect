import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FarmCard from '@/components/organisms/FarmCard';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { farmService, cropService } from '@/services';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    sizeUnit: 'acres'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message || 'Failed to load farms');
      toast.error('Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const getCropCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId && crop.status !== 'harvested').length;
  };

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Farm name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.size || formData.size <= 0) errors.size = 'Size must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const farmData = {
        ...formData,
        size: parseFloat(formData.size)
      };

      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, farmData);
        setFarms(farms.map(f => f.Id === editingFarm.Id ? updatedFarm : f));
        toast.success('Farm updated successfully');
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms([...farms, newFarm]);
        toast.success('Farm added successfully');
      }

      resetForm();
    } catch (err) {
      toast.error(editingFarm ? 'Failed to update farm' : 'Failed to add farm');
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setShowAddForm(true);
  };

  const handleDelete = async (farm) => {
    if (window.confirm(`Are you sure you want to delete ${farm.name}? This will also delete all associated crops and tasks.`)) {
      try {
        await farmService.delete(farm.Id);
        setFarms(farms.filter(f => f.Id !== farm.Id));
        toast.success('Farm deleted successfully');
      } catch (err) {
        toast.error('Failed to delete farm');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      size: '',
      sizeUnit: 'acres'
    });
    setFormErrors({});
    setEditingFarm(null);
    setShowAddForm(false);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-64"></div>
        </div>
        <SkeletonLoader count={6} type="card" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farms</h1>
          <p className="text-gray-600">
            Manage your farm properties and track their performance
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(true)}
        >
          Add Farm
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search farms by name or location..."
          onSearch={setSearchTerm}
          className="max-w-md"
        />
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
              <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon="X"
                      onClick={resetForm}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      label="Farm Name"
                      value={formData.name}
                      onChange={(value) => handleFormChange('name', value)}
                      error={formErrors.name}
                      required
                      placeholder="e.g., Green Valley Farm"
                    />

                    <FormField
                      label="Location"
                      value={formData.location}
                      onChange={(value) => handleFormChange('location', value)}
                      error={formErrors.location}
                      required
                      placeholder="e.g., Riverside County, CA"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label="Size"
                        type="number"
                        value={formData.size}
                        onChange={(value) => handleFormChange('size', value)}
                        error={formErrors.size}
                        required
                        min="0"
                        step="0.1"
                        placeholder="0"
                      />

                      <FormField
                        type="select"
                        label="Unit"
                        value={formData.sizeUnit}
                        onChange={(value) => handleFormChange('sizeUnit', value)}
                        options={[
                          { value: 'acres', label: 'Acres' },
                          { value: 'hectares', label: 'Hectares' },
                          { value: 'square_feet', label: 'Square Feet' },
                          { value: 'square_meters', label: 'Square Meters' }
                        ]}
                        required
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
                      {editingFarm ? 'Update Farm' : 'Add Farm'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No farms found"
          description={searchTerm ? 'No farms match your search criteria' : 'Start by adding your first farm property'}
          actionLabel={!searchTerm ? 'Add Your First Farm' : undefined}
          onAction={!searchTerm ? () => setShowAddForm(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FarmCard
                farm={farm}
                cropCount={getCropCount(farm.Id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Farms;