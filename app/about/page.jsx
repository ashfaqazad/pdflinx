"use client";

import { ShieldCheck, Zap, Globe } from "lucide-react";
import Script from "next/script";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PDF Linx",
    description:
      "Learn about PDF Linx — a privacy-first collection of free PDF and utility tools built for speed and simplicity.",
    url: "https://pdflinx.com/about",
    publisher: {
      "@type": "Organization",
      name: "PDF Linx",
      url: "https://pdflinx.com",
    },
  };

  return (
    <>
      {/* SEO Schema (JSON-LD) */}
      <Script
        id="aboutpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        {/* Hero Section */}
        <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
            About <strong>PDF Linx</strong>
          </h1>

          <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-3">
            <p>
              I built PDF Linx in <strong>October 2023</strong> after wasting way
              too much time trying to convert a simple scanned receipt.
              I tested multiple “free” converters — and they all came with the
              same annoying problems.
            </p>

            <p>You know the type:</p>
            <ul className="list-none space-y-1 ml-4">
              <li>→ “Sign up to download your file” (why?)</li>
              <li>→ tiny file limits</li>
              <li>→ popups and distractions</li>
              <li>→ slow processing for basic tasks</li>
            </ul>

            <p>
              So I spent the weekend building something that just works —
              simple, fast, and focused. Many tools run directly in your browser
              to keep things private and quick.
            </p>

            <p>
              I posted it on Reddit in November and it got surprising traction.
              A friend used it for a thesis (merging a bunch of PDFs), and then
              more people started sharing it.
            </p>

            <p>
              Today, there’s a small but growing community — especially across
              Pakistan, India, and Bangladesh (shoutout to the desi dev community 🙏).
            </p>

            <p className="text-gray-600 italic">
              Built solo. Maintained continuously. Privacy-first by default.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-6">
            Why This Exists
          </h2>

          <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed space-y-3">
            <p>
              I’m not trying to build the next billion-dollar startup. I just got
              tired of clunky tools that charge monthly subscriptions for basic
              PDF operations.
            </p>

            <p>
              The goal is simple: <strong>don’t waste people’s time</strong>.
            </p>

            <p>
              Whether you’re a student submitting assignments at 2 AM, a freelancer
              dealing with client files, or someone making a QR code for a café menu —
              these tools should just work. Fast. Simple. Minimal friction.
            </p>

            <p className="text-gray-600">
              And yes — I keep the site clean. No spammy popups. No weird tricks.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <Globe className="w-16 h-16 mx-auto text-indigo-700 mb-4 p-3 rounded-xl bg-indigo-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition">
              Actually <strong>Free</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              No “free trial” traps. No account required. No credit card.
              <br />
              <br />
              Use it on phone, laptop, tablet — just open the site and go.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
              Fast, <strong>Always</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Most tools finish quickly — because waiting for simple tasks is painful.
              <br />
              <br />
              Merging PDFs, compressing files, converting formats — built to be snappy.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
            <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
              Your Files Stay <strong>Yours</strong>
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Many tools run directly in your browser — so your files aren’t sent
              to random servers for processing.
              <br />
              <br />
              If a tool requires server processing, it’s clearly disclosed in the tool page.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
            How We Got <strong>Here</strong>
          </h2>

          <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-3">
            <p>
              Started as a weekend project in <strong>October 2023</strong>. Just
              me, building what I wished existed.
            </p>

            <p>
              The first version had just a few essentials:{" "}
              <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and{" "}
              <strong>Compress PDF</strong>.
            </p>

            <p>
              Then people started requesting more:
              <br />
              → QR Code Generator (added)
              <br />
              → Password Generator (added)
              <br />
              → Image Compression (added)
            </p>

            <p>
              Now there are <strong>18 tools</strong> — and I still ship updates
              based on feedback.
            </p>

            <p className="text-gray-600 italic">
              Got an idea or found a bug? Email{" "}
              <strong>support@pdflinx.com</strong>. I read everything.
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

//       <main className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

//         {/* Hero Section */}
//         <section className="text-center mb-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
//             About <strong>PDF Linx</strong>
//           </h1>

//           <div className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-left space-y-3">
//             <p>
//               Built this in <strong>October 2023</strong> after spending 2 hours trying to convert a scanned receipt.
//               Tried 5 different "free" PDF converters. Every single one was trash.
//             </p>

//             <p>You know the type:</p>
//             <ul className="list-none space-y-1 ml-4">
//               <li>→ "Sign up to download your file" (like, why?)</li>
//               <li>→ 5MB file limit (completely useless)</li>
//               <li>→ Popup ads every 10 seconds</li>
//               <li>→ "Your file will be ready in 3 minutes" (it's <strong>2026</strong>, seriously?)</li>
//             </ul>

//             <p>
//               So I spent that weekend building something that just... works. No signup BS,
//               no file uploads to random servers, no ads. Everything runs in your browser.
//             </p>

//             <p>
//               Posted it on Reddit in November. Got <strong>200 users first day</strong>. My roommate Ali used it
//               for his thesis (had to merge like 50 PDFs), then his entire lab started using it.
//             </p>

//             <p>
//               Now we've got a <strong>growing community</strong> — mostly from Pakistan, India,
//               and Bangladesh (shoutout to the desi dev community 🙏).
//             </p>

//             <p className="text-gray-600 italic">
//               Still free. Still no ads. Still just me maintaining it on weekends between my day job.
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

//             <p className="text-gray-600">
//               (Also I hate ads with a passion, so you'll never see any here. That's a promise.)
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
//               No "free trial" BS. No "upgrade to premium" popups. No credit card required.
//               <br /><br />
//               Everything is free. Forever. Use it on your phone, laptop, tablet — whatever.
//               No app download, no account signup.
//               <br /><br />
//               Just open the site and go.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <Zap className="w-16 h-16 mx-auto text-amber-600 mb-4 p-3 rounded-xl bg-amber-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition">
//               <strong>Fast</strong> AF
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
//               I personally hate waiting for stuff to load. So most tools finish in under 10 seconds.
//               <br /><br />
//               Merging 20 PDFs? Done. Compressing a 50MB file? Quick. Converting Word to PDF? Instant.
//               <br /><br />
//               (Tested on my old 2019 laptop — if it works there, it'll work on yours.)
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-2">
//             <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 mb-4 p-3 rounded-xl bg-emerald-50 group-hover:scale-110 transition" />
//             <h3 className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition">
//               Your Files Stay <strong>Yours</strong>
//             </h3>
//             <p className="text-gray-600 text-center text-sm leading-relaxed">
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
//         <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
//             How We Got <strong>Here</strong>
//           </h2>

//           <div className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed text-left space-y-3">
//             <p>
//               Started as a weekend project in <strong>October 2023</strong>. Just me, frustrated with existing
//               PDF tools, coding something better.
//             </p>

//             <p>
//               First version had 3 tools: <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and <strong>Compress PDF</strong>.
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
//               Now we have <strong>18 tools</strong> (probably too many tbh, but people keep requesting stuff).
//             </p>

//             <p>
//               Started with a handful of friends and Reddit shares. Now serving{" "}
//               <strong>thousands of users</strong>{" "}
//               across South Asia as of early 2026.
//             </p>

//             <p className="text-gray-600 italic">
//               If you've got ideas for new tools or found a bug, hit me up on Twitter
//               (@pdflinx) or email (support@pdflinx.com). Seriously, I read everything.
//             </p>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// }

















// // "use client";

// // import { ShieldCheck, Zap, Globe } from "lucide-react";

// // export default function About() {
// //   return (
// //     <>
// //       {/* SEO Schema */}
// //       <head>
// //         <script
// //           type="application/ld+json"
// //           dangerouslySetInnerHTML={{
// //             __html: JSON.stringify({
// //               "@context": "https://schema.org",
// //               "@type": "AboutPage",
// //               name: "About PDF Linx",
// //               description: "Learn about our free online PDF and utility tools platform.",
// //               url: "https://pdflinx.com/about",
// //               publisher: {
// //                 "@type": "Organization",
// //                 name: "PDF Linx",
// //                 url: "https://pdflinx.com",
// //               },
// //             }),
// //           }}
// //         />
// //       </head>

// //       <main className="max-w-6xl mx-auto py-10 px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

// //         {/* Hero Section */}
// //         <section className="text-center mb-20 backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 transition-all duration-700 hover:shadow-indigo-100">
// //           <h1 className="text-5xl md:text-6xl font-black mb-8 text-indigo-900 leading-tight tracking-tight">
// //             About <strong>PDF Linx</strong>
// //           </h1>

// //           <div className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-left space-y-4">
// //             <p>
// //               Built this in <strong>October 2023</strong> after spending 2 hours trying to convert a scanned receipt.
// //               Tried 5 different "free" PDF converters. Every single one was trash.
// //             </p>

// //             <p>You know the type:</p>
// //             <ul className="list-none space-y-2 ml-4">
// //               <li>→ "Sign up to download your file" (like, why?)</li>
// //               <li>→ 5MB file limit (completely useless)</li>
// //               <li>→ Popup ads every 10 seconds</li>
// //               <li>→ "Your file will be ready in 3 minutes" (it's <strong>2026</strong>, seriously?)</li>
// //             </ul>

// //             <p>
// //               So I spent that weekend building something that just... works. No signup BS,
// //               no file uploads to random servers, no ads. Everything runs in your browser.
// //             </p>

// //             <p>
// //               Posted it on Reddit in November. Got <strong>200 users first day</strong>. My roommate Ali used it
// //               for his thesis (had to merge like 50 PDFs), then his entire lab started using it.
// //             </p>

// //             <p>
// //               Now we've got a <strong>growing community</strong> — mostly from Pakistan, India,
// //               and Bangladesh (shoutout to the desi dev community 🙏).
// //             </p>

// //             <p className="text-base text-gray-600 italic">
// //               Still free. Still no ads. Still just me maintaining it on weekends between my day job.
// //             </p>
// //           </div>
// //         </section>

// //         {/* Mission Section */}
// //         <section className="mb-20 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-100/50 p-10 md:p-16">
// //           <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8">
// //             Why This Exists
// //           </h2>

// //           <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed space-y-4">
// //             <p>
// //               Look, I'm not trying to build the next billion-dollar startup or whatever.
// //               I just got tired of clunky software that charges $30/month for basic PDF operations.
// //             </p>

// //             <p>
// //               The goal is simple: <strong>don't waste people's time</strong>.
// //             </p>

// //             <p>
// //               Whether you're a student juggling assignments at 2 AM, a freelancer dealing with
// //               clients' messy files, or someone who just needs to make a QR code for their cafe menu
// //               — these tools should just work. Fast. Free. No friction.
// //             </p>

// //             <p className="text-base text-gray-600">
// //               (Also I hate ads with a passion, so you'll never see any here. That's a promise.)
// //             </p>
// //           </div>
// //         </section>

// //         {/* Feature Cards */}
// //         <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

// //           {/* Card 1 */}
// //           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-indigo-200">
// //             <Globe className="w-20 h-20 mx-auto text-indigo-700 mb-6 shadow-lg p-4 rounded-2xl bg-indigo-50/80 group-hover:scale-110 transition-transform duration-300" />
// //             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
// //               Actually <strong>Free</strong>
// //             </h3>
// //             <p className="text-gray-600 text-center leading-relaxed">
// //               No "free trial" BS. No "upgrade to premium" popups. No credit card required.
// //               <br /><br />
// //               Everything is free. Forever. Use it on your phone, laptop, tablet — whatever.
// //               No app download, no account signup.
// //               <br /><br />
// //               Just open the site and go.
// //             </p>
// //           </div>

// //           {/* Card 2 */}
// //           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-amber-200">
// //             <Zap className="w-20 h-20 mx-auto text-amber-600 mb-6 shadow-lg p-4 rounded-2xl bg-amber-50/80 group-hover:scale-110 transition-transform duration-300" />
// //             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-amber-600 transition-colors">
// //               <strong>Fast</strong> AF
// //             </h3>
// //             <p className="text-gray-600 text-center leading-relaxed">
// //               I personally hate waiting for stuff to load. So most tools finish in under 10 seconds.
// //               <br /><br />
// //               Merging 20 PDFs? Done. Compressing a 50MB file? Quick. Converting Word to PDF? Instant.
// //               <br /><br />
// //               (Tested on my old 2019 laptop — if it works there, it'll work on yours.)
// //             </p>
// //           </div>

// //           {/* Card 3 */}
// //           <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-emerald-200">
// //             <ShieldCheck className="w-20 h-20 mx-auto text-emerald-600 mb-6 shadow-lg p-4 rounded-2xl bg-emerald-50/80 group-hover:scale-110 transition-transform duration-300" />
// //             <h3 className="text-2xl text-center font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">
// //               Your Files Stay <strong>Yours</strong>
// //             </h3>
// //             <p className="text-gray-600 text-center leading-relaxed">
// //               Everything happens in your browser. I don't upload your files to any server.
// //               Ever.
// //               <br /><br />
// //               No cloud storage. No "we'll delete your files in 24 hours" (because they're never uploaded
// //               in the first place).
// //               <br /><br />
// //               Zero tracking. Zero data collection. I literally can't see what files you're converting.
// //             </p>
// //           </div>
// //         </section>

// //         {/* Story Section */}
// //         <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100/50 p-10 md:p-16 text-center">
// //           <h2 className="text-4xl font-black mb-8 text-indigo-900">
// //             How We Got <strong>Here</strong>
// //           </h2>

// //           <div className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed text-left space-y-4">
// //             <p>
// //               Started as a weekend project in <strong>October 2023</strong>. Just me, frustrated with existing
// //               PDF tools, coding something better.
// //             </p>

// //             <p>
// //               First version had 3 tools: <strong>PDF to Word</strong>, <strong>Merge PDF</strong>, and <strong>Compress PDF</strong>.
// //               That's it. Built them in like 2 weeks.
// //             </p>

// //             <p>
// //               Then people started asking for more stuff:
// //               <br />
// //               → "Can you add QR code generator?" (Added in December)
// //               <br />
// //               → "What about password generator?" (Done)
// //               <br />
// //               → "Image compression would be useful" (Added that too)
// //             </p>

// //             <p>
// //               Now we have <strong>18 tools</strong> (probably too many tbh, but people keep requesting stuff).
// //             </p>

// //             {/* <p>
// //               Started with a handful of friends and Reddit shares. Now serving <strong>thousands of users
// //                 </strong> 
// //               across South Asia as of early 2026.
// //             </p> */}

// //             <p>
// //               Started with a handful of friends and Reddit shares. Now serving{" "}
// //               <strong>thousands of users</strong>{" "}
// //               across South Asia as of early 2026.
// //             </p>


// //             <p className="text-base text-gray-600 italic">
// //               If you've got ideas for new tools or found a bug, hit me up on Twitter
// //               (@pdflinx) or email (hello@pdflinx.com). Seriously, I read everything.
// //             </p>
// //           </div>
// //         </section>

// //       </main>
// //     </>
// //   );
// // }

