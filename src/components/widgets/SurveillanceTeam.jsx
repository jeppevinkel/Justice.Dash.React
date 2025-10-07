import React from 'react';

const SurveillanceTeam = () => {
  const onDutyPersons = [
    {
      id: 1,
      name: "Lars",
      role: "MDM",
      status: "available",
      avatar: "L",
      color: "#3b82f6" // blue
    },
    {
      id: 2,
      name: "Bjarke",
      role: "Batch/EDI",
      status: "available",
      avatar: "B",
      color: "#8b5cf6" // purple
    }
  ];

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
          <div className={`member-status status-${person.status}`}>
            <span className="status-indicator"></span>
            Tilgængelig
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveillanceTeam;
