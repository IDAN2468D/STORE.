import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login, decrypt } from '@/lib/actions/auth.actions';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

// Mock models
vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

// Mock database connection
vi.mock('@/lib/mongoose', () => ({
  connectToDB: vi.fn(),
}));

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('Authentication Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SESSION_SECRET = 'test-secret-that-is-long-enough-for-jwt';
  });

  describe('register', () => {
    it('should fail if user already exists', async () => {
      (User.findOne as any).mockResolvedValue({ email: 'test@example.com' });

      const result = await register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('משתמש עם אימייל זה כבר קיים');
    });

    it('should register a new user successfully', async () => {
      (User.findOne as any).mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue('hashed-password');
      (User.create as any).mockResolvedValue({
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });

      const result = await register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Test User');
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        password: 'hashed-password',
      }));
    });
  });

  describe('login', () => {
    it('should fail with incorrect credentials', async () => {
      (User.findOne as any).mockResolvedValue({
        email: 'test@example.com',
        password: 'hashed-password',
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      const result = await login({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('אימייל או סיסמה לא נכונים');
    });

    it('should login successfully with correct credentials', async () => {
       (User.findOne as any).mockResolvedValue({
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      const result = await login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data.email).toBe('test@example.com');
    });
  });
});
