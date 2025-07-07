import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your API
      const mockUser = {
        id: '123',
        email,
        name: email.split('@')[0],
        role: email.includes('seller') ? 'seller' : 'buyer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=ec4899&color=fff`,
        createdAt: new Date().toISOString(),
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login. Please try again.');
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // In a real app, you would make an API call to register the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your API
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.fullName || userData.email.split('@')[0],
        role: userData.accountType || 'buyer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.email.split('@')[0])}&background=ec4899&color=fff`,
        createdAt: new Date().toISOString(),
        ...userData,
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast({
        title: 'Registration successful',
        description: `Welcome to InstaCommerce, ${newUser.name}!`,
      });
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart'); // Clear cart on logout
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      // In a real app, you would make an API call to update the user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile. Please try again.');
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      // In a real app, you would make an API call to send a reset password email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Reset email sent',
        description: 'Check your email for a link to reset your password.',
      });
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      // In a real app, you would make an API call to update the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password. Please try again.');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!currentUser,
    isSeller: currentUser?.role === 'seller',
    isBuyer: currentUser?.role === 'buyer',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
