import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Vendors", path: "/vendors" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-soft sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src={logo}
                className="mr-3 h-10 transition-transform duration-300 group-hover:scale-110"
                alt="Made in Cameroon Logo"
              />
              <span className="self-center text-2xl font-bold bg-gradient-to-r from-cameroon-blue to-cameroon-blue-dark bg-clip-text text-transparent">
                MICM
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/vendor/login">
              <Button
                size="lg"
                variant="outline"
                className="border-cameroon-blue text-cameroon-blue hover:bg-cameroon-blue/5 transition-all duration-300"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
