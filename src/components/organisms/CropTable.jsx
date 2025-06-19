import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const CropTable = ({ 
  crops = [], 
  farms = [],
  onEdit, 
  onDelete, 
  onStatusChange,
  className = '' 
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planted': return 'info';
      case 'growing': return 'warning';
      case 'ready': return 'success';
      default: return 'default';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCrops = [...crops].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'farmId') {
      aValue = getFarmName(a.farmId);
      bValue = getFarmName(b.farmId);
    }

    if (sortField === 'plantingDate' || sortField === 'expectedHarvest') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-medium text-left hover:text-primary transition-colors"
    >
      <span>{children}</span>
      <ApperIcon 
        name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
        size={16} 
      />
    </button>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name">Crop</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="farmId">Farm</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="fieldLocation">Field</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="plantingDate">Planted</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="expectedHarvest">Expected Harvest</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {sortedCrops.map((crop, index) => (
              <motion.tr
                key={crop.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-surface-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                    <div className="text-sm text-gray-500">{crop.variety}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getFarmName(crop.farmId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {crop.fieldLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(crop.plantingDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(crop.expectedHarvest), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(crop.status)} size="sm">
                    {crop.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => onEdit(crop)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => onDelete(crop)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropTable;