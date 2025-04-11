import { useEffect, useState } from 'react';
import { MenuApiClient, SurveillanceEntry, SurveillanceEntryCreate } from '../../apiClient/apiClient';
import { getWeekNumber } from '../../utils/dateUtils';

function SurveillanceEditor() {
    const [surveillanceEntries, setSurveillanceEntries] = useState<SurveillanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // For new entry form
    const [showNewEntryForm, setShowNewEntryForm] = useState(false);
    const [newEntry, setNewEntry] = useState<SurveillanceEntryCreate>({
        type: 'MDM',
        week: getWeekNumber(new Date()),
        year: new Date().getFullYear(),
        responsible: ''
    });
    
    // For editing
    const [editingEntry, setEditingEntry] = useState<SurveillanceEntry | null>(null);
    
    const apiClient = new MenuApiClient('/api');



    const fetchSurveillanceEntries = async () => {
        setLoading(true);
        try {
            const entries = await apiClient.getSurveillanceEntries(true);
            setSurveillanceEntries(entries);
            setError(null);
        } catch (err) {
            setError('Failed to fetch surveillance entries');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveillanceEntries();
    }, []);

    const handleAddEntry = async () => {
        try {
            await apiClient.createSurveillanceEntry(newEntry);
            await fetchSurveillanceEntries();
            setShowNewEntryForm(false);
            setNewEntry({
                type: 'MDM',
                week: getWeekNumber(new Date()),
                year: new Date().getFullYear(),
                responsible: ''
            });
        } catch (err) {
            setError('Failed to add surveillance entry');
            console.error(err);
        }
    };

    const handleUpdateEntry = async () => {
        if (!editingEntry) return;

        try {
            await apiClient.updateSurveillanceEntry(editingEntry.id, editingEntry);
            await fetchSurveillanceEntries();
            setEditingEntry(null);
        } catch (err) {
            setError('Failed to update surveillance entry');
            console.error(err);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (!confirmed) return;

        try {
            await apiClient.deleteSurveillanceEntry(id);
            await fetchSurveillanceEntries();
        } catch (err) {
            setError('Failed to delete surveillance entry');
            console.error(err);
        }
    };

    const handleEditClick = (entry: SurveillanceEntry) => {
        setEditingEntry({ ...entry });
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
    };

    const handleCancelAdd = () => {
        setShowNewEntryForm(false);
        setNewEntry({
            type: 'MDM',
            week: getWeekNumber(new Date()),
            year: new Date().getFullYear(),
            responsible: ''
        });
    };

    if (loading && surveillanceEntries.length === 0) {
        return <div>Loading surveillance entries...</div>;
    }

    return (
        <div className="surveillance-editor" style={{ padding: '15px', height: '100%', overflow: 'auto' }}>
            <h2>Surveillance Schedule</h2>
            
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                    {error}
                </div>
            )}
            
            <div className="actions" style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setShowNewEntryForm(true)}
                    disabled={showNewEntryForm}
                >
                    Add New Entry
                </button>
            </div>
            
            {/* New Entry Form */}
            {showNewEntryForm && (
                <div className="window" style={{ marginBottom: '20px', padding: '10px' }}>
                    <div className="window-title">New Surveillance Entry</div>
                    <div className="field-row" style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px', width: '100px', display: 'inline-block' }}>Type:</label>
                        <select 
                            value={newEntry.type}
                            onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                        >
                            <option value="MDM">MDM</option>
                            <option value="EDI">EDI</option>
                        </select>
                    </div>
                    
                    <div className="field-row" style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px', width: '100px', display: 'inline-block' }}>Week:</label>
                        <input 
                            type="number" 
                            value={newEntry.week}
                            onChange={(e) => setNewEntry({...newEntry, week: parseInt(e.target.value)})}
                        />
                    </div>
                    
                    <div className="field-row" style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px', width: '100px', display: 'inline-block' }}>Year:</label>
                        <input 
                            type="number" 
                            value={newEntry.year}
                            onChange={(e) => setNewEntry({...newEntry, year: parseInt(e.target.value)})}
                        />
                    </div>
                    
                    <div className="field-row" style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px', width: '100px', display: 'inline-block' }}>Responsible:</label>
                        <input 
                            type="text" 
                            value={newEntry.responsible}
                            onChange={(e) => setNewEntry({...newEntry, responsible: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-actions" style={{ marginTop: '15px' }}>
                        <button onClick={handleAddEntry}>Save</button>
                        <button onClick={handleCancelAdd} style={{ marginLeft: '10px' }}>Cancel</button>
                    </div>
                </div>
            )}
            
            {/* Entries Table */}
            <div className="window" style={{ flex: 1 }}>
                <div className="window-title">Surveillance Entries</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '6px', borderBottom: '1px solid #ddd' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '6px', borderBottom: '1px solid #ddd' }}>Week</th>
                            <th style={{ textAlign: 'left', padding: '6px', borderBottom: '1px solid #ddd' }}>Year</th>
                            <th style={{ textAlign: 'left', padding: '6px', borderBottom: '1px solid #ddd' }}>Responsible</th>
                            <th style={{ textAlign: 'center', padding: '6px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surveillanceEntries.map((entry) => (
                            <tr key={entry.id}>
                                {editingEntry && editingEntry.id === entry.id ? (
                                    // Edit Mode
                                    <>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                                            <select 
                                                value={editingEntry.type}
                                                onChange={(e) => setEditingEntry({...editingEntry, type: e.target.value})}
                                            >
                                                <option value="MDM">MDM</option>
                                                <option value="EDI">EDI</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                                            <input 
                                                type="number" 
                                                value={editingEntry.week}
                                                onChange={(e) => setEditingEntry({...editingEntry, week: parseInt(e.target.value)})}
                                                style={{ width: '60px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                                            <input 
                                                type="number" 
                                                value={editingEntry.year}
                                                onChange={(e) => setEditingEntry({...editingEntry, year: parseInt(e.target.value)})}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                                            <input 
                                                type="text" 
                                                value={editingEntry.responsible}
                                                onChange={(e) => setEditingEntry({...editingEntry, responsible: e.target.value})}
                                            />
                                        </td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                            <button onClick={handleUpdateEntry}>Save</button>
                                            <button onClick={handleCancelEdit} style={{ marginLeft: '5px' }}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    // View Mode
                                    <>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{entry.type}</td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{entry.week}</td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{entry.year}</td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{entry.responsible}</td>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                            <button onClick={() => handleEditClick(entry)}>Edit</button>
                                            <button 
                                                onClick={() => handleDeleteEntry(entry.id)} 
                                                style={{ marginLeft: '5px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        
                        {surveillanceEntries.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '15px' }}>
                                    No surveillance entries found. Create a new one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SurveillanceEditor;