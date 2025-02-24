import React, { useState } from "react";
import Window from "../Window";

const ProgressbarADO: React.FC = () => {
  const [completed, setCompleted] = useState<number>(0);
  const total: number = 43;

  const updateProgress = (value: string | number): void => {
    const validValue = Math.max(0, Math.min(total, Number(value)));
    setCompleted(validValue);
  };

  return (
    <Window title="Azure DevOps projekter importeret til terraform" sx={{ width: "420px" }}>
      <div
        style={{
          background: "#e3e3e3",
          border: "2px solidrgb(255, 252, 252)",
          borderRadius: "6px",
          boxShadow: "4px 4px 10px rgb(255, 255, 255)",
          padding: "0",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ padding: "15px", textAlign: "center" }}>
          <label htmlFor="completed">Completed Imports:</label>
          <input
            type="number"
            id="completed"
            min="0"
            max={total}
            value={completed}
            onChange={(e) => updateProgress(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && updateProgress(e.currentTarget.value)
            }
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
    </Window>
  );
};

export default ProgressbarADO;