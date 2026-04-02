"use client";

import { ShieldCheck, Zap, Globe, Heart, Users, Coffee, Sparkles } from "lucide-react";
import Script from "next/script";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PDF Linx — No-BS, Privacy-First Tools",
    description:
      "PDF Linx was born from frustration with clunky PDF tools. 22+ free tools, no signups, no subscriptions. Built solo, loved by thousands across Pakistan, India, Bangladesh & beyond.",
    url: "https://pdflinx.com/about",
    publisher: {
      "@type": "Organization",
      name: "PDF Linx",
      url: "https://pdflinx.com",
    },
  };

  return (
    <>
      <Script
        id="aboutpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        {/* Hero Section — Modern & Bold */}
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-indigo-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-indigo-800">BUILT WITH ❤️ · SINCE 2023</span>
            </div>

            <h1 className="text-4xl md:text-3xl lg:text-5xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                We don't do
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                subscriptions & popups
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              PDF Linx exists because free tools shouldn't feel like a scam.
              Built solo, driven by <span className="font-semibold text-indigo-700">real human needs</span> — no boardroom, no hidden agenda.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                🚀 22+ tools
              </span>
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                🔒 Browser-first privacy
              </span>
              <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                🌍 150k+ users
              </span>
            </div>
          </div>
        </section>

        {/* The Story Section — Personal Touch */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card — Origin Story */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-1 bg-gradient-to-b from-indigo-500 to-indigo-300 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  The backstory
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <span className="font-bold text-indigo-700">October 2023</span> — a scanned receipt made me almost lose it.
                  I tried <span className="italic">"free" PDF converters</span> that demanded signups, tiny file limits,
                  and made me wait 3 minutes for a 2-page PDF.
                </p>
                <p className="bg-indigo-50/50 p-4 rounded-xl border-l-4 border-indigo-400">
                  💡 <span className="font-medium">"Why does a simple task need this much friction?"</span>
                </p>
                <p>
                  So over a weekend, I built my own. No tracking, no ads, no "create an account" nonsense.
                  Just drop a file, get results, leave. It felt <span className="font-medium text-indigo-800">right.</span>
                </p>
                <p>
                  In November, I shared it on Reddit and <span className="font-semibold">it exploded</span> —
                  thousands of students, freelancers, and fellow devs started using it.
                  A friend merged her thesis PDFs in seconds, a café owner made QR codes for their menu.
                </p>
                <div className="pt-2 text-sm text-gray-500 border-l-2 border-indigo-200 pl-4">
                  ✨ Today: 22 tools — same soul, one human helping others skip the BS.
                </div>
              </div>
            </div>

            {/* Right Card — Why This Exists */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl shadow-xl border border-indigo-100 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-1 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Why this exists
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I'm not chasing a billion-dollar exit. I just <span className="font-medium">hate time-wasting software</span>
                  that charges $15/month for something that should take 4 seconds.
                </p>
                <div className="bg-white/70 p-5 rounded-xl border border-indigo-100">
                  <p className="font-semibold text-indigo-900 mb-2">🎯 Core belief:</p>
                  <p className="italic text-gray-700">"Don't waste people's time."</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Whether it's 2 AM before a deadline, compressing bulky PDFs for a client,
                    or generating a QR code — tools should feel invisible.
                  </p>
                </div>
                <p>
                  No spam popups, no "upgrade to pro" fake buttons, no weirdly slow servers.
                  If a tool can run locally in your browser, it does.
                </p>
                <div className="flex gap-2 text-sm text-indigo-700 font-medium">
                  ⚡ Fast by design · 🧠 Privacy by default · 🕊️ No noise
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards — Enhanced Modern */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide px-3 py-1 rounded-full">
              what makes us different
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800">
              Built with <span className="text-indigo-600">you</span> in mind
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2">
              No spin. Just features you actually feel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Globe className="w-7 h-7 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Actually <span className="text-indigo-600">free</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No "free trial" traps. No credit card forms. No watermarks.
                Open the site, use any tool, close the tab. Zero friction. Period.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Ridiculously <span className="text-amber-600">fast</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Merge 50 PDFs? Usually under 3 seconds. Compress images while sipping coffee.
                Built to be snappy because waiting sucks.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Your files stay <span className="text-emerald-600">yours</span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Many tools run locally inside your browser — files never leave your device.
                For server-side tools, we're transparent. No sneaky selling.
              </p>
            </div>
          </div>
        </section>

        {/* Community Section — Desi Dev Shoutout */}
        {/* <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-4 backdrop-blur-sm">
                  🌍 growing community
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  From Pakistan to Bangladesh, India & beyond
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  What started as a solo project now has a growing community across South Asia and the world. 
                  <strong className="text-indigo-700 block mt-2">Shoutout to the desi dev community 🙏</strong>
                  Your support, bug reports, and feature requests shaped what PDF Linx is today.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇵🇰 Lahore · Karachi</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇮🇳 Delhi · Bengaluru</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🇧🇩 Dhaka · Chittagong</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🌏 80+ countries</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center text-5xl shadow-lg">
                  🙌
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Community Section */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-4 backdrop-blur-sm">
                  🌍 used in 80+ countries
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Built for everyone, wherever you are
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  What started as a solo weekend project is now used by students, freelancers, developers,
                  and small business owners across the globe. No matter where you're working from — PDF Linx just works.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Got a bug report, a feature idea, or just want to say hi? Every message goes directly
                  to the person who built this. That's the whole team.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Students & researchers</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Freelancers</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Small businesses</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">Developers</span>
                  <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">🌏 80+ countries</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center text-5xl shadow-lg">
                  🌍
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Journey Section */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tools Evolution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛠️</span>
                <h3 className="text-xl font-bold text-gray-800">From 3 tools to 22+</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex gap-3">
                  <span className="text-indigo-500 font-bold">→</span>
                  <span><span className="font-semibold">Oct '23:</span> PDF to Word, Merge PDF, Compress PDF — just the basics.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-indigo-500 font-bold">→</span>
                  <span><span className="font-semibold">Nov '23:</span> Reddit post blew up (5k+ upvotes), added QR generator after requests.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-indigo-500 font-bold">→</span>
                  <span><span className="font-semibold">2024:</span> Image compressor, password generator, split PDF — all requested by real users.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-indigo-500 font-bold">→</span>
                  <span>Today: <span className="font-bold">22 tools, 0 bloat, 100% indie energy.</span></span>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500 italic border-t pt-4">
                📬 Got an idea? I read everything at <a href="mailto:support@pdflinx.com" className="text-indigo-600 font-medium hover:underline">support@pdflinx.com</a>
              </div>
            </div>

            {/* Solo Builder */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧘</span>
                <h3 className="text-xl font-bold text-gray-800">Built solo, maintained with love</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                No corporate meetings, no investors pushing ads. Just me (a dev who hates subscription fatigue)
                and my laptop, shipping updates when real people need them.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every tool is built with one question: <span className="bg-indigo-100 px-1.5 py-0.5 rounded font-medium">"Does this solve someone's headache?"</span>
              </p>
              <div className="mt-5 flex gap-2 text-sm">
                <span className="bg-white rounded-full px-3 py-1 text-gray-700 border">✨ 100% human-made</span>
                <span className="bg-white rounded-full px-3 py-1 text-gray-700 border">📆 Regular updates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Note / CTA */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">
            <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
              No strings attached. <span className="text-indigo-600">Ever.</span>
            </h2>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              That's the promise. Use PDF Linx as much as you want — for work, study, or side projects.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Explore all 22+ tools →
            </a>
            <p className="text-xs text-gray-400 mt-6">
              ⭐ Loved by thousands · No tracking · Made with ☕ and frustration for bloated software
            </p>
          </div>
        </section>
      </main>
    </>
  );
}































// "use client";

// import { ShieldCheck, Zap, Globe } from "lucide-react";
// import Script from "next/script";

// export default function About() {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "AboutPage",
//     name: "About PDF Linx",
//     description:
//       "Learn about PDF Linx — a privacy-first collection of free PDF and utility tools built for speed and simplicity.",
//     url: "https://pdflinx.com/about",
//     publisher: {
//       "@type": "Organization",
//       name: "PDF Linx",
//       url: "https://pdflinx.com",
//     },
//   };

//   return (
//     <>
//       {/* SEO Schema (JSON-LD) */}
//       <Script
//         id="aboutpage-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
//         {/* Hero Section */}
//         <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
//             About <strong>PDF Linx</strong>
//           </h1>

//           <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-3">
//             <p>
//               I built PDF Linx in <strong>October 2023</strong> after wasting way
//               too much time trying to convert a simple scanned receipt.
//               I tested multiple “free” converters — and they all came with the
//               same annoying problems.
//             </p>

//             <p>You know the type:</p>
//             <ul className="list-none space-y-1 ml-4">
//               <li>→ “Sign up to download your file” (why?)</li>
//               <li>→ tiny file limits</li>
//               <li>→ popups and distractions</li>
//               <li>→ slow processing for basic tasks</li>
//             </ul>

//             <p>
//               So I spent the weekend building something that just works —
//               simple, fast, and focused. Many tools run directly in your browser
//               to keep things private and quick.
//             </p>

//             <p>
//               I posted it on Reddit in November and it got surprising traction.
//               A friend used it for a thesis (merging a bunch of PDFs), and then
//               more people started sharing it.
//             </p>

//             <p>
//               Today, there’s a small but growing community — especially across
//               Pakistan, India, and Bangladesh (shoutout to the desi dev community 🙏).
//             </p>

//             <p className="text-gray-600 italic">
//               Built solo. Maintained continuously. Privacy-first by default.
//             </p>
//           </div>
//         </section>

//         {/* Mission Section */}
//         <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-6">
//             Why This Exists
//           </h2>

//           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed space-y-3">
//             <p>
//               I’m not trying to build the next billion-dollar startup. I just got
//               tired of clunky tools that charge monthly subscriptions for basic
//               PDF operations.
//             </p>

//             <p>
//               The goal is simple: <strong>don’t waste people’s time</strong>.
//             </p>

//             <p>
//               Whether you’re a student submitting assignments at 2 AM, a freelancer
//               dealing with client files, or someone making a QR code for a café menu —
//               these tools should just work. Fast. Simple. Minimal friction.
//             </p>

//             <p className="text-gray-600">
//               And yes — I keep the site clean. No spammy popups. No weird tricks.
//             </p>
//           </div>
//         </section>

//         {/* Feature Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           {/* Card 1 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-4 p-3 rounded-xl bg-indigo-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition">
//               Actually <strong>Free</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               No “free trial” traps. No account required. No credit card.
//               <br />
//               <br />
//               Use it on phone, laptop, tablet — just open the site and go.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
//               Fast, <strong>Always</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               Most tools finish quickly — because waiting for simple tasks is painful.
//               <br />
//               <br />
//               Merging PDFs, compressing files, converting formats — built to be snappy.
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
//               Your Files Stay <strong>Yours</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               Many tools run directly in your browser — so your files aren’t sent
//               to random servers for processing.
//               <br />
//               <br />
//               If a tool requires server processing, it’s clearly disclosed in the tool page.
//             </p>
//           </div>
//         </section>

//         {/* Story Section */}
//         <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
//             How We Got <strong>Here</strong>
//           </h2>

//           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-3">
//             <p>
//               Started as a weekend project in <strong>October 2023</strong>. Just
//               me, building what I wished existed.
//             </p>

//             <p>
//               The first version had just a few essentials:{" "}
//               <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and{" "}
//               <strong>Compress PDF</strong>.
//             </p>

//             <p>
//               Then people started requesting more:
//               <br />
//               → QR Code Generator (added)
//               <br />
//               → Password Generator (added)
//               <br />
//               → Image Compression (added)
//             </p>

//             <p>
//               Now there are <strong>22 tools</strong> and I still ship updates
//               based on feedback.
//             </p>

//             <p className="text-gray-600 italic">
//               Got an idea or found a bug? Email{" "}
//               <strong>support@pdflinx.com</strong>. I read everything.
//             </p>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

