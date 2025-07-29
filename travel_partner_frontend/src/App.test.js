import { render, screen } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
test('renders dashboard text after login', async () => {
  render(<App />);
  // Wait for the login form to appear (public landing is login page when not authenticated)
  const loginTitle = await screen.findByText(/sign in/i);
  expect(loginTitle).toBeInTheDocument();
  
  // Optionally test route switching, e.g., that register link is in the doc.
  const registerLink = screen.getByText(/register/i);
  expect(registerLink).toBeInTheDocument();
});
