import React from 'react';

interface RoadmapDisplayProps {
  roadmap: string;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ roadmap }) => {
  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Crop Roadmap</h2>
      <div dangerouslySetInnerHTML={{ __html: roadmap }} />
    </div>
  );
};

export default RoadmapDisplay;