import { users, tasks, type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; 
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getAllTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByAssignee(assigneeId: number): Promise<Task[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private currentUserId: number;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create users
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@company.com",
      password: "admin123",
      fullName: "مدير النظام",
      role: "admin",
      isActive: true,
      joinedAt: new Date("2023-01-01"),
    };
    this.users.set(adminUser.id, adminUser);

    const managerUser: User = {
      id: this.currentUserId++,
      username: "manager1",
      email: "manager1@company.com", 
      password: "mgr123",
      fullName: "سارة أحمد",
      role: "manager",
      isActive: true,
      joinedAt: new Date("2023-08-20"),
    };
    this.users.set(managerUser.id, managerUser);

    const employeeUser: User = {
      id: this.currentUserId++,
      username: "employee1",
      email: "employee1@company.com",
      password: "emp123", 
      fullName: "أحمد محمد",
      role: "employee",
      isActive: true,
      joinedAt: new Date("2024-01-15"),
    };
    this.users.set(employeeUser.id, employeeUser);

    // Create tasks
    const task1: Task = {
      id: this.currentTaskId++,
      title: "مراجعة تقرير المبيعات الشهري",
      description: "مراجعة شاملة لجميع المبيعات والتحليلات الشهرية",
      priority: "high",
      status: "in_progress",
      assigneeId: employeeUser.id,
      progress: 75,
      createdAt: new Date("2025-06-15"),
      dueDate: new Date("2025-06-30"),
    };
    this.tasks.set(task1.id, task1);

    const task2: Task = {
      id: this.currentTaskId++,
      title: "تحديث الموقع الإلكتروني",
      description: "تحديث المحتوى والتصميم الجديد للموقع",
      priority: "medium",
      status: "completed",
      assigneeId: managerUser.id,
      progress: 100,
      createdAt: new Date("2025-06-10"),
      dueDate: new Date("2025-06-25"),
    };
    this.tasks.set(task2.id, task2);

    const task3: Task = {
      id: this.currentTaskId++,
      title: "إعداد العرض التقديمي للعملاء",
      description: "تحضير عرض تقديمي شامل للعملاء الجدد",
      priority: "high",
      status: "pending",
      assigneeId: employeeUser.id,
      progress: 25,
      createdAt: new Date("2025-06-20"),
      dueDate: new Date("2025-07-05"),
    };
    this.tasks.set(task3.id, task3);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      fullName: insertUser.fullName,
      role: insertUser.role || "employee",
      isActive: insertUser.isActive ?? true,
      joinedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description ?? null,
      priority: insertTask.priority,
      status: insertTask.status,
      assigneeId: insertTask.assigneeId ?? null,
      progress: insertTask.progress ?? 0,
      dueDate: insertTask.dueDate ?? null,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assigneeId === assigneeId);
  }
}

export const storage = new MemStorage();
