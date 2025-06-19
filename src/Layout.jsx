import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { routeArray } from '@/config/routes';
import WeatherWidget from '@/components/organisms/WeatherWidget';
import { AuthContext } from '../App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="outline"
      size="sm"
      icon="LogOut"
      onClick={logout}
      className="border-surface-300 text-gray-600 hover:text-gray-900"
    >
      Logout
    </Button>
  );
};

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if on root path
    if (window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-primary" />
            </button>
            <div className="flex items-center space-x-3 ml-2 lg:ml-0">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <ApperIcon name="Wheat" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-display font-semibold text-primary">
                FarmTrack Pro
              </h1>
            </div>
          </div>
<div className="flex items-center space-x-4">
            {/* Weather Widget in Header */}
            <div className="hidden md:block">
              <WeatherWidget compact />
            </div>
            
            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 overflow-y-auto">
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-surface-100 hover:text-primary'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden"
              >
                <div className="p-4 border-b border-surface-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                        <ApperIcon name="Wheat" size={20} className="text-white" />
                      </div>
                      <h1 className="text-lg font-display font-semibold text-primary">
                        FarmTrack Pro
                      </h1>
                    </div>
                    <button
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-md hover:bg-surface-100 transition-colors"
                    >
                      <ApperIcon name="X" size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={toggleMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-surface-100 hover:text-primary'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span>{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden flex-shrink-0 bg-white border-t border-surface-200 px-4 py-2">
        <div className="flex justify-around">
          {routeArray.slice(0, 5).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span>{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;