
import React from 'react';
import Layout from '@/components/layout/Layout';
import VendorRegisterForm from '@/components/vendor/VendorRegisterForm';

const Register = () => {
  return (
    <Layout>
      <div className="py-10 px-4">
        <VendorRegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
