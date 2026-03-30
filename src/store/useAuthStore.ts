import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, School } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  school: School | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, school?: School | null) => void;
  setSchool: (school: School) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      school: null,
      isAuthenticated: false,

      setAuth: (user, token, school = null) => {
        localStorage.setItem('schoollink_token', token);
        set({ user, token, school, isAuthenticated: true });
      },

      setSchool: (school) => set({ school }),

      logout: () => {
        localStorage.removeItem('schoollink_token');
        set({ user: null, token: null, school: null, isAuthenticated: false });
      },
    }),
    {
      name: 'schoollink-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        school: state.school,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
