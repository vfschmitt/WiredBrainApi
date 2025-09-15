import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLocationInventory } from '../services/inventoryService';

describe('inventoryService', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn();
  });

  it('maps PascalCase properties', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ Id:1, LocationName:'Test', KgDarkRoast:1, KgMediumRoast:2, KgLightRoast:3, KgSeasonalRoast:4 }) });
    const inv = await getLocationInventory(1);
    expect(inv.locationName).toBe('Test');
    expect(inv.kgSeasonalRoast).toBe(4);
  });

  it('throws on 404', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(getLocationInventory(999)).rejects.toThrow(/not found/i);
  });
});
