import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InventoryLookup } from '../components/InventoryLookup';
import React from 'react';

describe('InventoryLookup', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn();
  });

  it('renders loading then data', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ Id:1, LocationName:'Test', KgDarkRoast:1, KgMediumRoast:2, KgLightRoast:3, KgSeasonalRoast:4 }) });
    render(<InventoryLookup selectedId={1} onChangeId={() => {}} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText('Test'));
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('allows changing id', async () => {
    (fetch as any).mockResolvedValue({ ok: true, json: async () => ({ Id:2, LocationName:'Two', KgDarkRoast:1, KgMediumRoast:2, KgLightRoast:3, KgSeasonalRoast:4 }) });
    const onChangeId = vi.fn();
    render(<InventoryLookup selectedId={2} onChangeId={onChangeId} />);
    const input = screen.getByLabelText(/location id/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3' } });
    expect(onChangeId).toHaveBeenCalledWith(3);
  });
});
