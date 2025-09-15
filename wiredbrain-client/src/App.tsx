import React, { useState } from 'react';
import { InventoryLookup } from './components/InventoryLookup'
import './styles.css';

export const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  return (
    <div className="app-container">
      <h1>WiredBrain Coffee Inventory</h1>
      <InventoryLookup selectedId={selectedId} onChangeId={setSelectedId} />
    </div>
  );
};
