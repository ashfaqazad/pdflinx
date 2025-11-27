'use client';
import { useState } from 'react';
import generatePassword from 'generate-password';  // npm install generate-password

export default function PasswordGenerator() {
  const [options, setOptions] = useState({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  });
  const [password, setPassword] = useState('');

  const generatePass = () => {
    const newPass = generatePassword.generate({
      length: options.length,
      numbers: options.numbers,
      symbols: options.symbols,
      uppercase: options.uppercase,
      lowercase: options.lowercase,
      excludeSimilarCharacters: true,
    });
    setPassword(newPass);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Secure Password Generator</h1>
      <div className="space-y-2 mb-4">
        <label>Length: {options.length}</label>
        <input
          type="range"
          min={8}
          max={50}
          value={options.length}
          onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      {/* Add checkboxes for numbers/symbols etc. – simple bool toggle */}
      <button onClick={generatePass} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Generate Password
      </button>
      {password && (
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-mono text-lg">{password}</p>
          <button
            onClick={() => navigator.clipboard.writeText(password)}
            className="mt-2 text-sm text-blue-500"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}