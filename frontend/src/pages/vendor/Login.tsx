
import React from 'react';
import Layout from '@/components/layout/Layout';
import VendorLoginForm from '@/components/vendor/VendorLoginForm';

const Login = () => {
  return (
    <Layout>
      <div className="py-10 px-4">
        <VendorLoginForm />
      </div>
    </Layout>
  );
};

export default Login;
