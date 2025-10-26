import { describe, it, expect } from 'vitest';
import { entities } from './index';

describe('Schema entities', () => {
  it('should export entities object', () => {
    expect(entities).toBeDefined();
    expect(entities).toHaveProperty('device');
    expect(entities).toHaveProperty('software');
    expect(entities).toHaveProperty('serviceAccount');
    expect(entities).toHaveProperty('warranty');
    expect(entities).toHaveProperty('runbook');
  });

  it('should validate device schema', () => {
    const validDevice = {
      id: 'test-id',
      name: 'Test Device',
      type: 'laptop',
    };

    const result = entities.device.safeParse(validDevice);
    expect(result.success).toBe(true);
  });
});
