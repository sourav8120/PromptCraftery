import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to all requests
  api.interceptors.request.use(config => {
    const t = localStorage.getItem('pv_token');
    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    }
    return config;
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const t = localStorage.getItem('pv_token');
    if (t) {
      setToken(t);
      fetchCurrentUser(t);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken) => {
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const res = await axios.get(`${API_BASE}/users/me`, config);
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem('pv_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/users/register', { name, email, password });
      localStorage.setItem('pv_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('pv_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('pv_token');
    setToken(null);
    setUser(null);
  };

  const googleLogin = async (googleToken) => {
    try {
      const res = await axios.post(`${API_BASE}/google-auth/verify-google-token`, {
        token: googleToken
      });
      localStorage.setItem('pv_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  const incrementPromptUsage = async (promptId) => {
    try {
      const res = await api.post('/users/increment-usage', { promptId });
      if (res.data.canAccess) {
        setUser(prev => ({
          ...prev,
          promptsUsed: res.data.promptsUsed
        }));
        return { success: true, data: res.data };
      } else {
        return { success: false, error: res.data.error };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.message 
      };
    }
  };

  const purchaseSubscription = async (planId) => {
    try {
      // Step 1: Create Razorpay Order
      const orderRes = await api.post('/subscription/create-order', { planId });
      
      if (!orderRes.data.success) {
        const errorMsg = orderRes.data.details || orderRes.data.error || 'Failed to create order';
        throw new Error(errorMsg);
      }

      const orderId = orderRes.data.orderId;
      const publicKey = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!publicKey) {
        throw new Error('Razorpay key not configured');
      }

      // Step 2: Open Razorpay Payment Window
      return new Promise((resolve, reject) => {
        const options = {
          key: publicKey,
          order_id: orderId,
          amount: orderRes.data.amount * 100, // Amount in paise
          currency: 'INR',
          name: 'PromptCraftery',
          description: `${orderRes.data.planName} Plan - ₹${orderRes.data.amount}`,
          handler: async (response) => {
            try {
              // Step 3: Verify Payment
              const verifyRes = await api.post('/subscription/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: planId
              });

              if (verifyRes.data.success) {
                // Refresh the full user profile after successful subscription
                const currentUser = await api.get('/users/me');
                setUser(currentUser.data.user);
                resolve({ success: true, data: verifyRes.data });
              }
            } catch (error) {
              reject(error.response?.data?.error || error.message);
            }
          },
          prefill: {
            email: user?.email || '',
            name: user?.name || ''
          },
          theme: {
            color: '#667eea'
          },
          modal: {
            ondismiss: () => {
              reject('Payment cancelled by user');
            }
          }
        };

        const RazorpayWindow = window.Razorpay;
        if (!RazorpayWindow) {
          // Load Razorpay script if not already loaded
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          };
          script.onerror = () => {
            reject('Failed to load Razorpay payment gateway');
          };
          document.head.appendChild(script);
        } else {
          const razorpay = new RazorpayWindow(options);
          razorpay.open();
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      throw error.message || error;
    }
  };

  const cancelSubscription = async () => {
    try {
      const res = await api.post('/subscription/cancel');
      setUser(prev => ({
        ...prev,
        subscription: res.data.subscription
      }));
      return { success: true, data: res.data };
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  const getSubscriptionStatus = async () => {
    try {
      const res = await api.get('/subscription/status');
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  // Helper function to get plan details
  const getPlanDetails = (planName) => {
    const plans = {
      free: {
        name: 'Free',
        prompts: 5,
        price: 0,
        duration: 'Forever',
        badge: '✨ Free Tier'
      },
      starter: {
        name: 'Starter',
        prompts: 25,
        price: 1,
        duration: '1 month',
        badge: '🔥 Starter Plan'
      },
      pro: {
        name: 'Pro',
        prompts: 100,
        price: 299,
        duration: '6 months',
        badge: '⚡ Pro Plan'
      },
      premium: {
        name: 'Premium',
        prompts: 400,
        price: 799,
        duration: '1 year',
        badge: '💎 Premium Plan'
      }
    };
    return plans[planName] || plans.free;
  };

  // Helper function to get remaining prompts
  const getRemainingPrompts = () => {
    if (!user || !user.subscription) return 5;
    const planPrompts = user.subscription.promptsLimit || 5;
    const remaining = planPrompts - (user.promptsUsed || 0);
    return Math.max(0, remaining);
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      token,
      login,
      googleLogin,
      register,
      logout,
      incrementPromptUsage,
      purchaseSubscription,
      cancelSubscription,
      getSubscriptionStatus,
      getPlanDetails,
      getRemainingPrompts,
      api
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
