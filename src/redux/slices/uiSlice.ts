import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarExpanded: boolean;
  chatOpen: boolean;
  selectedChatUserId: string | null;
  notificationOpen: boolean;
  mobileMenuOpen: boolean;
}

const initialState: UIState = {
  sidebarExpanded: true,
  chatOpen: false,
  selectedChatUserId: null,
  notificationOpen: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSidebarExpanded(state, action: PayloadAction<boolean>) {
      state.sidebarExpanded = action.payload;
    },
    toggleChat(state) {
      state.chatOpen = !state.chatOpen;
    },
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload;
    },
    selectChatUser(state, action: PayloadAction<string | null>) {
      state.selectedChatUserId = action.payload;
      state.chatOpen = true;
    },
    toggleNotifications(state) {
      state.notificationOpen = !state.notificationOpen;
    },
    setNotificationsOpen(state, action: PayloadAction<boolean>) {
      state.notificationOpen = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarExpanded,
  toggleChat,
  setChatOpen,
  selectChatUser,
  toggleNotifications,
  setNotificationsOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
