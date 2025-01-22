import React, { useEffect, useState } from 'react';
import { MenuApiClient, MenuItem, MenuItemUpdate } from '../apiClient/apiClient';

const apiClient = new MenuApiClient('/api');

function MenuEditor() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [foodModifiers, setFoodModifiers] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [items, modifiers] = await Promise.all([
                    apiClient.getMenuItems(true),
                    apiClient.getFoodModifiers()
                ]);
                setMenuItems(items.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
                setFoodModifiers(modifiers);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleUpdate = async (update: MenuItemUpdate) => {
        if (!selectedItem) return;

        try {
            const updated = await apiClient.updateMenuItem(selectedItem.id, update);
            setMenuItems(items => items.map(item =>
                item.id === updated.id ? updated : item
            ));
            setSelectedItem(updated);
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    if (loading) {
        return <div className="window"><div className="title-bar">Loading...</div></div>;
    }

    return (
        <div className="window" style={{ margin: '20px', maxWidth: '1200px' }}>
    <div className="title-bar">
    <div className="title-bar-text">Menu Editor</div>
    </div>

    <div className="window-body" style={{ display: 'flex' }}>
    {/* Left side - Menu Items List */}
    <div style={{ width: '300px', marginRight: '20px' }}>
    <div className="field-row" style={{ marginBottom: '10px' }}>
    <label>Menu Items</label>
    </div>
    <div className="sunken-panel" style={{ height: '400px', overflowY: 'auto' }}>
    {menuItems.map(item => (
        <div
            key={item.id}
        className={`menu-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
        onClick={() => setSelectedItem(item)}
        style={{
        padding: '4px',
            cursor: 'pointer',
            backgroundColor: selectedItem?.id === item.id ? '#000080' : 'transparent',
            color: selectedItem?.id === item.id ? 'white' : 'black'
    }}
    >
        {item.date} - {item.foodDisplayName}
    </div>
    ))}
    </div>
    </div>

    {/* Right side - Editor */}
    {selectedItem && (
        <div style={{ flex: 1 }}>
        <fieldset>
            <legend>Edit Menu Item</legend>

    <div className="field-row-stacked">
        <label>Food Name</label>
    <input
        type="text"
        value={selectedItem.foodName}
        onChange={e => handleUpdate({ foodName: e.target.value })}
        />
        </div>

        <div className="field-row-stacked">
        <label>Corrected Name</label>
    <input
        type="text"
        value={selectedItem.correctedFoodName || ''}
        onChange={e => handleUpdate({ correctedFoodName: e.target.value })}
        />
        </div>

        <div className="field-row-stacked">
        <label>Veganized Name</label>
    <input
        type="text"
        value={selectedItem.veganizedFoodName || ''}
        onChange={e => handleUpdate({ veganizedFoodName: e.target.value })}
        />
        </div>

        <div className="field-row-stacked">
        <label>Description</label>
        <textarea
        rows={2}
        value={selectedItem.description || ''}
        onChange={e => handleUpdate({ description: e.target.value })}
        />
        </div>

        <div className="field-row-stacked">
        <label>Veganized Description</label>
    <textarea
        rows={2}
        value={selectedItem.veganizedDescription || ''}
        onChange={e => handleUpdate({ veganizedDescription: e.target.value })}
        />
        </div>

        <div className="field-row-stacked">
        <label>Food Modifier</label>
    <select
        value={selectedItem.foodModifier || ''}
        onChange={e => handleUpdate({ foodModifier: e.target.value })}
    >
        <option value="">None</option>
        {foodModifiers.map(modifier => (
            <option key={modifier} value={modifier}>
            {modifier}
            </option>
        ))}
        </select>
        </div>

        <div className="field-row" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={() => handleUpdate({
        regenerateNames: true,
        regenerateDescriptions: true,
        regenerateFoodContents: true
    })}>
        Regenerate Text
    </button>
    <button onClick={() => handleUpdate({
        regenerateImages: true
    })}>
        Regenerate Images
    </button>
    </div>
    </fieldset>

        {/* Image Preview */}
        {(selectedItem.image || selectedItem.veganizedImage) && (
            <fieldset style={{ marginTop: '20px' }}>
            <legend>Images</legend>
            <div style={{ display: 'flex', gap: '20px' }}>
            {selectedItem.image && (
                <div>
                    <label>Regular Image</label>
            <img
                src={selectedItem.image.path}
                alt="Food"
                style={{ maxWidth: '300px', display: 'block' }}
                />
                </div>
            )}
            {selectedItem.veganizedImage && (
                <div>
                    <label>Veganized Image</label>
            <img
                src={selectedItem.veganizedImage.path}
                alt="Veganized Food"
                style={{ maxWidth: '300px', display: 'block' }}
                />
                </div>
            )}
            </div>
            </fieldset>
        )}
        </div>
    )}
    </div>
    </div>
);
}

export default MenuEditor;