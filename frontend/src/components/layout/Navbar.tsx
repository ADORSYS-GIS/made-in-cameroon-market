import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '@/assets/logo.png';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  className="mr-3 h-8" 
                  alt="Made in Cameroon Logo" 
                />
                <span className="self-center text-xl font-semibold text-cameroon-blue">
                  MICM
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/vendor/register">
              <Button className="mr-2">Register as Vendor</Button>
            </Link>
            <Link to="/vendor/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
