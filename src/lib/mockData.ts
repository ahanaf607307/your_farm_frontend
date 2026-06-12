import {
  User,
  Business,
  Farm,
  AnimalCategory,
  Animal,
  Medicine,
  MedicineHistory,
  FoodItem,
  Task,
  Message,
  ChatSession,
  Notification,
  Role,
} from '@/types';

// Helper to seed localStorage
const getOrSeed = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      // ignore
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

const save = <T>(key: string, data: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// 1. Initial Users
const initialUsers: User[] = [
  {
    id: 'user-sys',
    name: 'Sarah Jenkins',
    email: 'admin@farmly.com',
    role: 'SYSTEM_OWNER',
    status: 'active',
    createdAt: '2025-01-15T08:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'user-biz',
    name: 'Robert Vance',
    email: 'robert@vancefarms.com',
    role: 'BUSINESS_OWNER',
    businessId: 'biz-01',
    status: 'active',
    createdAt: '2025-02-10T09:30:00Z',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'user-mgr',
    name: 'David Carter',
    email: 'david@vancefarms.com',
    role: 'FARM_MANAGER',
    businessId: 'biz-01',
    farmId: 'farm-01',
    status: 'active',
    createdAt: '2025-03-01T10:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'user-emp',
    name: 'Alex Rivera',
    email: 'alex@vancefarms.com',
    role: 'FARM_EMPLOYEE',
    businessId: 'biz-01',
    farmId: 'farm-01',
    status: 'active',
    createdAt: '2025-03-05T11:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

// 2. Initial Businesses
const initialBusinesses: Business[] = [
  {
    id: 'biz-01',
    name: 'Vance Agricultural Group',
    ownerId: 'user-biz',
    ownerName: 'Robert Vance',
    email: 'robert@vancefarms.com',
    status: 'active',
    monthlyRevenue: 12450,
    weeklyRevenue: 3120,
    yearlyRevenue: 149400,
    activeUsers: 8,
    totalFarms: 3,
    subscriptionType: 'Enterprise',
    createdAt: '2025-02-10T09:30:00Z',
  },
  {
    id: 'biz-02',
    name: 'Greenfield Poultry Corp',
    ownerId: 'owner-2',
    ownerName: 'Elena Rostova',
    email: 'elena@greenfield.com',
    status: 'active',
    monthlyRevenue: 8200,
    weeklyRevenue: 2050,
    yearlyRevenue: 98400,
    activeUsers: 4,
    totalFarms: 2,
    subscriptionType: 'Standard',
    createdAt: '2025-03-12T14:15:00Z',
  },
  {
    id: 'biz-03',
    name: 'Oceanic Fish & Aquaculture',
    ownerId: 'owner-3',
    ownerName: 'Marcus Fisher',
    email: 'marcus@oceanic.com',
    status: 'active',
    monthlyRevenue: 4900,
    weeklyRevenue: 1100,
    yearlyRevenue: 58800,
    activeUsers: 3,
    totalFarms: 1,
    subscriptionType: 'Basic',
    createdAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'biz-04',
    name: 'Apex Cattle Breeders',
    ownerId: 'owner-4',
    ownerName: 'Tom Jenkins',
    email: 'tom@apexbreeders.com',
    status: 'inactive',
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    yearlyRevenue: 0,
    activeUsers: 1,
    totalFarms: 2,
    subscriptionType: 'Standard',
    createdAt: '2025-04-18T16:45:00Z',
  },
];

// 3. Initial Farms
const initialFarms: Farm[] = [
  {
    id: 'farm-01',
    name: 'Vance Poultry Division',
    type: 'POULTRY',
    businessId: 'biz-01',
    location: 'Valley Region, Barn A',
    status: 'active',
    createdAt: '2025-02-11T08:00:00Z',
    managersCount: 1,
    employeesCount: 3,
  },
  {
    id: 'farm-02',
    name: 'Vance Cattle Ranch',
    type: 'CATTLE',
    businessId: 'biz-01',
    location: 'Highland Meadow',
    status: 'active',
    createdAt: '2025-02-15T09:00:00Z',
    managersCount: 1,
    employeesCount: 2,
  },
  {
    id: 'farm-03',
    name: 'Vance Fish Estuary',
    type: 'FISH',
    businessId: 'biz-01',
    location: 'South Coast Lagoon',
    status: 'active',
    createdAt: '2025-03-20T12:00:00Z',
    managersCount: 0,
    employeesCount: 1,
  },
  {
    id: 'farm-04',
    name: 'Greenfield Barns',
    type: 'DAIRY',
    businessId: 'biz-02',
    location: 'North Hill Side',
    status: 'active',
    createdAt: '2025-03-12T15:00:00Z',
    managersCount: 1,
    employeesCount: 2,
  },
];

// 4. Initial Animal Categories
const initialCategories: AnimalCategory[] = [
  { id: 'cat-01', name: 'Broiler', farmId: 'farm-01', description: 'Meat production chickens', animalCount: 1200 },
  { id: 'cat-02', name: 'Layer', farmId: 'farm-01', description: 'Egg production chickens', animalCount: 850 },
  { id: 'cat-03', name: 'Dairy Cow (Holstein)', farmId: 'farm-02', description: 'Milk milking cows', animalCount: 45 },
  { id: 'cat-04', name: 'Tilapia', farmId: 'farm-03', description: 'Freshwater fish', animalCount: 5000 },
  { id: 'cat-05', name: 'Angus Bull', farmId: 'farm-02', description: 'Beef production cattle', animalCount: 20 },
];

// 5. Initial Animals
const initialAnimals: Animal[] = [
  {
    id: 'ani-01',
    name: 'Broiler Batch #10',
    categoryId: 'cat-01',
    categoryName: 'Broiler',
    quantity: 1200,
    age: '6 weeks',
    purchaseDate: '2026-05-01',
    weight: 2.1,
    status: 'healthy',
    farmId: 'farm-01',
    section: 'Section A',
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'ani-02',
    name: 'Layer Batch #08',
    categoryId: 'cat-02',
    categoryName: 'Layer',
    quantity: 850,
    age: '18 weeks',
    purchaseDate: '2026-02-15',
    weight: 1.6,
    status: 'healthy',
    farmId: 'farm-01',
    section: 'Section B',
    createdAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'ani-03',
    name: 'Bessie (Holstein #04)',
    categoryId: 'cat-03',
    categoryName: 'Dairy Cow (Holstein)',
    quantity: 1,
    age: '3 years',
    purchaseDate: '2024-06-10',
    weight: 680,
    status: 'healthy',
    farmId: 'farm-02',
    section: 'Milking Stable',
    createdAt: '2024-06-10T08:00:00Z',
  },
  {
    id: 'ani-04',
    name: 'Clarabelle (Holstein #12)',
    categoryId: 'cat-03',
    categoryName: 'Dairy Cow (Holstein)',
    quantity: 1,
    age: '4 years',
    purchaseDate: '2024-06-10',
    weight: 710,
    status: 'sick', // Needs medicine
    farmId: 'farm-02',
    section: 'Quarantine Stall',
    createdAt: '2024-06-10T08:00:00Z',
  },
];

// 6. Initial Medicines
const initialMedicines: Medicine[] = [
  {
    id: 'med-01',
    name: 'Newcastle Disease Vaccine',
    farmId: 'farm-01',
    assignedType: 'category',
    assignedToId: 'cat-01',
    assignedToName: 'Broiler',
    schedule: ['morning'],
    stock: 50,
    usedStock: 10,
    remainingStock: 40,
    status: 'available',
  },
  {
    id: 'med-02',
    name: 'Oxytetracycline Antibiotic',
    farmId: 'farm-01',
    assignedType: 'section',
    assignedToId: 'Section B',
    assignedToName: 'Section B',
    schedule: ['morning', 'evening'],
    stock: 20,
    usedStock: 18,
    remainingStock: 2,
    status: 'low_stock',
  },
  {
    id: 'med-03',
    name: 'Calcium Supplement Boost',
    farmId: 'farm-02',
    assignedType: 'animal',
    assignedToId: 'ani-04',
    assignedToName: 'Clarabelle (Holstein #12)',
    schedule: ['morning', 'noon', 'evening'],
    stock: 15,
    usedStock: 5,
    remainingStock: 10,
    status: 'available',
  },
];

// 7. Initial Medicine Histories
const initialMedicineHistories: MedicineHistory[] = [
  {
    id: 'medh-01',
    medicineId: 'med-01',
    medicineName: 'Newcastle Disease Vaccine',
    assignedToName: 'Broiler Category',
    time: 'morning',
    status: 'completed',
    date: '2026-06-12',
    completedAt: '2026-06-12T07:30:00Z',
    completedBy: 'Alex Rivera',
  },
  {
    id: 'medh-02',
    medicineId: 'med-02',
    medicineName: 'Oxytetracycline Antibiotic',
    assignedToName: 'Section B',
    time: 'morning',
    status: 'completed',
    date: '2026-06-12',
    completedAt: '2026-06-12T08:15:00Z',
    completedBy: 'Alex Rivera',
  },
  {
    id: 'medh-03',
    medicineId: 'med-03',
    medicineName: 'Calcium Supplement Boost',
    assignedToName: 'Clarabelle (Holstein #12)',
    time: 'morning',
    status: 'completed',
    date: '2026-06-12',
    completedAt: '2026-06-12T07:45:00Z',
    completedBy: 'Alex Rivera',
  },
  {
    id: 'medh-04',
    medicineId: 'med-03',
    medicineName: 'Calcium Supplement Boost',
    assignedToName: 'Clarabelle (Holstein #12)',
    time: 'noon',
    status: 'pending',
    date: '2026-06-12',
  },
  {
    id: 'medh-05',
    medicineId: 'med-02',
    medicineName: 'Oxytetracycline Antibiotic',
    assignedToName: 'Section B',
    time: 'evening',
    status: 'pending',
    date: '2026-06-12',
  },
];

// 8. Initial Food Items
const initialFoodItems: FoodItem[] = [
  {
    id: 'food-01',
    name: 'Starter Mash (Chicken)',
    farmId: 'farm-01',
    assignedType: 'category',
    assignedToId: 'cat-01',
    assignedToName: 'Broiler',
    schedule: ['morning', 'noon', 'evening'],
    stock: 500, // in kg
    dailyUsage: 45,
    monthlyUsage: 1350,
    status: 'available',
  },
  {
    id: 'food-02',
    name: 'Grower Pellets (Poultry)',
    farmId: 'farm-01',
    assignedType: 'category',
    assignedToId: 'cat-02',
    assignedToName: 'Layer',
    schedule: ['morning', 'evening'],
    stock: 800,
    dailyUsage: 35,
    monthlyUsage: 1050,
    status: 'available',
  },
  {
    id: 'food-03',
    name: 'Alfalfa Hay bale',
    farmId: 'farm-02',
    assignedType: 'section',
    assignedToId: 'Milking Stable',
    assignedToName: 'Milking Stable',
    schedule: ['morning', 'noon', 'evening'],
    stock: 45, // in units
    dailyUsage: 5,
    monthlyUsage: 150,
    status: 'low_stock',
  },
];

// 9. Initial Tasks
const initialTasks: Task[] = [
  {
    id: 'task-01',
    title: 'Feed Broiler Category',
    description: 'Provide 15kg of Starter Mash in feed troughs in Section A.',
    type: 'feed',
    assignedToId: 'user-emp',
    assignedToName: 'Alex Rivera',
    createdById: 'user-mgr',
    createdByName: 'David Carter',
    farmId: 'farm-01',
    status: 'completed',
    dueDate: '2026-06-12T09:00:00Z',
    notes: 'All feed troughs cleaned and refilled.',
    createdAt: '2026-06-11T16:00:00Z',
    updatedAt: '2026-06-12T08:30:00Z',
  },
  {
    id: 'task-02',
    title: 'Give Vaccine to Layer Category',
    description: 'Prepare Newcastle Disease Vaccine vaccine in drinking water systems.',
    type: 'vaccination',
    assignedToId: 'user-emp',
    assignedToName: 'Alex Rivera',
    createdById: 'user-mgr',
    createdByName: 'David Carter',
    farmId: 'farm-01',
    status: 'in-progress',
    dueDate: '2026-06-12T12:00:00Z',
    createdAt: '2026-06-11T16:05:00Z',
    updatedAt: '2026-06-12T09:00:00Z',
  },
  {
    id: 'task-03',
    title: 'Give Medicine to Section B',
    description: 'Administer Oxytetracycline Antibiotic in Section B for minor respiratory symptoms.',
    type: 'medicine',
    assignedToId: 'user-emp',
    assignedToName: 'Alex Rivera',
    createdById: 'user-mgr',
    createdByName: 'David Carter',
    farmId: 'farm-01',
    status: 'pending',
    dueDate: '2026-06-12T18:00:00Z',
    createdAt: '2026-06-12T07:00:00Z',
    updatedAt: '2026-06-12T07:00:00Z',
  },
  {
    id: 'task-04',
    title: 'Clean Fish Pond #3',
    description: 'Filter silt and inspect aeration nozzles in Pond 3 (South Coast).',
    type: 'cleaning',
    assignedToId: 'emp-2',
    assignedToName: 'Jake Harper',
    createdById: 'user-mgr',
    createdByName: 'David Carter',
    farmId: 'farm-03',
    status: 'pending',
    dueDate: '2026-06-13T10:00:00Z',
    createdAt: '2026-06-12T08:00:00Z',
    updatedAt: '2026-06-12T08:00:00Z',
  },
];

// 10. Initial Messages
const initialMessages: Message[] = [
  {
    id: 'msg-01',
    senderId: 'user-mgr',
    senderName: 'David Carter',
    senderRole: 'FARM_MANAGER',
    receiverId: 'user-biz',
    content: 'Hi Robert, the weekly egg yields are up 8% in Vance Poultry Division.',
    timestamp: '2026-06-11T15:30:00Z',
    unread: false,
  },
  {
    id: 'msg-02',
    senderId: 'user-biz',
    senderName: 'Robert Vance',
    senderRole: 'BUSINESS_OWNER',
    receiverId: 'user-mgr',
    content: 'Excellent news David. Keep track of the feed ratios. Let me know if you need more Starter Mash.',
    timestamp: '2026-06-11T15:45:00Z',
    unread: false,
  },
  {
    id: 'msg-03',
    senderId: 'user-mgr',
    senderName: 'David Carter',
    senderRole: 'FARM_MANAGER',
    receiverId: 'user-emp',
    content: 'Hi Alex, I assigned you a few tasks for today. Please give extra attention to Section B medicine schedule.',
    timestamp: '2026-06-12T07:10:00Z',
    unread: false,
  },
  {
    id: 'msg-04',
    senderId: 'user-emp',
    senderName: 'Alex Rivera',
    senderRole: 'FARM_EMPLOYEE',
    receiverId: 'user-mgr',
    content: 'Understood, David. Starting the vaccine mix now. I will post notes when complete.',
    timestamp: '2026-06-12T07:22:00Z',
    unread: false,
  },
  {
    id: 'msg-05',
    senderId: 'user-emp',
    senderName: 'Alex Rivera',
    senderRole: 'FARM_EMPLOYEE',
    receiverId: 'user-biz',
    content: 'Mr. Vance, I completed the broiler feed task. The broiler weights are looking healthy.',
    timestamp: '2026-06-12T08:35:00Z',
    unread: true,
  },
];

// 11. Initial Notifications
const initialNotifications: Notification[] = [
  {
    id: 'notif-01',
    type: 'medicine_time',
    title: 'Medicine Scheduled',
    message: 'Time to administer Calcium Supplement Boost to Clarabelle (Holstein #12) [Noon Schedule]',
    farmId: 'farm-02',
    read: false,
    createdAt: '2026-06-12T11:00:00Z',
  },
  {
    id: 'notif-02',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Alex Rivera completed task: "Feed Broiler Category"',
    farmId: 'farm-01',
    read: false,
    createdAt: '2026-06-12T08:30:00Z',
  },
  {
    id: 'notif-03',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Oxytetracycline Antibiotic is low (2 units remaining)',
    farmId: 'farm-01',
    read: false,
    createdAt: '2026-06-12T06:00:00Z',
  },
  {
    id: 'notif-04',
    type: 'farm_alerts',
    title: 'Sick Animal Registered',
    message: 'Clarabelle is flagged as sick in Quarantine Stall.',
    farmId: 'farm-02',
    read: true,
    createdAt: '2026-06-11T14:20:00Z',
  },
];

// Seed functions
export const getMockUsers = () => getOrSeed<User[]>('mock_users', initialUsers);
export const getMockBusinesses = () => getOrSeed<Business[]>('mock_businesses', initialBusinesses);
export const getMockFarms = () => getOrSeed<Farm[]>('mock_farms', initialFarms);
export const getMockCategories = () => getOrSeed<AnimalCategory[]>('mock_categories', initialCategories);
export const getMockAnimals = () => getOrSeed<Animal[]>('mock_animals', initialAnimals);
export const getMockMedicines = () => getOrSeed<Medicine[]>('mock_medicines', initialMedicines);
export const getMockMedicineHistories = () => getOrSeed<MedicineHistory[]>('mock_med_histories', initialMedicineHistories);
export const getMockFoodItems = () => getOrSeed<FoodItem[]>('mock_food_items', initialFoodItems);
export const getMockTasks = () => getOrSeed<Task[]>('mock_tasks', initialTasks);
export const getMockMessages = () => getOrSeed<Message[]>('mock_messages', initialMessages);
export const getMockNotifications = () => getOrSeed<Notification[]>('mock_notifications', initialNotifications);

// Helper saves
export const saveUsers = (data: User[]) => save('mock_users', data);
export const saveBusinesses = (data: Business[]) => save('mock_businesses', data);
export const saveFarms = (data: Farm[]) => save('mock_farms', data);
export const saveCategories = (data: AnimalCategory[]) => save('mock_categories', data);
export const saveAnimals = (data: Animal[]) => save('mock_animals', data);
export const saveMedicines = (data: Medicine[]) => save('mock_medicines', data);
export const saveMedicineHistories = (data: MedicineHistory[]) => save('mock_med_histories', data);
export const saveFoodItems = (data: FoodItem[]) => save('mock_food_items', data);
export const saveTasks = (data: Task[]) => save('mock_tasks', data);
export const saveMessages = (data: Message[]) => save('mock_messages', data);
export const saveNotifications = (data: Notification[]) => save('mock_notifications', data);

// Messaging active chats calculation
export const getChatSessionsForUser = (userId: string, userRole: Role): ChatSession[] => {
  const users = getMockUsers();
  const messages = getMockMessages();
  
  // Filter users that current user can chat with
  // SYSTEM_OWNER: None (or not scoped)
  // BUSINESS_OWNER: can chat with Manager, Employee
  // FARM_MANAGER: can chat with Business Owner, Employee
  // FARM_EMPLOYEE: can chat with Farm Manager, Business Owner
  
  let chatPartners: User[] = [];
  if (userRole === 'BUSINESS_OWNER') {
    chatPartners = users.filter(u => u.role === 'FARM_MANAGER' || u.role === 'FARM_EMPLOYEE');
  } else if (userRole === 'FARM_MANAGER') {
    chatPartners = users.filter(u => u.role === 'BUSINESS_OWNER' || u.role === 'FARM_EMPLOYEE');
  } else if (userRole === 'FARM_EMPLOYEE') {
    chatPartners = users.filter(u => u.role === 'FARM_MANAGER' || u.role === 'BUSINESS_OWNER');
  } else {
    chatPartners = users.filter(u => u.id !== userId); // system owner chats with anyone
  }
  
  return chatPartners.map(p => {
    const threadMsgs = messages.filter(
      m => (m.senderId === userId && m.receiverId === p.id) || 
           (m.senderId === p.id && m.receiverId === userId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const lastMsg = threadMsgs.length > 0 ? threadMsgs[threadMsgs.length - 1] : undefined;
    const unreadCount = threadMsgs.filter(m => m.receiverId === userId && m.unread).length;
    
    // Static online status mapping
    let onlineStatus = false;
    if (p.id === 'user-sys') onlineStatus = true;
    if (p.id === 'user-biz') onlineStatus = true;
    if (p.id === 'user-mgr') onlineStatus = true;
    if (p.id === 'user-emp') onlineStatus = true;
    
    return {
      userId: p.id,
      userName: p.name,
      userRole: p.role,
      profileImage: p.profileImage,
      lastMessage: lastMsg ? lastMsg.content : 'No messages yet.',
      timestamp: lastMsg ? lastMsg.timestamp : undefined,
      unreadCount,
      onlineStatus,
    };
  });
};
