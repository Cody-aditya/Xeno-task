import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  tokens: {
    accessToken: string | null;
  };
  loginWithGoogle: (response: any) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      tokens: {
        accessToken: null,
      },
      
      loginWithGoogle: (response) => {
        // In a real app, we would exchange this token with our backend
        // for a session token or JWT, but for this demo we'll just use it directly
        const token = response.access_token;
        
        try {
          // Simulate user data from token
          // Note: In production, user data would come from your backend
          const mockUser = {
            id: '123456789',
            name: 'Demo User',
            email: 'demo@example.com',
            imageUrl: 'https://i.pravatar.cc/150?u=demo@example.com',
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            loading: false,
            tokens: {
              accessToken: token,
            },
          });
        } catch (error) {
          console.error('Error processing token:', error);
          set({ isAuthenticated: false, loading: false });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          tokens: {
            accessToken: null,
          },
        });
      },
      
      checkAuth: () => {
        const state = get();
        
        // If we have a token, consider the user logged in
        if (state.tokens.accessToken) {
          // In a real app, we would validate the token here
          set({ loading: false, isAuthenticated: true });
        } else {
          set({ loading: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);