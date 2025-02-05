import React, {useEffect, useState} from 'react';
import {FoodModifier, MenuApiClient} from '../../apiClient/apiClient';

const apiClient = new MenuApiClient('/api');

function ModifierEditor() {
    const [modifiers, setModifiers] = useState<FoodModifier[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingModifier, setEditingModifier] = useState<FoodModifier | null>(null);
    const [newModifier, setNewModifier] = useState<Partial<FoodModifier>>({
        title: '',
        description: ''
    });

    useEffect(() => {
        loadModifiers();
    }, []);

    const loadModifiers = async () => {
        try {
            const data = await apiClient.getFoodModifiers();
            setModifiers(data);
        } catch (error) {
            console.error('Failed to load modifiers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newModifier.title?.trim()) return;
        try {
            await apiClient.addFoodModifier({
                title: newModifier.title,
                description: newModifier.description || ''
            });
            setNewModifier({title: '', description: ''});
            await loadModifiers();
        } catch (error) {
            console.error('Failed to add modifier:', error);
        }
    };

    const handleUpdate = async (modifier: FoodModifier) => {
        try {
            await apiClient.updateFoodModifier(modifier.id!, {
                title: modifier.title,
                description: modifier.description
            });
            setEditingModifier(null);
            await loadModifiers();
        } catch (error) {
            console.error('Failed to update modifier:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiClient.deleteFoodModifier(id);
            await loadModifiers();
        } catch (error) {
            console.error('Failed to delete modifier:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{width: '600px'}}>
            {/* Add new modifier section */}
            <fieldset>
                <legend>Add New Modifier</legend>
                <div className="field-row-stacked">
                    <label>Title</label>
                    <input
                        type="text"
                        value={newModifier.title}
                        onChange={e => setNewModifier(prev => ({...prev, title: e.target.value}))}
                        placeholder="Enter modifier title..."
                    />
                </div>
                <div className="field-row-stacked">
                    <label>Description</label>
                    <textarea
                        rows={2}
                        value={newModifier.description}
                        onChange={e => setNewModifier(prev => ({...prev, description: e.target.value}))}
                        placeholder="Enter modifier description..."
                    />
                </div>
                <div className="field-row" style={{justifyContent: 'flex-end', marginTop: '8px'}}>
                    <button
                        onClick={handleAdd}
                        disabled={!newModifier.title?.trim() || !newModifier.description?.trim()}
                    >
                        Add Modifier
                    </button>
                </div>
            </fieldset>

            {/* List of existing modifiers */}
            <fieldset style={{marginTop: '16px'}}>
                <legend>Existing Modifiers</legend>
                <div className="sunken-panel" style={{height: '515px', overflowY: 'auto'}}>
                    {modifiers.map(modifier => (
                        <div
                            key={modifier.id}
                            className="modifier-item"
                            style={{
                                margin: '4px',
                                border: '2px solid',
                                borderColor: '#fff #888 #888 #fff',
                                borderRadius: '3px',
                                background: 'linear-gradient(to bottom, #d1e4f3 0%, #b4d0eb 100%)'
                            }}
                        >
                            <div style={{padding: '8px'}}>
                                {editingModifier?.id === modifier.id ? (
                                    // Edit mode
                                    <>
                                        <div className="field-row-stacked">
                                            <label style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: '#000',
                                                textShadow: '1px 1px #fff'
                                            }}>
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editingModifier!.title}
                                                onChange={e => setEditingModifier(prev =>
                                                    prev ? {...prev, title: e.target.value} : prev
                                                )}
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    border: '1px solid #888',
                                                    padding: '4px 8px'
                                                }}
                                            />
                                        </div>
                                        <div className="field-row-stacked">
                                            <label style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: '#000',
                                                textShadow: '1px 1px #fff'
                                            }}>
                                                Description
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={editingModifier!.description}
                                                onChange={e => setEditingModifier(prev =>
                                                    prev ? {...prev, description: e.target.value} : prev
                                                )}
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                    border: '1px solid #888',
                                                    padding: '4px 8px',
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>
                                        <div className="field-row" style={{
                                            justifyContent: 'flex-end',
                                            marginTop: '8px',
                                            gap: '4px'
                                        }}>
                                            <button
                                                onClick={() => setEditingModifier(null)}
                                                className="modifier-button"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(editingModifier!)}
                                                disabled={!editingModifier?.title.trim() || !editingModifier?.description.trim()}
                                                className="modifier-button"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // View mode
                                    <>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: '#000',
                                            marginBottom: '4px',
                                            textShadow: '1px 1px #fff'
                                        }}>
                                            {modifier.title}
                                        </div>
                                        <div style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            padding: '4px 8px',
                                            borderRadius: '2px',
                                            color: '#000',
                                            fontSize: '12px'
                                        }}>
                                            {modifier.description}
                                        </div>
                                        <div className="field-row" style={{
                                            justifyContent: 'flex-end',
                                            marginTop: '8px',
                                            gap: '4px'
                                        }}>
                                            <button
                                                onClick={() => setEditingModifier(modifier)}
                                                className="modifier-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(modifier.id!)}
                                                className="modifier-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}

export default ModifierEditor;