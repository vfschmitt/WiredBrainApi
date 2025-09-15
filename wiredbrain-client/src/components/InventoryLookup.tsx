import React, { useEffect, useState } from 'react';
import { getLocationInventory, LocationInventory } from '../services/inventoryService';

interface Props {
  selectedId: number;
  onChangeId: (id: number) => void;
}

export const InventoryLookup: React.FC<Props> = ({ selectedId, onChangeId }) => {
  const [data, setData] = useState<LocationInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    getLocationInventory(selectedId)
      .then(inv => { if(!ignore) setData(inv); })
      .catch(e => { if(!ignore) setError(e.message); })
      .finally(() => { if(!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [selectedId]);

  return (
    <div className="inventory-lookup">
      <label>
        Location Id: 
        <input type="number" value={selectedId} min={1} onChange={e => onChangeId(Number(e.target.value))} />
      </label>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {(!loading && !error && data) && (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Dark (kg)</th>
              <th>Light (kg)</th>
              <th>Medium (kg)</th>
              <th>Seasonal (kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.locationName}</td>
              <td>{data.kgDarkRoast}</td>
              <td>{data.kgLightRoast}</td>
              <td>{data.kgMediumRoast}</td>
              <td>{data.kgSeasonalRoast}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
