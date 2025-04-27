import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import landingImage from '@/assets/landingImage.jpg';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-cameroon-blue to-cameroon-blue-dark text-white py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 md:pr-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Made in Cameroon Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                A platform just for locally made products, where artisans, farmers, 
                and small businesses can sell their goods without competing with big foreign brands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/vendor/register">
                  <Button 
                    size="lg"
                    className="bg-white text-cameroon-blue hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-soft"
                  >
                    Start Selling
                  </Button>
                </Link>
                <Link to="/products">
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="border-white transition-all duration-300 transform hover:scale-105 text-slate-50 bg-sky-400/20 hover:bg-sky-400/30 shadow-soft"
                  >
                    Explore Products
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:w-1/2 mt-8 md:mt-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cameroon-blue/20 to-cameroon-blue-dark/20 rounded-3xl"></div>
                <img 
                  src={landingImage} 
                  alt="Made in Cameroon Marketplace" 
                  className="w-full h-auto rounded-3xl shadow-soft transform hover:scale-105 transition-transform duration-300" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-cameroon-blue mb-16"
          >
            Why Join Our Marketplace?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                ),
                title: "Local Focus",
                description: "Showcase your products on a platform designed exclusively for Cameroonian businesses."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Easy Payments",
                description: "Accept payments via MTN Mobile Money and Orange Money for seamless transactions."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure Platform",
                description: "Our verification process ensures a trusted marketplace for buyers and sellers."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 border border-gray-100 rounded-2xl shadow-soft hover:shadow-hard transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-cameroon-blue mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-cameroon-blue mb-16"
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Register",
                description: "Create your vendor account and complete your business profile."
              },
              {
                number: "2",
                title: "Get Verified",
                description: "Upload your business documents for verification and approval."
              },
              {
                number: "3",
                title: "List Products",
                description: "Add your products with photos, descriptions, and pricing."
              },
              {
                number: "4",
                title: "Start Selling",
                description: "Receive orders and payments directly through the platform."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cameroon-blue text-white text-xl font-bold mb-6 shadow-soft">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link to="/vendor/register">
              <Button 
                size="lg"
                className="bg-cameroon-blue hover:bg-cameroon-blue-dark shadow-soft hover:shadow-hard"
              >
                Start Your Vendor Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Vendors Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-cameroon-blue mb-16"
          >
            Featured Vendors
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Bamenda Crafts Co.",
                location: "Bamenda, Northwest",
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                description: "Specializing in handwoven baskets and traditional decorative items crafted by local artisans using sustainable materials."
              },
              {
                name: "Douala Fresh Foods",
                location: "Douala, Littoral",
                image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
                description: "Premium supplier of organic fruits and vegetables sourced directly from local farmers in the Littoral region."
              },
              {
                name: "Kribi Seafood Market",
                location: "Kribi, South",
                image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
                description: "Fresh seafood and fish products from the coastal waters of Kribi, supporting local fishing communities."
              }
            ].map((vendor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-hard transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{vendor.location}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {vendor.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="text-cameroon-blue font-medium text-sm hover:underline"
                  >
                    View Products
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-cameroon-blue py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the Made in Cameroon Movement?
          </h2>
          <p className="text-blue-100 text-xl mb-12 leading-relaxed">
            Whether you're an artisan, farmer, or small business owner, 
            our platform gives you the tools to reach customers across Cameroon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/vendor/register">
              <Button 
                size="lg"
                className="bg-white text-cameroon-blue hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-soft"
              >
                Start Selling Today
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
