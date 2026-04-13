import React from 'react';
import { GovernedThreadMetadata } from '../../governed-types';

interface GovernedSummaryCardProps {
  governed?: GovernedThreadMetadata;
}

const GovernedSummaryCard: React.FC<GovernedSummaryCardProps> = ({ governed }) => {
  if (!governed) {
    return <div>No governed data available.</div>;
  }

  return (
    <div className='p-4 border rounded-lg shadow-sm bg-gray-50'>
      <h3 className='text-xl font-semibold text-gray-700'>Governed Request Summary</h3>
      <div className='mt-2 text-sm text-gray-600'>
        <p><strong>Primary Intent:</strong> {governed.primaryIntent}</p>
        <p><strong>Completeness State:</strong> {governed.completenessState}</p>
        {governed.missingFields && governed.missingFields.length > 0 && (
          <div>
            <strong>Missing Fields:</strong>
            <ul>
              {governed.missingFields.map((field, index) => (
                <li key={index}>{field.field} — {field.reason}</li>
              ))}
            </ul>
          </div>
        )}
        {governed.riskFlags && governed.riskFlags.length > 0 && (
          <div>
            <strong>Risk Flags:</strong>
            <ul>
              {governed.riskFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>
        )}
        {governed.suspicionFlags && governed.suspicionFlags.length > 0 && (
          <div>
            <strong>Suspicion Flags:</strong>
            <ul>
              {governed.suspicionFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernedSummaryCard;