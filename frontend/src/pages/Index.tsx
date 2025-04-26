import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import landingImage from '@/assets/landingImage.jpg';

const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <motion.section initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="bg-gradient-to-br from-cameroon-blue to-cameroon-blue-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="md:w-1/2 md:pr-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Made in Cameroon Marketplace
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                A platform just for locally made products, where artisans, farmers, 
                and small businesses can sell their goods without competing with big foreign brands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/vendor/register">
                  <Button className="bg-white text-cameroon-blue hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                    Start Selling
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="border-white transition-all duration-300 transform hover:scale-105 text-slate-50 bg-sky-400 hover:bg-sky-300">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} className="md:w-1/2 mt-8 md:mt-0">
              <img src={landingImage} alt="Made in Cameroon Marketplace" className="w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-cameroon-blue mb-12">
            Why Join Our Marketplace?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-cameroon-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
              <p className="text-gray-600">
                Showcase your products on a platform designed exclusively for Cameroonian businesses.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-cameroon-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
              <p className="text-gray-600">
                Accept payments via MTN Mobile Money and Orange Money for seamless transactions.
              </p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-cameroon-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Our verification process ensures a trusted marketplace for buyers and sellers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-cameroon-blue mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cameroon-blue text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Create your vendor account and complete your business profile.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cameroon-blue text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-600">
                Upload your business documents for verification and approval.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cameroon-blue text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">List Products</h3>
              <p className="text-gray-600">
                Add your products with photos, descriptions, and pricing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cameroon-blue text-white text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Selling</h3>
              <p className="text-gray-600">
                Receive orders and payments directly through the platform.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/vendor/register">
              <Button className="bg-cameroon-blue hover:bg-cameroon-blue-dark">
                Start Your Vendor Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Vendors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-2xl md:text-3xl font-bold text-center text-cameroon-blue mb-12">
            Featured Vendors
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
            name: "Bamenda Crafts Co.",
            location: "Bamenda, Northwest",
            image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
            description: "Specializing in handwoven baskets and traditional decorative items crafted by local artisans using sustainable materials."
          }, {
            name: "Douala Fresh Foods",
            location: "Douala, Littoral",
            image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
            description: "Premium supplier of organic fruits and vegetables sourced directly from local farmers in the Littoral region."
          }, {
            name: "Kribi Seafood Market",
            location: "Kribi, South",
            image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
            description: "Fresh seafood and fish products from the coastal waters of Kribi, supporting local fishing communities."
          }].map((vendor, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: i * 0.2
          }} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{vendor.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{vendor.location}</p>
                  <p className="text-gray-600 mb-3">
                    {vendor.description}
                  </p>
                  <Button variant="link" className="text-cameroon-blue font-medium text-sm hover:underline">
                    View Products
                  </Button>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }} className="bg-cameroon-blue py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join the Made in Cameroon Movement?
          </h2>
          <p className="text-blue-100 mb-8">
            Whether you're an artisan, farmer, or small business owner, 
            our platform gives you the tools to reach customers across Cameroon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/vendor/register">
              <Button className="bg-white text-cameroon-blue hover:bg-blue-50">
                Register as Vendor
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-white hover:bg-white/10 text-sky-400">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </Layout>;
};

export default Index;
