import React from 'react';
import { useToast } from '../../hooks/use-toast';
import Layout from '../../components/Layout';

const ToastTest = () => {
  const { toast } = useToast();

  const showToast = (type = 'info') => {
    const messages = {
      success: 'This is a success message!',
      error: 'This is an error message!',
      info: 'This is an info message!',
      warning: 'This is a warning message!',
    };
    
    toast({ 
      message: messages[type] || messages.info,
      type,
      duration: 3000
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Toast Notification Test</h1>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={() => showToast('success')}
              className="px-4 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
            >
              Show Success Toast
            </button>
          </div>
          
          <div>
            <button
              onClick={() => showToast('error')}
              className="px-4 py-2 bg-red-500 text-white rounded mr-2 hover:bg-red-600"
            >
              Show Error Toast
            </button>
          </div>
          
          <div>
            <button
              onClick={() => showToast('info')}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
            >
              Show Info Toast
            </button>
          </div>
          
          <div>
            <button
              onClick={() => showToast('warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Show Warning Toast
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ToastTest;
