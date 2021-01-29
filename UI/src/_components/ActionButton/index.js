import React from 'react';
import { Button } from 'antd';
import './ActionButton.scss';

export default function ActionButton({ icon, text, onClick }) {
  return (
    <div className="action-button">
      <Button icon={React.createElement(icon)} onClick={onClick}>
        {text}
      </Button>
    </div>
  );
}
