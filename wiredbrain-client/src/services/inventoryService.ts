export interface LocationInventory {
  id: number;
  locationName: string;
  kgDarkRoast: number;
  kgMediumRoast: number;
  kgLightRoast: number;
  kgSeasonalRoast: number;
}

export async function getLocationInventory(id: number): Promise<LocationInventory> {
  const resp = await fetch(`/Inventory/${id}`);
  if (!resp.ok) {
    throw new Error(`Inventory ${id} not found`);
  }
  // backend uses PascalCase - convert camelCase
  const data = await resp.json();
  return {
    id: data.id,
    locationName: data.locationName || data.locationName || data.LocationName,
    kgDarkRoast: data.kgDarkRoast ?? data.KgDarkRoast,
    kgMediumRoast: data.kgMediumRoast ?? data.KgMediumRoast,
    kgLightRoast: data.kgLightRoast ?? data.KgLightRoast,
    kgSeasonalRoast: data.kgSeasonalRoast ?? data.KgSeasonalRoast
  };
}
