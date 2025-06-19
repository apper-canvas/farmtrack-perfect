import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmerAnimation = {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  };

  const CardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
      <div className="animate-pulse space-y-4">
        <motion.div
          animate={shimmerAnimation}
          className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"
          style={{ backgroundSize: '400% 100%' }}
        />
        <motion.div
          animate={shimmerAnimation}
          className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2"
          style={{ backgroundSize: '400% 100%' }}
        />
        <motion.div
          animate={shimmerAnimation}
          className="h-8 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/4"
          style={{ backgroundSize: '400% 100%' }}
        />
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200">
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <motion.div
                animate={shimmerAnimation}
                className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded flex-1"
                style={{ backgroundSize: '400% 100%' }}
              />
              <motion.div
                animate={shimmerAnimation}
                className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-24"
                style={{ backgroundSize: '400% 100%' }}
              />
              <motion.div
                animate={shimmerAnimation}
                className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-16"
                style={{ backgroundSize: '400% 100%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="animate-pulse flex items-center space-x-4">
            <motion.div
              animate={shimmerAnimation}
              className="w-10 h-10 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full"
              style={{ backgroundSize: '400% 100%' }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                animate={shimmerAnimation}
                className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"
                style={{ backgroundSize: '400% 100%' }}
              />
              <motion.div
                animate={shimmerAnimation}
                className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2"
                style={{ backgroundSize: '400% 100%' }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const skeletonTypes = {
    card: () => (
      <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CardSkeleton />
          </motion.div>
        ))}
      </div>
    ),
    table: TableSkeleton,
    list: ListSkeleton
  };

  return skeletonTypes[type]();
};

export default SkeletonLoader;