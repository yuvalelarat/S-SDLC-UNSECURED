import { useState } from 'react';
import { TextField } from '../components/textField';
import { WhiteCard } from '../components/whiteCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
  const location = useLocation();
  const { email, tempPass } = location.state || {};
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  if (!token && !email && !tempPass) {
    return (
      <WhiteCard>
        <h2 className="text-2xl font-bold pb-4 text-black text-center">
          Please login to access this page.
        </h2>
        <p
          className="text-blue-500 text-md text-center hover:cursor-pointer p-1"
          onClick={() => navigate('/login')}
        >
          Go to login.
        </p>
      </WhiteCard>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      'http://localhost:3000/api/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
    if (response.ok) {
      alert('Password reset successfully.');
      navigate('/');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Resetting failed.');
    }
  };

  const handleResetTempPass = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      'http://localhost:3000/api/auth/reset-password-no-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, tempPass, newPassword }),
      }
    );
    if (response.ok) {
      alert('Password reset successfully.');
      navigate('/');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Resetting failed.');
    }
  };

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Reset password</h2>
      <form onSubmit={token ? handleReset : handleResetTempPass}>
        {!tempPass && !email && (
          <div className="py-4">
            <TextField
              placeholder="Current Password"
              containerStyle="mb-4"
              textFieldStyle="mb-4"
              onChange={(e) => setOldPassword(e.target.value)}
              type="password"
            />
          </div>
        )}
        <div className={error ? 'pt-4' : 'py-4'}>
          <TextField
            placeholder="New Password"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ''}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Change password
        </button>
      </form>
    </WhiteCard>
  );
}
