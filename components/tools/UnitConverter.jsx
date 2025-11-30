'use client';

import { useState } from 'react';
import convert from 'convert-units';

export default function UnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState(null);

  // Sabse common categories aur units
  const categories = {
    length: ['m', 'cm', 'km', 'in', 'ft', 'yd', 'mile'],
    weight: ['kg', 'g', 'mg', 'lb', 'oz'],
    temperature: ['C', 'F', 'K'],
    volume: ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp'],
  };

  const labels = {
    m: 'Meter', cm: 'Centimeter', km: 'Kilometer', in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',
    kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce',
    C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
    l: 'Liter', ml: 'Milliliter', gal: 'Gallon', cup: 'Cup', tbsp: 'Tablespoon', tsp: 'Teaspoon',
  };

  const convertValue = () => {
    if (!value || isNaN(value)) return;
    try {
      const res = convert(parseFloat(value)).from(from).to(to);
      setResult(res.toFixed(6).replace(/\.?0+$/, '')); // trailing zero hata diya
    } catch (err) {
      setResult('Invalid');
    }
  };

  // Har baar kuch change ho to auto convert
  const handleChange = () => {
    if (value) convertValue();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Free Unit Converter
        </h1>

        {/* Input number */}
        <input
          type="number"
          value={value}
          onChange={(e) => { setValue(e.target.value); handleChange(); }}
          className="w-full p-5 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none mb-8"
          placeholder="Enter value"
        />

        {/* From → To */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
            <select
              value={from}
              onChange={(e) => { setFrom(e.target.value); handleChange(); }}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-600"
            >
              {Object.entries(categories).map(([cat, units]) => (
                <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                  {units.map(u => (
                    <option key={u} value={u}>{labels[u]} ({u})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
            <select
              value={to}
              onChange={(e) => { setTo(e.target.value); handleChange(); }}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-600"
            >
              {Object.entries(categories).map(([cat, units]) => (
                <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                  {units.map(u => (
                    <option key={u} value={u}>{labels[u]} ({u})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="text-center p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-4xl font-bold">
            {result} {to}
          </div>
        )}

        {/* Quick examples */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <button onClick={() => { setValue(1); setFrom('m'); setTo('ft'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">1 m → ft</button>
          <button onClick={() => { setValue(100); setFrom('kg'); setTo('lb'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">100 kg → lb</button>
          <button onClick={() => { setValue(25); setFrom('C'); setTo('F'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">25°C → °F</button>
          <button onClick={() => { setValue(500); setFrom('ml'); setTo('cup'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">500 ml → cup</button>
        </div>
      </div>
    </div>
  );
}