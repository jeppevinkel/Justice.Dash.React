import React, { useState, useEffect } from "react";
import { MenuApiClient, ProgressType } from "../apiClient/apiClient";

const apiClient = new MenuApiClient('/api');

type Props = {
  progressType: ProgressType
}

function ProgressbarADO(props: Props) {
  const [completed, setCompleted] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState((<></>));

  useEffect(() => {
    loadProgress();

    const interval = setInterval(loadProgress, 10000);

    switch (props.progressType) {
      case ProgressType.github:
        setTitle(<b>Repositories<br/>migreret til GitHub</b>);
        break;
    }

    return () => clearInterval(interval);
  }, [props.progressType]);

  const loadProgress = async () => {
    try {
      const progress = await apiClient.getProgressStatus(props.progressType);
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

  const updateProgress = async (value: string | number): Promise<void> => {
    const validValue = Math.max(0, Math.min(total, Number(value)));
    try {
      await apiClient.updateProgressStatus({
        completedItems: validValue,
        totalItems: total
      }, props.progressType);
      setCompleted(validValue);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "15px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return (
      <div
        style={{
          background: "#e3e3e3",
          border: "2px solidrgb(255, 252, 252)",
          borderRadius: "6px",
          padding: "0",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ padding: "15px", textAlign: "center" }}>
          <p>{title}</p>
          <label htmlFor="completed">Completed Imports:</label>
          <input
            type="number"
            id="completed"
            min="0"
            max={total}
            value={completed}
            onChange={(e) => updateProgress(e.target.value)}
            style={{
              padding: "5px",
              margin: "10px",
              border: "1px solid #a5a5a5",
              background: "#ffffff",
            }}
          />

          <div
            style={{
              width: "100%",
              backgroundColor: "#b0b0b0",
              border: "1px solid #808080",
              borderRadius: "4px",
              margin: "20px 0",
              overflow: "hidden",
              height: "25px",
              boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.2)",
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
                transition: "width 0.5s ease-in-out",
              }}
            >
              {((completed / total) * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProgressbarADO;