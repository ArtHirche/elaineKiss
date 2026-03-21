import { User, CreateUserInput } from '@/types/user';

class Database {
  private users: User[] = [];

  async createUser(userData: CreateUserInput): Promise<User> {
    const isFirstUser = this.users.length === 0;
    
    const user: User = {
      id: this.generateId(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      provider: userData.provider || 'email',
      providerId: userData.providerId,
      role: userData.role || (isFirstUser ? 'admin' : 'user'),
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.users.find(user => user.provider === provider && user.providerId === providerId) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

export const db = new Database();
