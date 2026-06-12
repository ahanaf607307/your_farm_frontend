export type Role = 'SYSTEM_OWNER' | 'BUSINESS_OWNER' | 'FARM_MANAGER' | 'FARM_EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  businessId?: string;
  farmId?: string;
  profileImage?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type FarmType =
  | 'POULTRY'
  | 'DAIRY'
  | 'GOAT'
  | 'FISH'
  | 'DUCK'
  | 'BIRD'
  | 'CATTLE'
  | 'SHEEP';

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  email: string;
  status: 'active' | 'inactive';
  monthlyRevenue: number;
  weeklyRevenue: number;
  yearlyRevenue: number;
  activeUsers: number;
  totalFarms: number;
  subscriptionType: 'Basic' | 'Standard' | 'Enterprise';
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  type: FarmType;
  businessId: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt: string;
  managersCount: number;
  employeesCount: number;
}

export interface AnimalCategory {
  id: string;
  name: string;
  farmId: string;
  description: string;
  animalCount: number;
}

export interface Animal {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  age: string; // e.g., "12 weeks", "2 years"
  purchaseDate: string;
  weight: number; // in kg
  status: 'healthy' | 'sick' | 'sold' | 'quarantine';
  farmId: string;
  section: string; // e.g., "Section A"
  createdAt: string;
}

export type ScheduleTime = 'morning' | 'noon' | 'evening';
export type MedicineStatus = 'pending' | 'completed' | 'missed';

export interface Medicine {
  id: string;
  name: string;
  farmId: string;
  assignedType: 'animal' | 'category' | 'section';
  assignedToId: string; // animal id, category id, or section label
  assignedToName: string;
  schedule: ScheduleTime[];
  stock: number; // total bottles/packs
  usedStock: number;
  remainingStock: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

export interface MedicineHistory {
  id: string;
  medicineId: string;
  medicineName: string;
  assignedToName: string;
  time: ScheduleTime;
  status: MedicineStatus;
  date: string;
  completedAt?: string;
  completedBy?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  farmId: string;
  assignedType: 'category' | 'section';
  assignedToId: string; // category id or section label
  assignedToName: string;
  schedule: ScheduleTime[];
  stock: number; // in kg
  dailyUsage: number; // in kg
  monthlyUsage: number; // in kg
  status: 'available' | 'low_stock' | 'out_of_stock';
}

export type TaskType = 'feed' | 'medicine' | 'vaccination' | 'cleaning' | 'maintenance';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  assignedToId: string;
  assignedToName: string;
  createdById: string;
  createdByName: string;
  farmId: string;
  status: TaskStatus;
  dueDate: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  receiverId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  unread: boolean;
}

export interface ChatSession {
  userId: string;
  userName: string;
  userRole: Role;
  profileImage?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount: number;
  onlineStatus: boolean;
}

export type NotificationType =
  | 'medicine_time'
  | 'food_time'
  | 'task_assigned'
  | 'task_completed'
  | 'low_stock'
  | 'farm_alerts'
  | 'employee_updates';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  farmId?: string;
  businessId?: string;
  read: boolean;
  createdAt: string;
}
