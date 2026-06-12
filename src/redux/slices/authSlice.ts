import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  // If we are in the browser, try to restore from localStorage
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('farm_user');
    const token = localStorage.getItem('farm_token');
    const refreshToken = localStorage.getItem('farm_refresh_token');
    
    if (userJson && token) {
      try {
        const user = JSON.parse(userJson) as User;
        return {
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('farm_user');
        localStorage.removeItem('farm_token');
        localStorage.removeItem('farm_refresh_token');
      }
    }
  }

  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('farm_user', JSON.stringify(action.payload.user));
        localStorage.setItem('farm_token', action.payload.token);
        localStorage.setItem('farm_refresh_token', action.payload.refreshToken);
      }
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('farm_user');
        localStorage.removeItem('farm_token');
        localStorage.removeItem('farm_refresh_token');
      }
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('farm_user', JSON.stringify(state.user));
        }
      }
    },
    // Useful for local dashboard switcher
    switchRole(state, action: PayloadAction<Role>) {
      if (state.user) {
        state.user.role = action.payload;
        // Mock appropriate fields depending on role switcher
        if (action.payload === 'SYSTEM_OWNER') {
          state.user.businessId = undefined;
          state.user.farmId = undefined;
        } else if (action.payload === 'BUSINESS_OWNER') {
          state.user.businessId = 'biz-01';
          state.user.farmId = undefined;
        } else if (action.payload === 'FARM_MANAGER') {
          state.user.businessId = 'biz-01';
          state.user.farmId = 'farm-01';
        } else if (action.payload === 'FARM_EMPLOYEE') {
          state.user.businessId = 'biz-01';
          state.user.farmId = 'farm-01';
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('farm_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  switchRole,
} = authSlice.actions;

export default authSlice.reducer;
