import React, {useEffect, useState} from 'react';
import {FoodModifier, MenuApiClient, MenuItem, MenuItemUpdate} from '../../apiClient/apiClient';
import win7bg from '../../images/win7bg.jpg';
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';

const apiClient = new MenuApiClient('/api');

function MenuEditor() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [foodModifiers, setFoodModifiers] = useState<FoodModifier[]>([]);
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

        const interval = setInterval(async () => {
            const items = await apiClient.getMenuItems(true);
            setMenuItems(items.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));

            setSelectedItem(curr => {
                if (curr) {
                    const updated = items.find(item => item.date === curr.date) ?? null;
                    // console.log(updated)
                    // if (updated) setSelectedItem(updated);
                    return updated;
                }

                return curr;
            })

        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getPendingStatus = (item: MenuItem) => {
        const pending = [];
        if (item.needsNameCorrection) pending.push('Name Correction');
        if (item.needsVeganization) pending.push('Veganization');
        if (item.needsDescription) pending.push('Description');
        if (item.needsVeganDescription) pending.push('Vegan Description');
        if (item.needsFoodContents) pending.push('Food Contents');
        if (item.needsImageRegeneration) pending.push('Image');
        if (item.needsVeganImageRegeneration) pending.push('Vegan Image');
        if (item.needsRecipeGeneration) pending.push('Recipe');
        return pending;
    };

    const handleUpdate = async (update: MenuItemUpdate) => {
        if (!selectedItem) return;

        try {
            const updated = await apiClient.updateMenuItem(selectedItem.date, update);
            setMenuItems(items => items.map(item =>
                item.date === updated.date ? updated : item
            ));
            setSelectedItem(updated);
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    if (loading) {
        return <div className="window">
            <div className="title-bar">Loading...</div>
        </div>;
    }

    return (<div style={{width: '1200px', display: 'flex'}}>
            {/* Left side - Menu Items List */}
            <div style={{width: '300px', marginRight: '20px'}}>
                <div className="field-row" style={{marginBottom: '10px'}}>
                    <label>Menu Items</label>
                </div>
                <div className="sunken-panel" style={{height: '400px', overflowY: 'auto'}}>
                    {menuItems.map(item => {
                        const pending = getPendingStatus(item);
                        return (
                            <div
                                key={item.date}
                                className={`menu-item ${selectedItem?.date === item.date ? 'selected' : ''}`}
                                onClick={() => setSelectedItem(item)}
                                style={{
                                    padding: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedItem?.date === item.date ? '#000080' : 'transparent',
                                    color: selectedItem?.date === item.date ? 'white' : 'black'
                                }}
                            >
                                <div>{item.date} - {item.foodDisplayName}</div>
                                {pending.length > 0 && (
                                    <div style={{
                                        fontSize: '0.8em',
                                        color: selectedItem?.date === item.date ? '#ffff00' : '#808080'
                                    }}>
                                        Pending: {pending.join(', ')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right side - Editor */}
            {selectedItem && (
                <div style={{flex: 1}}>
                    <fieldset>
                        <legend>Edit Menu Item</legend>

                        <div className="field-row-stacked">
                            <label>Food Name</label>
                            <input
                                type="text"
                                value={selectedItem.foodName}
                                onChange={e => handleUpdate({foodName: e.target.value})}
                            />
                        </div>

                        <div className="field-row-stacked">
                            <label>Corrected Name</label>
                            <input
                                type="text"
                                value={selectedItem.correctedFoodName || ''}
                                onChange={e => handleUpdate({correctedFoodName: e.target.value})}
                            />
                            {selectedItem.needsNameCorrection && (
                                <span className="status-badge">Pending correction...</span>
                            )}
                        </div>

                        <div className="field-row-stacked">
                            <label>Veganized Name</label>
                            <input
                                type="text"
                                value={selectedItem.veganizedFoodName || ''}
                                onChange={e => handleUpdate({veganizedFoodName: e.target.value})}
                            />
                            {selectedItem.needsVeganization && (
                                <span className="status-badge">Pending veganization...</span>
                            )}
                        </div>

                        <div className="field-row-stacked">
                            <label>Description</label>
                            <textarea
                                rows={2}
                                value={selectedItem.description || ''}
                                onChange={e => handleUpdate({description: e.target.value})}
                            />
                            {selectedItem.needsDescription && (
                                <span className="status-badge">Pending description...</span>
                            )}
                        </div>

                        <div className="field-row-stacked">
                            <label>Veganized Description</label>
                            <textarea
                                rows={2}
                                value={selectedItem.veganizedDescription || ''}
                                onChange={e => handleUpdate({veganizedDescription: e.target.value})}
                            />
                            {selectedItem.needsVeganDescription && (
                                <span className="status-badge">Pending vegan description...</span>
                            )}
                        </div>

                        <div className="field-row-stacked">
                            <label>Food Modifier</label>
                            <select
                                value={selectedItem.foodModifier?.id || ''}
                                onChange={e => handleUpdate({foodModifierId: e.target.value})}
                            >
                                <option value="00000000-0000-0000-0000-000000000000">None</option>
                                {foodModifiers.map(modifier => (
                                    <option key={modifier.id} value={modifier.id}>
                                        {modifier.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-row-stacked">
                            <label>Recipe (Markdown)</label>
                            <textarea
                                rows={6}
                                value={selectedItem.recipe || ''}
                                onChange={e => handleUpdate({recipe: e.target.value})}
                                style={{ width: '100%' }}
                                placeholder="Enter recipe using Markdown syntax (# for headings, ** for bold, * for italics, * for bullet points)"
                            />
                            {selectedItem.needsRecipeGeneration && (
                                <span className="status-badge">Pending recipe generation...</span>
                            )}
                            <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                                Supports Markdown: # Heading, ## Subheading, **bold**, *italic*, * List item
                            </div>
                        </div>

                        <div className="field-row"
                             style={{justifyContent: 'space-between', marginTop: '20px'}}>
                            <button onClick={() => handleUpdate({
                                regenerateNames: true,
                                regenerateDescriptions: true,
                                regenerateFoodContents: true
                            })}
                                    disabled={
                                        selectedItem.needsNameCorrection ||
                                        selectedItem.needsVeganization ||
                                        selectedItem.needsDescription ||
                                        selectedItem.needsVeganDescription ||
                                        selectedItem.needsFoodContents
                                    }
                            >
                                Regenerate Text
                            </button>
                            <button onClick={() => handleUpdate({
                                regenerateImages: true
                            })}
                                    disabled={
                                        selectedItem.needsImageRegeneration ||
                                        selectedItem.needsVeganImageRegeneration
                                    }
                            >
                                Regenerate Images
                            </button>
                            <button onClick={() => handleUpdate({
                                regenerateRecipe: true
                            })}
                                    disabled={selectedItem.needsRecipeGeneration}
                            >
                                Regenerate Recipe
                            </button>
                        </div>
                    </fieldset>

                    {/* Image Preview */}
                    {(selectedItem.image || selectedItem.veganizedImage || selectedItem.needsImageRegeneration || selectedItem.needsVeganImageRegeneration) && (
                        <fieldset style={{marginTop: '20px'}}>
                            <legend>Images</legend>
                            <div style={{display: 'flex', gap: '20px'}}>
                                <div>
                                    <label>Regular Image</label>
                                    {selectedItem.needsImageRegeneration ? (
                                        <div className="status-box">Generating new image...</div>
                                    ) : selectedItem.image ? (
                                        <img
                                            src={selectedItem.image.path}
                                            alt="Food"
                                            style={{maxWidth: '300px', display: 'block'}}
                                        />
                                    ) : (
                                        <div className="status-box">No image available</div>
                                    )}
                                </div>
                                <div>
                                    <label>Veganized Image</label>
                                    {selectedItem.needsVeganImageRegeneration ? (
                                        <div className="status-box">Generating new vegan image...</div>
                                    ) : selectedItem.veganizedImage ? (
                                        <img
                                            src={selectedItem.veganizedImage.path}
                                            alt="Veganized Food"
                                            style={{maxWidth: '300px', display: 'block'}}
                                        />
                                    ) : (
                                        <div className="status-box">No image available</div>
                                    )}
                                </div>
                            </div>
                        </fieldset>
                    )}
                </div>
            )}
        </div>
    );
}

export default MenuEditor;