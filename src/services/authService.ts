import initialUserData from '@/mock/users.json';
import { UserProfile } from '@/types';
import { simulateDelay } from '@/api/client';
import { storage } from '@/services/storage';

const STORAGE_KEY_USER = 'petani_tech_user';
const STORAGE_KEY_TOKEN = 'petani_tech_token';

class AuthService {
  private async getUserFromStorage(): Promise<UserProfile | null> {
    const raw = await storage.getItem(STORAGE_KEY_USER);
    if (!raw) {
      // Default to initial user
      return initialUserData.user as UserProfile;
    }
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return initialUserData.user as UserProfile;
    }
  }

  async login(identifier: string, pass: string): Promise<UserProfile> {
    await simulateDelay(500);

    // Check credentials (dummy email / phone / username matches)
    const isValidIdentifier =
      identifier.trim().toLowerCase() === initialUserData.credentials.email.toLowerCase() ||
      identifier.trim() === '081298765432' ||
      identifier.trim().toLowerCase() === 'pakbudi';

    if (isValidIdentifier && pass === initialUserData.credentials.password) {
      const user = (await this.getUserFromStorage()) || (initialUserData.user as UserProfile);
      await storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      await storage.setItem(STORAGE_KEY_TOKEN, 'dummy-jwt-token-petanitech-' + Date.now());
      return user;
    }

    // Allow quick demo fallback or throw descriptive error
    if (pass === '123456') {
      const user = {
        ...(initialUserData.user as UserProfile),
        email: identifier.includes('@') ? identifier : 'seller@petanitech.id',
      };
      await storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      await storage.setItem(STORAGE_KEY_TOKEN, 'dummy-jwt-token-petanitech-' + Date.now());
      return user;
    }

    throw new Error('Email/Nomor HP atau password salah. Coba: seller@petanitech.id / 123456');
  }

  async getCurrentUser(): Promise<UserProfile> {
    await simulateDelay(200);
    const user = await this.getUserFromStorage();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await simulateDelay(300);
    const current = (await this.getUserFromStorage()) || (initialUserData.user as UserProfile);
    const updated = { ...current, ...updates };
    await storage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  }

  async logout(): Promise<void> {
    await simulateDelay(200);
    await storage.removeItem(STORAGE_KEY_TOKEN);
    // keep profile data for quick demo re-login if desired
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await storage.getItem(STORAGE_KEY_TOKEN));
  }
}

export const authService = new AuthService();
export default authService;
