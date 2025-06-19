import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Card className="p-8">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              transition: { 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }
            }}
            className="mb-6"
          >
            <ApperIcon name="Tractor" className="w-24 h-24 text-primary mx-auto" />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Field Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            Looks like this page got lost in the fields. Let's get you back to your farm operations.
          </p>
          
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="w-full"
              icon="Home"
            >
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
              icon="ArrowLeft"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;