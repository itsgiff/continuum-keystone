import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePassword } from './password.js';

describe('Password utilities', () => {
  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const result = validatePassword('Test1234');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('Test12');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('test1234');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('TEST1234');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('TestTest');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });
  });

  describe('hashPassword and verifyPassword', () => {
    it('should hash and verify passwords correctly', async () => {
      const password = 'Test1234';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);

      const isValid = await verifyPassword(hash, password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'Test1234';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(hash, 'WrongPassword1');
      expect(isValid).toBe(false);
    });

    it('should use argon2id algorithm', async () => {
      const password = 'Test1234';
      const hash = await hashPassword(password);

      // Argon2id hashes start with $argon2id$
      expect(hash.startsWith('$argon2id$')).toBe(true);
    });
  });
});
