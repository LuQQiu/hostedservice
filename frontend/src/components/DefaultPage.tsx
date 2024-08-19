import React from 'react';

interface DefaultPageProps {
  username: string;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ username }) => (
  <div style={{ padding: '24px', width: '90%' }}>
    <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>Welcome, {username}!</h2>
  </div>
);

export default DefaultPage;
