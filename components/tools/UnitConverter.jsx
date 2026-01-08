'use client';

import { useState, useEffect } from 'react';
import convert from 'convert-units';
import { ArrowRightLeft, Ruler, Scale, Thermometer, Droplets, CheckCircle, Zap } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";




export default function UnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState(null);

  const categories = {
    length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mile'],
    weight: ['kg', 'g', 'mg', 'lb', 'oz', 't'],
    temperature: ['C', 'F', 'K'],
    volume: ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp', 'fl-oz'],
    area: ['m2', 'cm2', 'km2', 'ft2', 'in2', 'acre'],
  };

  const labels = {
    m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', km: 'Kilometer', in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',
    kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce', t: 'Tonne',
    C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
    l: 'Liter', ml: 'Milliliter', gal: 'Gallon (US)', cup: 'Cup (US)', tbsp: 'Tablespoon', tsp: 'Teaspoon', 'fl-oz': 'Fluid Ounce',
    m2: 'Square Meter', cm2: 'Square Centimeter', km2: 'Square Kilometer', ft2: 'Square Foot', in2: 'Square Inch', acre: 'Acre',
  };

  const convertValue = () => {
    if (!value || isNaN(value)) {
      setResult(null);
      return;
    }
    try {
      const res = convert(parseFloat(value)).from(from).to(to);
      setResult(res.toFixed(6).replace(/\.?0+$/, ''));
    } catch (err) {
      setResult('Invalid');
    }
  };

  useEffect(() => {
    convertValue();
  }, [value, from, to]);

  const quickConvert = (val, f, t) => {
    setValue(val);
    setFrom(f);
    setTo(t);
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-unit"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Units Online for Free",
            description: "Convert length, weight, temperature, volume instantly with accurate results.",
            url: "https://pdflinx.com/unit-converter",
            step: [
              { "@type": "HowToStep", name: "Select Category", text: "Choose length, weight, temperature etc." },
              { "@type": "HowToStep", name: "Enter Value", text: "Type the value to convert." },
              { "@type": "HowToStep", name: "View Result", text: "Instant conversion appears automatically." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-unit"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Unit Converter", item: "https://pdflinx.com/unit-converter" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Unit Converter Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert length, weight, temperature, volume, area instantly. Accurate results — 100% free, no signup, works on all devices.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            Value Input
            {/* <div className="mb-8">
              <label className="text-xl font-semibold text-gray-800 mb-3 block text-center">
                Enter Value to Convert
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value || '')}
                className="w-full max-w-sm mx-auto p-4 text-xl font-semibold text-center border-2 border-orange-300 rounded-xl focus:border-amber-500 outline-none transition bg-gray-50"
                placeholder="1"
              />
            </div> */}

            {/* Value Input */}
            <div className="mb-8 flex flex-col items-center">
              <label className="text-xl font-semibold text-gray-800 mb-3 block text-center">
                Enter Value to Convert
              </label>

              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value || '')}
                className="w-full max-w-sm p-4 text-xl font-semibold text-center border-2 border-orange-300 rounded-xl focus:border-amber-500 outline-none transition bg-gray-50"
                placeholder="1"
              />
            </div>


            {/* From → To Selectors */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                  From
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-gray-50"
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
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-amber-600 rotate-180" />
                  To
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-amber-500 outline-none bg-gray-50"
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
              <div className="text-center p-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl text-white">
                <p className="text-3xl md:text-4xl font-bold mb-2">
                  {result}
                </p>
                <p className="text-lg font-semibold">
                  {labels[to]} ({to})
                </p>
              </div>
            )}
          </div>

          {/* Quick Examples */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => quickConvert(1, 'm', 'ft')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              1 Meter → Feet
            </button>
            <button onClick={() => quickConvert(100, 'kg', 'lb')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              100 KG → Pounds
            </button>
            <button onClick={() => quickConvert(25, 'C', 'F')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              25°C → Fahrenheit
            </button>
            <button onClick={() => quickConvert(500, 'ml', 'cup')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              500 ml → Cup
            </button>
          </div>

          <p className="text-center mt-8 text-gray-600 text-base">
            No signup • Unlimited conversions • Accurate results • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Unit Converter Online Free - Length, Weight, Temperature & More
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert units instantly: length (meter to feet), weight (kg to lbs), temperature (C to F), volume, area — accurate, fast, and completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ruler className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">All Major Units</h3>
            <p className="text-gray-600 text-sm">
              Length, weight, temperature, volume, area — everything covered.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Real-time conversion as you type — no button press needed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Accurate & Free</h3>
            <p className="text-gray-600 text-sm">
              Professional-grade accuracy — unlimited use, completely free.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert Units in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Value</h4>
              <p className="text-gray-600 text-sm">Type the number you want to convert.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Select Units</h4>
              <p className="text-gray-600 text-sm">Choose 'From' and 'To' units from dropdown.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Result</h4>
              <p className="text-gray-600 text-sm">Instant accurate conversion appears below.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-lg text-gray-600 italic max-w-3xl mx-auto">
          Convert units every day with PDF Linx — trusted for accurate, fast, and completely free measurement conversion.
        </p>
      </section>

      <RelatedToolsSection currentPage="unit-converter" />

    </>
  );
}






















// 'use client';

// import { useState, useEffect } from 'react';
// import convert from 'convert-units';
// import { ArrowRightLeft, Ruler, Scale, Thermometer, Droplets, CheckCircle, Zap  } from 'lucide-react';
// import Script from 'next/script';

// export default function UnitConverter() {
//   const [value, setValue] = useState(1);
//   const [from, setFrom] = useState('m');
//   const [to, setTo] = useState('ft');
//   const [result, setResult] = useState(null);

//   const categories = {
//     length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mile'],
//     weight: ['kg', 'g', 'mg', 'lb', 'oz', 't'],
//     temperature: ['C', 'F', 'K'],
//     volume: ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp', 'fl-oz'],
//     area: ['m2', 'cm2', 'km2', 'ft2', 'in2', 'acre'],
//   };

//   const labels = {
//     m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', km: 'Kilometer', in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',
//     kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce', t: 'Tonne',
//     C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
//     l: 'Liter', ml: 'Milliliter', gal: 'Gallon (US)', cup: 'Cup (US)', tbsp: 'Tablespoon', tsp: 'Teaspoon', 'fl-oz': 'Fluid Ounce',
//     m2: 'Square Meter', cm2: 'Square Centimeter', km2: 'Square Kilometer', ft2: 'Square Foot', in2: 'Square Inch', acre: 'Acre',
//   };

//   const convertValue = () => {
//     if (!value || isNaN(value)) {
//       setResult(null);
//       return;
//     }
//     try {
//       const res = convert(parseFloat(value)).from(from).to(to);
//       setResult(res.toFixed(6).replace(/\.?0+$/, ''));
//     } catch (err) {
//       setResult('Invalid');
//     }
//   };

//   useEffect(() => {
//     convertValue();
//   }, [value, from, to]);

//   const quickConvert = (val, f, t) => {
//     setValue(val);
//     setFrom(f);
//     setTo(t);
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-unit"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Convert Units Online for Free",
//             description: "Convert length, weight, temperature, volume instantly with accurate results.",
//             url: "https://pdflinx.com/unit-converter",
//             step: [
//               { "@type": "HowToStep", name: "Select Category", text: "Choose length, weight, temperature etc." },
//               { "@type": "HowToStep", name: "Enter Value", text: "Type the value to convert." },
//               { "@type": "HowToStep", name: "View Result", text: "Instant conversion appears automatically." }
//             ],
//             totalTime: "PT20S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-unit"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Unit Converter", item: "https://pdflinx.com/unit-converter" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
//               Unit Converter <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Convert length, weight, temperature, volume, area instantly. Accurate results — 100% free, no signup, works on all devices.
//             </p>
//           </div>

//           {/* Tool Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
//             {/* Value Input */}
//             <div className="mb-10">
//               <label className="text-2xl font-bold text-gray-800 mb-4 block text-center">
//                 Enter Value to Convert
//               </label>
//               <input
//                 type="number"
//                 value={value}
//                 onChange={(e) => setValue(e.target.value || '')}
//                 className="w-full max-w-md mx-auto p-6 text-4xl font-bold text-center border-4 border-orange-300 rounded-2xl focus:border-amber-500 outline-none transition"
//                 placeholder="1"
//               />
//             </div>

//             {/* From → To Selectors */}
//             <div className="grid md:grid-cols-2 gap-10 mb-10">
//               <div>
//                 <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
//                   <ArrowRightLeft className="w-8 h-8 text-orange-600" />
//                   From
//                 </label>
//                 <select
//                   value={from}
//                   onChange={(e) => setFrom(e.target.value)}
//                   className="w-full p-6 text-xl border-2 border-gray-300 rounded-2xl focus:border-orange-500 outline-none bg-gray-50"
//                 >
//                   {Object.entries(categories).map(([cat, units]) => (
//                     <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
//                       {units.map(u => (
//                         <option key={u} value={u}>{labels[u]} ({u})</option>
//                       ))}
//                     </optgroup>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
//                   <ArrowRightLeft className="w-8 h-8 text-amber-600 rotate-180" />
//                   To
//                 </label>
//                 <select
//                   value={to}
//                   onChange={(e) => setTo(e.target.value)}
//                   className="w-full p-6 text-xl border-2 border-gray-300 rounded-2xl focus:border-amber-500 outline-none bg-gray-50"
//                 >
//                   {Object.entries(categories).map(([cat, units]) => (
//                     <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
//                       {units.map(u => (
//                         <option key={u} value={u}>{labels[u]} ({u})</option>
//                       ))}
//                     </optgroup>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Result */}
//             {result !== null && (
//               <div className="text-center p-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl text-white">
//                 <p className="text-5xl md:text-7xl font-extrabold mb-4">
//                   {result}
//                 </p>
//                 <p className="text-3xl font-bold">
//                   {labels[to]} ({to})
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Quick Examples */}
//           <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
//             <button onClick={() => quickConvert(1, 'm', 'ft')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-lg font-semibold">
//               1 Meter → Feet
//             </button>
//             <button onClick={() => quickConvert(100, 'kg', 'lb')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-lg font-semibold">
//               100 KG → Pounds
//             </button>
//             <button onClick={() => quickConvert(25, 'C', 'F')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-lg font-semibold">
//               25°C → Fahrenheit
//             </button>
//             <button onClick={() => quickConvert(500, 'ml', 'cup')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-lg font-semibold">
//               500 ml → Cup
//             </button>
//           </div>

//           <p className="text-center mt-12 text-gray-600 text-lg">
//             No signup • Unlimited conversions • Accurate results • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
//             Unit Converter Online Free - Length, Weight, Temperature & More
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Convert units instantly: length (meter to feet), weight (kg to lbs), temperature (C to F), volume, area — accurate, fast, and completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl border border-orange-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Ruler className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">All Major Units</h3>
//             <p className="text-gray-600">
//               Length, weight, temperature, volume, area — everything covered.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-amber-50 to-white p-10 rounded-3xl shadow-xl border border-amber-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Zap className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant Results</h3>
//             <p className="text-gray-600">
//               Real-time conversion as you type — no button press needed.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Accurate & Free</h3>
//             <p className="text-gray-600">
//               Professional-grade accuracy — unlimited use, completely free.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Convert Units in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Enter Value</h4>
//               <p className="text-gray-600 text-lg">Type the number you want to convert.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Select Units</h4>
//               <p className="text-gray-600 text-lg">Choose 'From' and 'To' units from dropdown.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Get Result</h4>
//               <p className="text-gray-600 text-lg">Instant accurate conversion appears below.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Convert units every day with PDF Linx — trusted by thousands for accurate, fast, and completely free measurement conversion.
//         </p>
//       </section>
//     </>
//   );
// }

























// // 'use client';

// // import { useState } from 'react';
// // import convert from 'convert-units';

// // export default function UnitConverter() {
// //   const [value, setValue] = useState(1);
// //   const [from, setFrom] = useState('m');
// //   const [to, setTo] = useState('ft');
// //   const [result, setResult] = useState(null);

// //   // Sabse common categories aur units
// //   const categories = {
// //     length: ['m', 'cm', 'km', 'in', 'ft', 'yd', 'mile'],
// //     weight: ['kg', 'g', 'mg', 'lb', 'oz'],
// //     temperature: ['C', 'F', 'K'],
// //     volume: ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp'],
// //   };

// //   const labels = {
// //     m: 'Meter', cm: 'Centimeter', km: 'Kilometer', in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',
// //     kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce',
// //     C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
// //     l: 'Liter', ml: 'Milliliter', gal: 'Gallon', cup: 'Cup', tbsp: 'Tablespoon', tsp: 'Teaspoon',
// //   };

// //   const convertValue = () => {
// //     if (!value || isNaN(value)) return;
// //     try {
// //       const res = convert(parseFloat(value)).from(from).to(to);
// //       setResult(res.toFixed(6).replace(/\.?0+$/, '')); // trailing zero hata diya
// //     } catch (err) {
// //       setResult('Invalid');
// //     }
// //   };

// //   // Har baar kuch change ho to auto convert
// //   const handleChange = () => {
// //     if (value) convertValue();
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
// //         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
// //           Free Unit Converter
// //         </h1>

// //         {/* Input number */}
// //         <input
// //           type="number"
// //           value={value}
// //           onChange={(e) => { setValue(e.target.value); handleChange(); }}
// //           className="w-full p-5 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none mb-8"
// //           placeholder="Enter value"
// //         />

// //         {/* From → To */}
// //         <div className="grid grid-cols-2 gap-6 mb-8">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
// //             <select
// //               value={from}
// //               onChange={(e) => { setFrom(e.target.value); handleChange(); }}
// //               className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-600"
// //             >
// //               {Object.entries(categories).map(([cat, units]) => (
// //                 <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
// //                   {units.map(u => (
// //                     <option key={u} value={u}>{labels[u]} ({u})</option>
// //                   ))}
// //                 </optgroup>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
// //             <select
// //               value={to}
// //               onChange={(e) => { setTo(e.target.value); handleChange(); }}
// //               className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-600"
// //             >
// //               {Object.entries(categories).map(([cat, units]) => (
// //                 <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
// //                   {units.map(u => (
// //                     <option key={u} value={u}>{labels[u]} ({u})</option>
// //                   ))}
// //                 </optgroup>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         {/* Result */}
// //         {result !== null && (
// //           <div className="text-center p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-4xl font-bold">
// //             {result} {to}
// //           </div>
// //         )}

// //         {/* Quick examples */}
// //         <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
// //           <button onClick={() => { setValue(1); setFrom('m'); setTo('ft'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">1 m → ft</button>
// //           <button onClick={() => { setValue(100); setFrom('kg'); setTo('lb'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">100 kg → lb</button>
// //           <button onClick={() => { setValue(25); setFrom('C'); setTo('F'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">25°C → °F</button>
// //           <button onClick={() => { setValue(500); setFrom('ml'); setTo('cup'); convertValue(); }} className="bg-gray-200 p-3 rounded hover:bg-gray-300">500 ml → cup</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }