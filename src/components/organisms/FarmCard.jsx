import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FarmCard = ({ 
  farm, 
  cropCount = 0,
  onEdit, 
  onDelete, 
  onViewDetails,
  className = '' 
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(farm);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(farm);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(farm);
    }
  };

  return (
    <Card 
      className={`cursor-pointer ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="MapPin" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {farm.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              {farm.location}
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="flex space-x-1"
        >
          <Button
            variant="ghost"
            size="sm"
            icon="Edit"
            onClick={handleEdit}
            className="text-gray-600 hover:text-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            className="text-gray-600 hover:text-error"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {farm.size}
          </div>
          <div className="text-sm text-gray-600">
            {farm.sizeUnit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {cropCount}
          </div>
          <div className="text-sm text-gray-600">
            Active Crops
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="primary" size="sm">
          {farm.sizeUnit === 'acres' ? 'Large Scale' : 'Small Scale'}
        </Badge>
        <div className="text-xs text-gray-500">
          Added {new Date(farm.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default FarmCard;