import React, { useState } from 'react';
import { TextField } from '../components/textField';
import { WhiteCard } from '../components/whiteCard';
import { validateEmail } from '../auth/validateEmail';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isTempPass, setIsTempPass] = useState<boolean>(false);
  const [tempPass, setTempPass] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setError(null);

    try {
      setIsLoading(true);
      const response = await fetch(
        'http://localhost:3000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        console.log(
          `[ForgotPassword] Reset token sent successfully to email: ${email}`
        );
        alert('Reset token sent to your email if you are registered :)');
        setIsTempPass(true);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send reset token.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(
        '[ForgotPassword] An error occurred while sending reset token:',
        err
      );
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const token = localStorage.getItem('token');

  const handleSubmitTempPass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!tempPass) {
      setError('Please provide the string that you got in the mail.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        'http://localhost:3000/api/auth/check-temp-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tempPass, email }),
        }
      );

      if (response.ok) {
        setError(null);
        navigate('/reset-password', { state: { email, tempPass } });
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to continue to reset password.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[ForgotPassword] An error occurred:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  if (token) {
    return (
      <WhiteCard>
        <h2 className="text-2xl font-bold pb-4 text-black text-center">
          You are already logged in!
        </h2>
        <p
          className="text-blue-500 text-md text-center hover:cursor-pointer p-1"
          onClick={() => navigate('/')}
        >
          Go to home page.
        </p>
      </WhiteCard>
    );
  }

  return (
    <WhiteCard>
      <h2 className="text-2xl font-bold pb-4 text-black">Reset password</h2>
      <form onSubmit={isTempPass ? handleSubmitTempPass : handleSubmitEmail}>
        <div className={error ? 'pt-4' : 'py-4'}>
          <TextField
            placeholder="Email"
            containerStyle="mb-4"
            textFieldStyle="mb-4"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          {isTempPass && (
            <TextField
              placeholder="Token"
              containerStyle="mb-4"
              textFieldStyle="mb-4"
              onChange={(e) => setTempPass(e.target.value)}
              type="token"
            />
          )}
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ''}`}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600 hover:cursor-pointer '} `}
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
    </WhiteCard>
  );
}
