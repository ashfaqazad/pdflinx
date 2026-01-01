"use client";

import { ShieldCheck, Zap, Globe } from "lucide-react";

export default function About() {
  return (
    <>
      {/* SEO Schema */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "About PDF Linx",
              description: "Learn about our free online PDF and utility tools platform.",
              url: "https://pdflinx.com/about",
              publisher: {
                "@type": "Organization",
                name: "PDF Linx",
                url: "https://pdflinx.com",
              },
            }),
          }}
        />
      </head>

      <main className="max-w-6xl mx-auto py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        
        {/* Hero Section */}
        <section className="text-center mb-20 backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 transition-all duration-700 hover:shadow-indigo-100">
          <h1 className="text-5xl md:text-6xl font-black mb-8 text-indigo-900 leading-tight tracking-tight">
            About <strong>PDF Linx</strong>
          </h1>
          
          <div className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-left space-y-4">
            <p>
              Built this in <strong>October 2023</strong> after spending 2 hours trying to convert a scanned receipt. 
              Tried 5 different "free" PDF converters. Every single one was trash.
            </p>
            
            <p>You know the type:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>→ "Sign up to download your file" (like, why?)</li>
              <li>→ 5MB file limit (completely useless)</li>
              <li>→ Popup ads every 10 seconds</li>
              <li>→ "Your file will be ready in 3 minutes" (it's <strong>2026</strong>, seriously?)</li>
            </ul>

            <p>
              So I spent that weekend building something that just... works. No signup BS, 
              no file uploads to random servers, no ads. Everything runs in your browser.
            </p>

            <p>
              Posted it on Reddit in November. Got <strong>200 users first day</strong>. My roommate Ali used it 
              for his thesis (had to merge like 50 PDFs), then his entire lab started using it.
            </p>

            <p>
              Now we've got a <strong>growing community</strong> — mostly from Pakistan, India, 
              and Bangladesh (shoutout to the desi dev community 🙏).
            </p>

            <p className="text-base text-gray-600 italic">
              Still free. Still no ads. Still just me maintaining it on weekends between my day job.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100/50 p-10 md:p-16">
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8">
            Why This Exists
          </h2>
          
          <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed space-y-4">
            <p>
              Look, I'm not trying to build the next billion-dollar startup or whatever. 
              I just got tired of clunky software that charges $30/month for basic PDF operations.
            </p>

            <p>
              The goal is simple: <strong>don't waste people's time</strong>.
            </p>

            <p>
              Whether you're a student juggling assignments at 2 AM, a freelancer dealing with 
              clients' messy files, or someone who just needs to make a QR code for their cafe menu 
              — these tools should just work. Fast. Free. No friction.
            </p>

            <p className="text-base text-gray-600">
              (Also I hate ads with a passion, so you'll never see any here. That's a promise.)
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          
          {/* Card 1 */}
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-indigo-200">
            <Globe className="w-20 h-20 mx-auto text-indigo-700 mb-6 shadow-lg p-4 rounded-2xl bg-indigo-50/80 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
              Actually <strong>Free</strong>
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              No "free trial" BS. No "upgrade to premium" popups. No credit card required.
              <br /><br />
              Everything is free. Forever. Use it on your phone, laptop, tablet — whatever. 
              No app download, no account signup.
              <br /><br />
              Just open the site and go.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-amber-200">
            <Zap className="w-20 h-20 mx-auto text-amber-600 mb-6 shadow-lg p-4 rounded-2xl bg-amber-50/80 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-amber-600 transition-colors">
              <strong>Fast</strong> AF
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              I personally hate waiting for stuff to load. So most tools finish in under 10 seconds.
              <br /><br />
              Merging 20 PDFs? Done. Compressing a 50MB file? Quick. Converting Word to PDF? Instant.
              <br /><br />
              (Tested on my old 2019 laptop — if it works there, it'll work on yours.)
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-emerald-200">
            <ShieldCheck className="w-20 h-20 mx-auto text-emerald-600 mb-6 shadow-lg p-4 rounded-2xl bg-emerald-50/80 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">
              Your Files Stay <strong>Yours</strong>
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Everything happens in your browser. I don't upload your files to any server. 
              Ever.
              <br /><br />
              No cloud storage. No "we'll delete your files in 24 hours" (because they're never uploaded 
              in the first place).
              <br /><br />
              Zero tracking. Zero data collection. I literally can't see what files you're converting.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100/50 p-10 md:p-16 text-center">
          <h2 className="text-4xl font-black mb-8 text-indigo-900">
            How We Got <strong>Here</strong>
          </h2>
          
          <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed text-left space-y-4">
            <p>
              Started as a weekend project in <strong>October 2023</strong>. Just me, frustrated with existing 
              PDF tools, coding something better.
            </p>

            <p>
              First version had 3 tools: <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and <strong>Compress PDF</strong>. 
              That's it. Built them in like 2 weeks.
            </p>

            <p>
              Then people started asking for more stuff:
              <br />
              → "Can you add QR code generator?" (Added in December)
              <br />
              → "What about password generator?" (Done)
              <br />
              → "Image compression would be useful" (Added that too)
            </p>

            <p>
              Now we have <strong>18 tools</strong> (probably too many tbh, but people keep requesting stuff).
            </p>

            <p>
              Started with a handful of friends and Reddit shares. Now serving <strong>thousands of users</strong> 
              across South Asia as of early 2026.
            </p>

            <p className="text-base text-gray-600 italic">
              If you've got ideas for new tools or found a bug, hit me up on Twitter 
              (@pdflinx) or email (hello@pdflinx.com). Seriously, I read everything.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}




























// "use client";

// import { ShieldCheck, Zap, Globe } from "lucide-react";

// export default function About() {
//   return (
//     <>
//       {/* SEO Schema */}
//       <head>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "AboutPage",
//               name: "About PDF Linx",
//               description: "Learn about our free online PDF and utility tools platform.",
//               url: "https://pdflinx.com/about",
//               publisher: {
//                 "@type": "Organization",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//               },
//             }),
//           }}
//         />
//       </head>

//       <main className="max-w-6xl mx-auto py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        
//         {/* Hero Section */}
//         <section className="text-center mb-20 backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 transition-all duration-700 hover:shadow-indigo-100">
//           <h1 className="text-5xl md:text-6xl font-black mb-8 text-indigo-900 leading-tight tracking-tight">
//             About <strong>PDF Linx</strong>
//           </h1>
          
//           <div className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-left space-y-4">
//             <p>
//               Built this in <strong>October 2023</strong> after spending 2 hours trying to convert a scanned receipt. 
//               Tried 5 different "free" PDF converters. Every single one was trash.
//             </p>
            
//             <p>You know the type:</p>
//             <ul className="list-none space-y-2 ml-4">
//               <li>→ "Sign up to download your file" (like, why?)</li>
//               <li>→ 5MB file limit (completely useless)</li>
//               <li>→ Popup ads every 10 seconds</li>
//               <li>→ "Your file will be ready in 3 minutes" (it's 2026, seriously?)</li>
//             </ul>

//             <p>
//               So I spent that weekend building something that just... works. No signup BS, 
//               no file uploads to random servers, no ads. Everything runs in your browser.
//             </p>

//             <p>
//               Posted it on Reddit in November. Got 200 users first day. My roommate Ali used it 
//               for his thesis (had to merge like 50 PDFs), then his entire lab started using it.
//             </p>

//             <p>
//               Now we're at <strong>50,000+ monthly users</strong> — mostly from Pakistan, India, 
//               and Bangladesh (shoutout to the desi dev community 🙏).
//             </p>

//             <p className="text-base text-gray-600 italic">
//               Still free. Still no ads. Still just me maintaining it on weekends between my day job.
//             </p>
//           </div>
//         </section>

//         {/* Mission Section */}
//         <section className="mb-20 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100/50 p-10 md:p-16">
//           <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8">
//             Why This Exists
//           </h2>
          
//           <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed space-y-4">
//             <p>
//               Look, I'm not trying to build the next billion-dollar startup or whatever. 
//               I just got tired of clunky software that charges $30/month for basic PDF operations.
//             </p>

//             <p>
//               The goal is simple: <strong>don't waste people's time</strong>.
//             </p>

//             <p>
//               Whether you're a student juggling assignments at 2 AM, a freelancer dealing with 
//               clients' messy files, or someone who just needs to make a QR code for their cafe menu 
//               — these tools should just work. Fast. Free. No friction.
//             </p>

//             <p className="text-base text-gray-600">
//               (Also I hate ads with a passion, so you'll never see any here. That's a promise.)
//             </p>
//           </div>
//         </section>

//         {/* Feature Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          
//           {/* Card 1 */}
//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-indigo-200">
//             <Globe className="w-20 h-20 mx-auto text-indigo-700 mb-6 shadow-lg p-4 rounded-2xl bg-indigo-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
//               Actually Free
//             </h3>
//             <p className="text-gray-600 text-center leading-relaxed">
//               No "free trial" BS. No "upgrade to premium" popups. No credit card required.
//               <br /><br />
//               Everything is free. Forever. Use it on your phone, laptop, tablet — whatever. 
//               No app download, no account signup.
//               <br /><br />
//               Just open the site and go.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-amber-200">
//             <Zap className="w-20 h-20 mx-auto text-amber-600 mb-6 shadow-lg p-4 rounded-2xl bg-amber-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-amber-600 transition-colors">
//               Fast AF
//             </h3>
//             <p className="text-gray-600 text-center leading-relaxed">
//               I personally hate waiting for stuff to load. So most tools finish in under 10 seconds.
//               <br /><br />
//               Merging 20 PDFs? Done. Compressing a 50MB file? Quick. Converting Word to PDF? Instant.
//               <br /><br />
//               (Tested on my old 2019 laptop — if it works there, it'll work on yours.)
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-emerald-200">
//             <ShieldCheck className="w-20 h-20 mx-auto text-emerald-600 mb-6 shadow-lg p-4 rounded-2xl bg-emerald-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">
//               Your Files Stay Yours
//             </h3>
//             <p className="text-gray-600 text-center leading-relaxed">
//               Everything happens in your browser. I don't upload your files to any server. 
//               Ever.
//               <br /><br />
//               No cloud storage. No "we'll delete your files in 24 hours" (because they're never uploaded 
//               in the first place).
//               <br /><br />
//               Zero tracking. Zero data collection. I literally can't see what files you're converting.
//             </p>
//           </div>
//         </section>

//         {/* Story Section */}
//         <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100/50 p-10 md:p-16 text-center">
//           <h2 className="text-4xl font-black mb-8 text-indigo-900">
//             How We Got Here
//           </h2>
          
//           <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed text-left space-y-4">
//             <p>
//               Started as a weekend project in October 2023. Just me, frustrated with existing 
//               PDF tools, coding something better.
//             </p>

//             <p>
//               First version had 3 tools: PDF to Word, Merge PDF, and Compress PDF. 
//               That's it. Built them in like 2 weeks.
//             </p>

//             <p>
//               Then people started asking for more stuff:
//               <br />
//               → "Can you add QR code generator?" (Added in December)
//               <br />
//               → "What about password generator?" (Done)
//               <br />
//               → "Image compression would be useful" (Added that too)
//             </p>

//             <p>
//               Now we have 18 tools (probably too many tbh, but people keep requesting stuff).
//             </p>

//             <p>
//               Hit 10K users in January 2024. Then 25K in March. Now sitting at 50K+ monthly users 
//               as of December 2025.
//             </p>

//             <p className="text-base text-gray-600 italic">
//               If you've got ideas for new tools or found a bug, hit me up on Twitter 
//               (@pdflinx) or email (hello@pdflinx.com). Seriously, I read everything.
//             </p>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }


















// "use client";  // ← YE RAKH – CLIENT COMPONENT KE LIYE

// import { ShieldCheck, Zap, Globe } from "lucide-react";

// export default function About() {
//   return (
//     <>
//       {/* ✅ Organization Schema for SEO – ye client mein bhi fine he */}
//       <head>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "AboutPage",
//               name: "About PDF Linx",
//               description: "Learn about our free online PDF and utility tools platform.",
//               url: "https://pdflinx.com/about",
//               publisher: {
//                 "@type": "Organization",
//                 name: "PDF Linx",
//                 url: "https://pdflinx.com",
//               },
//             }),
//           }}
//         />
//       </head>

//       <main className="max-w-6xl mx-auto py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
//         {/* ✅ Hero Section - Modern Glass Effect */}
//         <section className="text-center mb-20 backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 transition-all duration-700 hover:shadow-indigo-100">
//           <h1 className="text-5xl md:text-6xl font-black mb-8 text-indigo-900 leading-tight tracking-tight animate-fade-in">
//             About <strong>PDF Linx</strong>
//           </h1>
//           <p className="text-gray-700 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
//             Started this in <strong>October 2023</strong> after my 10th frustrating experience with "free" PDF converters. You know the type — promise free conversion, then hit you with:  
//             • "Sign up to download" (why??)  
//             • 5MB file limit (useless)  
//             • Popup ads every 10 seconds  
//             • "Your file will be ready in... 3 minutes" (it's <strong>2026</strong>, seriously?)  
//             <br /><br />So I built <strong>PDFLinx</strong>. Everything runs in your browser, no uploads to sketchy servers, no account signup BS. If you're a student drowning in assignments, a freelancer dealing with clients' messy files, or just someone who hates slow tools — this is for you.  
//             <br /><br />Currently at <strong>50K+ monthly users</strong> (mostly from Pakistan, India, and Bangladesh). Still free, still no ads, still just me maintaining it on weekends. We've got everything from <strong>PDF tweaks</strong> to quick QR codes, image shrinks, and password makers – all free, all in one spot, so you spend less time fighting tech and more time getting stuff done.
//           </p>
//         </section>

//         {/* ✅ Our Mission - Gradient with Glassmorphism */}
//         <section className="mb-20 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100/50 p-10 md:p-16 transition-all duration-700 hover:shadow-indigo-200">
//           <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8 animate-fade-in-delayed">
//             Our <strong>Mission</strong>
//           </h2>
//           <p className="text-gray-700 text-center max-w-4xl mx-auto text-lg leading-relaxed">
//             Look, I started this because I was tired of <strong>clunky software</strong> and shady sites that charge for basics. Our goal? Make handling docs and media as painless as possible. <strong>Fast tools</strong>, zero cost, and total privacy – whether it's converting PDFs, optimizing images, or whipping up a QR for your menu. We want your workflow to feel smooth, not stressful.
//           </p>
//         </section>

//         {/* ✅ Features / Values - Modern Cards with Enhanced Hovers */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-indigo-200">
//             <Globe className="w-20 h-20 mx-auto text-indigo-700 mb-8 shadow-lg p-4 rounded-2xl bg-indigo-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-3xl text-center font-black mb-6 text-gray-900 group-hover:text-indigo-600 transition-colors">Free & <strong>Accessible</strong></h3>
//             <p className="text-gray-600 text-center leading-relaxed text-lg">
//               Everything here is <strong>straight-up free</strong> – no hidden fees, no "upgrade now" popups. Tools like PDF converters, QR generators, unit converters? Use them on your phone, laptop, or whatever, anytime. No downloads, no accounts. Just open and go.
//             </p>
//           </div>

//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-amber-200">
//             <Zap className="w-20 h-20 mx-auto text-amber-600 mb-8 shadow-lg p-4 rounded-2xl bg-amber-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-3xl text-center font-black mb-6 text-gray-900 group-hover:text-amber-600 transition-colors"><strong>Fast</strong> & Reliable</h3>
//             <p className="text-gray-600 text-center leading-relaxed text-lg">
//               I hate waiting, so we built these for <strong>speed</strong>. Merging PDFs? Splitting pages? Converting files? Most jobs wrap up in seconds, with spot-on results. No crashes, no half-baked outputs – tested it myself a ton.
//             </p>
//           </div>

//           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-emerald-200">
//             <ShieldCheck className="w-20 h-20 mx-auto text-emerald-600 mb-8 shadow-lg p-4 rounded-2xl bg-emerald-50/80 group-hover:scale-110 transition-transform duration-300" />
//             <h3 className="text-3xl text-center font-black mb-6 text-gray-900 group-hover:text-emerald-600 transition-colors"><strong>Secure</strong> & Private</h3>
//             <p className="text-gray-600 text-center leading-relaxed text-lg">
//               Your stuff stays <strong>yours</strong>. Files get processed right in your browser (no servers involved), and anything temporary gets wiped immediately after. Privacy isn't a feature here – it's the whole point. No tracking, no selling data.
//             </p>
//           </div>
//         </section>

//         {/* ✅ Our Story - Enhanced with Subtle Animation */}
//         <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100/50 p-10 md:p-16 text-center transition-all duration-700 hover:shadow-indigo-100">
//           <h2 className="text-4xl font-black mb-8 text-indigo-900 animate-fade-in-delayed-2">Our <strong>Story</strong></h2>
//           <p className="text-gray-700 max-w-4xl mx-auto text-xl leading-relaxed">
//             <strong>PDF Linx</strong> kicked off last year as my side project. I was frustrated with PDF converters that either bombed quality or stole your files, so I coded something simple that just worked. Friends started using it for their work, and boom – we added QR generators, password tools, image fixes, even signature makers. Now it's grown into this all-rounder kit for everyday headaches, and we're still tweaking it based on what you guys actually need. If you've got ideas, hit me up – we're in this together.
//           </p>
//         </section>
//       </main>

//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
//         .animate-fade-in-delayed { animation: fade-in 0.8s ease-out 0.2s forwards; opacity: 0; }
//         .animate-fade-in-delayed-2 { animation: fade-in 0.8s ease-out 0.4s forwards; opacity: 0; }
//       `}</style>
//     </>
//   );
// }