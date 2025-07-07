import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../contexts/ToastContext';

// Test component that uses the toast
const TestComponent = () => {
  const { toast } = useToast();

  return (
    <div>
      <button onClick={() => toast({ message: 'Test message', type: 'success' })}>
        Show Toast
      </button>
    </div>
  );
};

describe('Toast', () => {
  it('should show a toast message when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Initially, no toast should be visible
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();

    // Click the button to show toast
    fireEvent.click(screen.getByText('Show Toast'));

    // Now the toast should be visible
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
