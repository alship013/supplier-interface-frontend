import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'red',
      padding: '20px',
      margin: '20px',
      color: 'white',
      fontSize: '24px'
    }}>
      TEST COMPONENT - If you can see this, React is working!
    </div>
  );
};