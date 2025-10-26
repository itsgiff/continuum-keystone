import { z } from 'zod';

// Skeleton entity definitions for future implementation
// These will be expanded in subsequent PRs

export const DeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  // More fields to be added
});

export const SoftwareSchema = z.object({
  id: z.string(),
  name: z.string(),
  licenseKey: z.string().optional(),
  // More fields to be added
});

export const ServiceAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  // More fields to be added
});

export const WarrantySchema = z.object({
  id: z.string(),
  itemName: z.string(),
  expirationDate: z.date(),
  // More fields to be added
});

export const RunbookSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(z.string()),
  // More fields to be added
});

export const entities = {
  device: DeviceSchema,
  software: SoftwareSchema,
  serviceAccount: ServiceAccountSchema,
  warranty: WarrantySchema,
  runbook: RunbookSchema,
};

export type Device = z.infer<typeof DeviceSchema>;
export type Software = z.infer<typeof SoftwareSchema>;
export type ServiceAccount = z.infer<typeof ServiceAccountSchema>;
export type Warranty = z.infer<typeof WarrantySchema>;
export type Runbook = z.infer<typeof RunbookSchema>;
