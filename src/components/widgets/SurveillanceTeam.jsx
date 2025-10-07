import React, { useState, useEffect } from 'react';

const SurveillanceTeam = () => {
  const [onDutyPersons, setOnDutyPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to generate a consistent color based on a person's name
  const getColorFromName = (name) => {
    // Simple hash function to convert string to number
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert hash to hue value (0-360)
    const hue = Math.abs(hash % 360);
    
    // Use HSL color with fixed saturation and lightness for consistent, pleasant colors
    // Saturation 65% and lightness 55% provide vibrant but not too bright colors
    return `hsl(${hue}, 65%, 55%)`;
  };

  // Function to get the current week number
  const getCurrentWeek = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  useEffect(() => {
    const fetchSurveillanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/surveillance');
        if (!response.ok) {
          throw new Error('Failed to fetch surveillance data');
        }
        const data = await response.json();

        // Get current week and year
        const now = new Date();
        const currentWeek = getCurrentWeek(now);
        const currentYear = now.getFullYear();

        // Find the current week's responsible persons
        const mdmData = data.MDM?.find(item => item.week === currentWeek && item.year === currentYear);
        const ediData = data.EDI?.find(item => item.week === currentWeek && item.year === currentYear);

        const persons = [];

        if (mdmData) {
          persons.push({
            id: mdmData.id,
            name: mdmData.responsible,
            role: "MDM",
            status: "available",
            avatar: mdmData.responsible.charAt(0).toUpperCase(),
            color: getColorFromName(mdmData.responsible)
          });
        }

        if (ediData) {
          persons.push({
            id: ediData.id,
            name: ediData.responsible,
            role: "Batch/EDI",
            status: "available",
            avatar: ediData.responsible.charAt(0).toUpperCase(),
            color: getColorFromName(ediData.responsible)
          });
        }

        setOnDutyPersons(persons);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching surveillance data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveillanceData();
  }, []);

  if (loading) {
    return (
      <div className="surveillance-team">
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surveillance-team">
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="surveillance-team">
      {onDutyPersons.map(person => (
        <div key={person.id} className="team-member">
          <div 
            className="member-avatar" 
            style={{ backgroundColor: person.color }}
          >
            {person.avatar}
          </div>
          <div className="member-info">
            <h3>{person.name}</h3>
            <p className="member-role">{person.role}</p>
          </div>
          {/* Availability status hidden - keeping functionality for future implementation
          <div className={`member-status status-${person.status}`}>
            <span className="status-indicator"></span>
            Tilgængelig
          </div>
          */}
        </div>
      ))}
    </div>
  );
};

export default SurveillanceTeam;
