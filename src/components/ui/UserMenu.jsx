import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full glass hover-lift press-scale focus-ring"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
      >
        {user?.profilePic ? (
          <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <Icon name="User" size={24} className="text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl glass shadow-lg border border-border/30 z-50">
          <div className="flex flex-col p-2">
            <Button variant="ghost" className="justify-start w-full" onClick={() => { setOpen(false); navigate('/settings-preferences'); }}>
              <Icon name="Settings" size={18} className="mr-2" /> Settings
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => { setOpen(false); onLogout(); }}>
              <Icon name="LogOut" size={18} className="mr-2" /> Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserMenu;
