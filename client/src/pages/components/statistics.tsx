import React from "react";

type Statistic = {
  participants: number;
  competitions: number;
  participations: number;
};

const Statistics: React.FC<{
  value: Statistic;
}> = ({ value }) => {
  return (
    <div className="statistic">
      <div className="statistic-item">
        <h1>{value?.participants}</h1>
        <p>Participants</p>
      </div>
      <div className="statistic-item">
        <h1>{value?.competitions}</h1>
        <p>Competitions</p>
      </div>
      <div className="statistic-item">
        <h1>{value?.participations}</h1>
        <p>Participations</p>
      </div>
    </div>
  );
};

export default Statistics;
