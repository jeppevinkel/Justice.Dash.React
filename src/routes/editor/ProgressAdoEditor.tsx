import React, { useState, useEffect } from "react";
import { MenuApiClient, ProgressType } from "../../apiClient/apiClient";

const apiClient = new MenuApiClient('/api');

function ProgressAdoEditor() {
    const [completed, setCompleted] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const progress = await apiClient.getProgressStatus(ProgressType.azureDevOps);
            if (progress) {
                setCompleted(progress.completedItems);
                setTotal(progress.totalItems);
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProgress = async () => {
        try {
            await apiClient.updateProgressStatus({
                completedItems: completed,
                totalItems: total
            }, ProgressType.azureDevOps);
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>ADO Progress Settings</h2>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    Total Items:
                    <input
                        type="number"
                        min="0"
                        value={total}
                        onChange={(e) => setTotal(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{
                            padding: "5px",
                            margin: "0 10px",
                            border: "1px solid #a5a5a5",
                        }}
                    />
                </label>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    Completed Items:
                    <input
                        type="number"
                        min="0"
                        max={total}
                        value={completed}
                        onChange={(e) => setCompleted(Math.max(0, Math.min(total, parseInt(e.target.value) || 0)))}
                        style={{
                            padding: "5px",
                            margin: "0 10px",
                            border: "1px solid #a5a5a5",
                        }}
                    />
                </label>
                <div className="field-row" style={{justifyContent: 'flex-start', marginTop: '8px'}}>
                    <button
                        onClick={updateProgress}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                <h3>Preview:</h3>
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "#b0b0b0",
                        borderRadius: "4px",
                        overflow: "hidden",
                        height: "25px",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${(completed / total) * 100}%`,
                            background: "linear-gradient(90deg, #73b973, #2d862d)",
                            textAlign: "center",
                            lineHeight: "25px",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {((completed / total) * 100).toFixed(2)}%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgressAdoEditor;