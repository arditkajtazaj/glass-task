import React, { useState } from 'react';
import ModalOverlay from '../../components/ui/ModalOverlay';
import Icon from '../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/task-dashboard');
      } else {
        setError(data.error || 'Sign in failed');
      }
    } catch {
      setError('Network error');
    }
  };
  const [showGuestModal, setShowGuestModal] = useState(false);
  const handleGuestSignIn = () => setShowGuestModal(true);
  const handleGuestConfirm = () => {
    localStorage.setItem('guest', 'true');
    setShowGuestModal(false);
    navigate('/task-dashboard');
  };
  const handleGuestCancel = () => setShowGuestModal(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <form className="w-full max-w-sm p-8 rounded-xl glass shadow-lg" onSubmit={handleSignIn}>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg border border-border bg-input text-foreground"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg border border-border bg-input text-foreground"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="default" className="w-full mb-2">Sign In</Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/signup')}>Sign Up</Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full transition-all duration-200 hover:border-2 hover:border-primary hover:text-primary hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={handleGuestSignIn}
        >
          Sign in as Guest
        </Button>
      </form>
      {/* Guest Mode Modal */}
      <ModalOverlay isOpen={showGuestModal} onClose={handleGuestCancel} title="Guest Mode">
        <div className="flex flex-col items-center gap-4">
          <Icon name="User" size={48} className="text-primary" />
          <h2 className="text-xl font-bold text-primary">Continue as Guest</h2>
          <p className="text-sm text-muted-foreground text-center">Data will not be saved after logout.</p>
          <div className="flex gap-3 mt-4">
            <Button variant="default" onClick={handleGuestConfirm} className="px-6">Continue</Button>
            <Button variant="secondary" onClick={handleGuestCancel} className="px-6">Cancel</Button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
};
export default SignIn;
