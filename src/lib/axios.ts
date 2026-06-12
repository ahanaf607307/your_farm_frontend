import axios from 'axios';
import * as mockDb from './mockData';
import { Role } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.farmmanagement.local/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('farm_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // JWT token expired handling (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rToken = typeof window !== 'undefined' ? localStorage.getItem('farm_refresh_token') : null;
        if (rToken) {
          // In real application, request new token
          // const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken: rToken });
          // const newToken = res.data.token;
          // localStorage.setItem('farm_token', newToken);
          // originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token expired - force logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('farm_token');
          localStorage.removeItem('farm_refresh_token');
          localStorage.removeItem('farm_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- MOCK INTERCEPTOR LAYER ---
// Intercepts AXIOS requests and returns local mock database updates when running in mock mode.
const USE_MOCK = true; // Easily toggle for actual API

if (USE_MOCK) {
  // A helper to simulate network latency
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  axiosInstance.interceptors.request.use(async (config) => {
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    
    // Resolve full path (strip baseURL if it matches)
    let path = url;
    if (path.startsWith(API_BASE_URL)) {
      path = path.substring(API_BASE_URL.length);
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Custom Mock Router
    await delay(300); // 300ms simulated latency

    try {
      // 1. Authentication
      if (path.startsWith('/auth/login') && method === 'post') {
        const { email, password } = JSON.parse(config.data || '{}');
        const users = mockDb.getMockUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          const mockToken = 'mock-jwt-token-xyz';
          const mockRefreshToken = 'mock-jwt-refresh-xyz';
          return Promise.reject({
            config,
            response: {
              status: 200,
              data: { user, token: mockToken, refreshToken: mockRefreshToken },
              statusText: 'OK',
              headers: {},
            },
          });
        } else {
          return Promise.reject({
            config,
            response: {
              status: 401,
              data: { message: 'Invalid email or password.' },
              statusText: 'Unauthorized',
              headers: {},
            },
          });
        }
      }

      if (path.startsWith('/auth/register') && method === 'post') {
        const data = JSON.parse(config.data || '{}');
        const users = mockDb.getMockUsers();
        
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return Promise.reject({
            config,
            response: {
              status: 400,
              data: { message: 'Email already registered.' },
              statusText: 'Bad Request',
              headers: {},
            },
          });
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'BUSINESS_OWNER' as Role,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };

        const newBiz = {
          id: `biz-${Date.now()}`,
          name: data.businessName || `${data.name}'s Farm Group`,
          ownerId: newUser.id,
          ownerName: newUser.name,
          email: newUser.email,
          status: 'active' as const,
          monthlyRevenue: 0,
          weeklyRevenue: 0,
          yearlyRevenue: 0,
          activeUsers: 1,
          totalFarms: 0,
          subscriptionType: 'Basic' as const,
          createdAt: new Date().toISOString(),
        };

        mockDb.saveUsers([...users, newUser]);
        mockDb.saveBusinesses([...mockDb.getMockBusinesses(), newBiz]);

        return Promise.reject({
          config,
          response: {
            status: 200,
            data: { user: newUser, token: 'mock-jwt-token-xyz', refreshToken: 'mock-jwt-refresh-xyz' },
            statusText: 'OK',
            headers: {},
          },
        });
      }

      // 2. Businesses
      if (path === '/businesses' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockBusinesses() },
        });
      }

      if (path === '/businesses' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockBusinesses();
        const newBiz = {
          ...body,
          id: `biz-${Date.now()}`,
          ownerName: body.ownerName || 'Manual Owner',
          email: body.email || 'owner@farm.com',
          status: 'active',
          monthlyRevenue: 0,
          weeklyRevenue: 0,
          yearlyRevenue: 0,
          activeUsers: 1,
          totalFarms: 0,
          createdAt: new Date().toISOString(),
        };
        mockDb.saveBusinesses([...list, newBiz]);
        return Promise.reject({ config, response: { status: 201, data: newBiz } });
      }

      if (path.startsWith('/businesses/') && (method === 'put' || method === 'patch')) {
        const id = path.split('/')[2];
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockBusinesses();
        const idx = list.findIndex(b => b.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...body };
          mockDb.saveBusinesses(list);
          return Promise.reject({ config, response: { status: 200, data: list[idx] } });
        }
      }

      if (path.startsWith('/businesses/') && method === 'delete') {
        const id = path.split('/')[2];
        const list = mockDb.getMockBusinesses();
        const filtered = list.filter(b => b.id !== id);
        mockDb.saveBusinesses(filtered);
        return Promise.reject({ config, response: { status: 200, data: { success: true } } });
      }

      // 3. Farms
      if (path === '/farms' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockFarms() },
        });
      }

      if (path === '/farms' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockFarms();
        const newFarm = {
          ...body,
          id: `farm-${Date.now()}`,
          status: 'active',
          managersCount: 0,
          employeesCount: 0,
          createdAt: new Date().toISOString(),
        };
        mockDb.saveFarms([...list, newFarm]);
        // Update Business count
        const bizList = mockDb.getMockBusinesses();
        const bIdx = bizList.findIndex(b => b.id === newFarm.businessId);
        if (bIdx !== -1) {
          bizList[bIdx].totalFarms += 1;
          mockDb.saveBusinesses(bizList);
        }

        return Promise.reject({ config, response: { status: 201, data: newFarm } });
      }

      // 4. Animal Categories
      if (path === '/categories' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockCategories() },
        });
      }

      if (path === '/categories' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockCategories();
        const newCat = {
          ...body,
          id: `cat-${Date.now()}`,
          animalCount: 0,
        };
        mockDb.saveCategories([...list, newCat]);
        return Promise.reject({ config, response: { status: 201, data: newCat } });
      }

      if (path.startsWith('/categories/') && method === 'delete') {
        const id = path.split('/')[2];
        const list = mockDb.getMockCategories();
        mockDb.saveCategories(list.filter(c => c.id !== id));
        return Promise.reject({ config, response: { status: 200, data: { success: true } } });
      }

      // 5. Animals
      if (path === '/animals' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockAnimals() },
        });
      }

      if (path === '/animals' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockAnimals();
        const cats = mockDb.getMockCategories();
        const cat = cats.find(c => c.id === body.categoryId);
        const newAni = {
          ...body,
          id: `ani-${Date.now()}`,
          categoryName: cat ? cat.name : 'Unknown',
          quantity: Number(body.quantity || 1),
          weight: Number(body.weight || 0),
          createdAt: new Date().toISOString(),
        };
        mockDb.saveAnimals([...list, newAni]);
        // Update category count
        if (cat) {
          cat.animalCount += newAni.quantity;
          mockDb.saveCategories(cats);
        }
        return Promise.reject({ config, response: { status: 201, data: newAni } });
      }

      if (path.startsWith('/animals/') && method === 'put') {
        const id = path.split('/')[2];
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockAnimals();
        const idx = list.findIndex(a => a.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...body, quantity: Number(body.quantity || list[idx].quantity), weight: Number(body.weight || list[idx].weight) };
          mockDb.saveAnimals(list);
          return Promise.reject({ config, response: { status: 200, data: list[idx] } });
        }
      }

      if (path.startsWith('/animals/') && method === 'delete') {
        const id = path.split('/')[2];
        const list = mockDb.getMockAnimals();
        mockDb.saveAnimals(list.filter(a => a.id !== id));
        return Promise.reject({ config, response: { status: 200, data: { success: true } } });
      }

      // 6. Medicine
      if (path === '/medicines' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockMedicines() },
        });
      }

      if (path === '/medicines' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockMedicines();
        const newMed = {
          ...body,
          id: `med-${Date.now()}`,
          usedStock: 0,
          remainingStock: Number(body.stock || 10),
          status: Number(body.stock || 10) < 5 ? 'low_stock' : 'available',
        };
        mockDb.saveMedicines([...list, newMed]);
        return Promise.reject({ config, response: { status: 201, data: newMed } });
      }

      // 7. Food Items
      if (path === '/foods' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockFoodItems() },
        });
      }

      if (path === '/foods' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockFoodItems();
        const newFood = {
          ...body,
          id: `food-${Date.now()}`,
          dailyUsage: 0,
          monthlyUsage: 0,
          status: Number(body.stock || 50) < 50 ? 'low_stock' : 'available',
        };
        mockDb.saveFoodItems([...list, newFood]);
        return Promise.reject({ config, response: { status: 201, data: newFood } });
      }

      // 8. Tasks
      if (path === '/tasks' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockTasks() },
        });
      }

      if (path === '/tasks' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockTasks();
        const users = mockDb.getMockUsers();
        const assignee = users.find(u => u.id === body.assignedToId);
        
        const newTask = {
          ...body,
          id: `task-${Date.now()}`,
          assignedToName: assignee ? assignee.name : 'Unassigned',
          createdById: 'user-mgr',
          createdByName: 'David Carter',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        mockDb.saveTasks([...list, newTask]);

        // Add Notification for task assigned
        const notifList = mockDb.getMockNotifications();
        const newNotif = {
          id: `notif-${Date.now()}`,
          type: 'task_assigned' as const,
          title: 'New Task Assigned',
          message: `Task "${newTask.title}" has been assigned to ${newTask.assignedToName}.`,
          farmId: newTask.farmId,
          read: false,
          createdAt: new Date().toISOString(),
        };
        mockDb.saveNotifications([newNotif, ...notifList]);

        return Promise.reject({ config, response: { status: 201, data: newTask } });
      }

      if (path.startsWith('/tasks/') && method === 'put') {
        const id = path.split('/')[2];
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockTasks();
        const idx = list.findIndex(t => t.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...body, updatedAt: new Date().toISOString() };
          mockDb.saveTasks(list);

          // Add notification if task is marked complete
          if (body.status === 'completed') {
            const notifList = mockDb.getMockNotifications();
            const newNotif = {
              id: `notif-${Date.now()}`,
              type: 'task_completed' as const,
              title: 'Task Completed',
              message: `${list[idx].assignedToName} completed task: "${list[idx].title}"`,
              farmId: list[idx].farmId,
              read: false,
              createdAt: new Date().toISOString(),
            };
            mockDb.saveNotifications([newNotif, ...notifList]);
          }

          return Promise.reject({ config, response: { status: 200, data: list[idx] } });
        }
      }

      // 9. Chat
      if (path.startsWith('/chat/sessions/') && method === 'get') {
        const userId = path.split('/')[3];
        const userRole = path.split('/')[4] as Role;
        const sessions = mockDb.getChatSessionsForUser(userId, userRole);
        return Promise.reject({ config, response: { status: 200, data: sessions } });
      }

      if (path.startsWith('/chat/messages/') && method === 'get') {
        const ids = path.split('/')[3].split('-'); // format "user1-user2"
        const u1 = ids[0];
        const u2 = ids[1];
        const messages = mockDb.getMockMessages();
        const thread = messages.filter(
          m => (m.senderId === u1 && m.receiverId === u2) || (m.senderId === u2 && m.receiverId === u1)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        // Mark as read
        const updated = messages.map(m => {
          if (m.senderId === u2 && m.receiverId === u1 && m.unread) {
            return { ...m, unread: false };
          }
          return m;
        });
        mockDb.saveMessages(updated);

        return Promise.reject({ config, response: { status: 200, data: thread } });
      }

      if (path === '/chat/messages' && method === 'post') {
        const body = JSON.parse(config.data || '{}');
        const list = mockDb.getMockMessages();
        const newMessage = {
          ...body,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
          unread: true,
        };
        mockDb.saveMessages([...list, newMessage]);
        return Promise.reject({ config, response: { status: 201, data: newMessage } });
      }

      // 10. Notifications
      if (path === '/notifications' && method === 'get') {
        return Promise.reject({
          config,
          response: { status: 200, data: mockDb.getMockNotifications() },
        });
      }

      if (path.startsWith('/notifications/') && method === 'put') {
        const id = path.split('/')[2];
        const list = mockDb.getMockNotifications();
        const idx = list.findIndex(n => n.id === id);
        if (idx !== -1) {
          list[idx].read = true;
          mockDb.saveNotifications(list);
          return Promise.reject({ config, response: { status: 200, data: list[idx] } });
        }
      }

      // Fallback for unhandled mock calls
      return Promise.reject({
        config,
        response: {
          status: 404,
          data: { message: `Mock endpoint not found: ${method.toUpperCase()} ${path}` },
        },
      });

    } catch (e: any) {
      return Promise.reject({
        config,
        response: {
          status: 500,
          data: { message: 'Internal mock server error: ' + e.message },
        },
      });
    }
  });

  // Intercept the final promise error and convert simulated response errors to RESOLVED status 200/201/etc.
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If the error object has a simulated "response", resolve it as a successful response
      if (error && error.response && error.response.status >= 200 && error.response.status < 300) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
}
