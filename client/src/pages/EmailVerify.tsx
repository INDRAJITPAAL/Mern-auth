import React, { useRef } from 'react';
import { ExportAssets } from '../assets/ExportAssets';

function EmailVerify() {
  const [otp, setOtp] = React.useState(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);

    // Move to next input
    if (idx < 5 && value) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste) {
      const pasteArr = paste.split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteArr[i] || '';
      }
      setOtp(newOtp);
      // Focus last filled input
      const lastIdx = pasteArr.length >= 6 ? 5 : pasteArr.length - 1;
      inputsRef.current[lastIdx]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Entered OTP: ${otp.join('')}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <img
          src={ExportAssets.mail_icon}
          alt="Email Icon"
          className="w-16 h-16 mb-4"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Enter OTP</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter the 6-digit OTP sent to your email address to verify your account.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { (inputsRef.current[idx] = el) }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoFocus={idx === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition w-full"
            disabled={otp.some(d => d === '')}
          >
            Verify OTP
          </button>
        </form>
        <button className="mt-4 text-blue-600 hover:underline text-sm">
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default EmailVerify;