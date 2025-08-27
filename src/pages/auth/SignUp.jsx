
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const sendVerificationCode = async (email) => {
  try {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok && data.code) {
      return data.code;
    } else if (res.ok && data.message) {
      return null;
    } else {
      throw new Error(data.error || 'Failed to send code');
    }
  } catch (err) {
    throw new Error('Network error');
  }
};

const SignUp = () => {
  // Back button handler
  const handleBack = () => {
    if (step === 1) {
      navigate(-1); // Go back to previous page
    } else {
      setStep(step - 1);
      setError("");
      setInfo("");
    }
  };
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const fileInputRef = useRef();
  const [skipPic, setSkipPic] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(null);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const timerRef = useRef();

  useEffect(() => {
    if (!codeSent) return;
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setError('Verification code expired. Please request a new code.');
          setCodeSent(false);
          setVerificationCode('');
          setInputCode('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [codeSent]);

  // Step 1: User info
  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields required');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2: Terms and verification
  const handleSendCode = async () => {
    if (!termsAccepted) {
      setError('You must accept the Terms of Service');
      setInfo('');
      return;
    }
    setError('');
    setInfo('');
    try {
      const code = await sendVerificationCode(email);
      setVerificationCode(code);
      setCodeSent(true);
      setCodeExpiry(Date.now() + 600000); // 10 min from now
      setTimer(600);
      setInfo('');
    } catch (err) {
      setError(err.message);
    }
  };
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!codeSent) {
      setError('Please request a verification code first.');
      return;
    }
    if (!verificationCode || !inputCode) {
      setError('Please enter the code sent to your email.');
      return;
    }
    if (Date.now() > codeExpiry) {
      setError('Verification code expired. Please request a new code.');
      setCodeSent(false);
      setVerificationCode('');
      setInputCode('');
      return;
    }
    if (inputCode !== verificationCode) {
      setError('Verification code is incorrect.');
      return;
    }
    setError('');
    setStep(3);
    if (skipPic) {
      await handleSignUp({ preventDefault: () => {} });
    }
  };

  // Step 3: Profile pic
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('Please fill all required fields.');
      return;
    }
    if (codeSent && verificationCode && inputCode !== verificationCode && !skipPic) {
      setError('Verification code is incorrect.');
      return;
    }
    try {
      const payload = { username, email, password };
      if (!skipPic && profilePic) payload.avatar = profilePic;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError('Server error: Invalid response.');
        return;
      }
      if (res.ok) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem('token', loginData.token);
          navigate('/task-dashboard');
        } else {
          navigate('/signin');
        }
      } else {
        setError(data.error || data.message || JSON.stringify(data) || 'Sign up failed. Please check your info and try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-sm p-8 rounded-xl glass shadow-lg">
        {/* Back Button */}
        <button
          type="button"
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium"
          onClick={handleBack}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10H5m0 0l5-5m-5 5l5 5"/></svg>
          Back
        </button>
        {/* Step slider */}
        <div className="flex mb-6 justify-center gap-2">
          {[1,2,3].map(n => (
            <div key={n} className={`w-8 h-2 rounded-full ${step===n?'bg-primary':'bg-muted'}`}></div>
          ))}
        </div>
        {step === 1 && (
          <form onSubmit={handleNextStep1}>
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            {error && <div className="mb-4 text-red-500 rounded-lg bg-red-100 p-2 text-center font-medium">{error}</div>}
            {info && <div className="mb-4 text-blue-500 rounded-lg bg-blue-100 p-2 text-center font-medium">{info}</div>}
            <input type="text" placeholder="Username" className="w-full mb-4 p-3 rounded-lg border border-border bg-input text-foreground" value={username} onChange={e=>setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" className="w-full mb-4 p-3 rounded-lg border border-border bg-input text-foreground" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full mb-6 p-3 rounded-lg border border-border bg-input text-foreground" value={password} onChange={e=>setPassword(e.target.value)} required />
            <Button type="submit" variant="default" className="w-full mb-2">Next</Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="flex flex-col items-center mb-6">
              <Icon name="AppLogo" size={48} className="text-primary mb-2" />
              <h2 className="text-2xl font-bold text-primary mb-2">Verify & Accept Terms</h2>
              <p className="text-center text-muted-foreground mb-2">Thanks for choosing us! Together, let's maintain your life tasks better.</p>
            </div>
            {error && <div className="mb-4 text-red-500 rounded-lg bg-red-100 p-2 text-center font-medium">{error}</div>}
            {info && <div className="mb-4 text-blue-500 rounded-lg bg-blue-100 p-2 text-center font-medium">{info}</div>}
            <label className="flex items-center mb-4">
              <input type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} className="mr-2" />
              <span>I accept the <a href="/terms" className="text-primary underline">Terms of Service</a></span>
            </label>
            {!codeSent ? (
              <Button type="button" variant="default" className="w-full mb-2" onClick={handleSendCode}>Send Verification Code</Button>
            ) : (
              <>
                <div className="mb-4 flex flex-col items-center">
                  <input type="text" maxLength={4} placeholder="Enter 4-digit code" className="w-full mb-2 p-3 rounded-lg border border-border bg-input text-foreground text-center" value={inputCode} onChange={e=>setInputCode(e.target.value)} required />
                  <div className="text-xs text-muted-foreground text-center mb-2">Code expires in: <span className="font-bold">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</span></div>
                </div>
                <Button type="submit" variant="default" className="w-full mb-2">Verify & Next</Button>
              </>
            )}
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleSignUp}>
            <h2 className="text-2xl font-bold mb-6">Profile Picture</h2>
            {error && <div className="mb-4 text-red-500 rounded-lg bg-red-100 p-2 text-center font-medium">{error}</div>}
            {info && <div className="mb-4 text-blue-500 rounded-lg bg-blue-100 p-2 text-center font-medium">{info}</div>}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden glass-light mb-2">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <label className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Upload Photo
                </Button>
              </label>
            </div>
            <Button type="submit" variant="default" className="w-full mb-2">Finish Sign Up</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => { setSkipPic(true); handleSignUp({ preventDefault: () => {} }); }}>Skip for Later</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
