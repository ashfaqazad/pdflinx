"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setStatus("Sending your message...");

    try {
      const res = await fetch("https://pdflinx.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Thanks! I got your message — I'll reply soon 😊");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Oops, something went wrong. Try again?");
      }
    } catch (error) {
      setStatus("Couldn't send — maybe check your connection?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-indigo-900">
            Hey, Let's Talk!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Got a question, suggestion, bug report, or just wanna say hi?<br />
            I'm the guy behind PDF Linx — drop me a message. I read everything and reply when I can.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
              Send me a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ashfaq"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white/70"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Hey, I love the tool... or I found a bug... or add this feature?"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none bg-white/70"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p className={`text-center mt-4 font-medium ${status.includes("Thanks") || status.includes("got") ? "text-green-600" : "text-red-600"}`}>
                  {status}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Mail className="w-8 h-8 text-indigo-600" />
              Other Ways to Reach Me
            </h2>

            <div className="space-y-5 text-gray-700">
              <p className="text-lg">
                Best way: Just use the form — I check it regularly.
              </p>
              <p className="text-lg">
                Or email me directly at:
              </p>
              <a
                href="mailto:ashfaqahmed@pdflinx.com"
                className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition break-all"
              >
                ashfaqahmed@pdflinx.com
              </a>
              <p className="text-lg mt-6">
                I'm usually replying on evenings or weekends (building this solo in my free time).
              </p>
              <p className="text-base italic text-gray-600 mt-6">
                Seriously — feedback, ideas, bug reports, even a simple "thanks" — all welcome. Makes my day.
              </p>
            </div>
          </div>
        </div>

        {/* <p className="text-center mt-16 text-gray-500 text-sm">
          Made with ❤️ from Karachi, Pakistan
        </p> */}

        <p className="text-center mt-16 text-gray-500 text-base italic">
          Made with ❤️ by a fellow PDF hater who just wanted better tools
        </p>
      </div>
    </main>
  );
}













// "use client";

// import { useState } from "react";

// export default function Contact() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Sending...");

//     try {
//       const res = await fetch("https://pdflinx.com/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, message }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setStatus("Message Sent Successfully!");
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         setStatus("Failed to send message. Try again.");
//       }
//     } catch (error) {
//       setStatus("Error connecting to server.");
//     }
//   };

//   return (
//     <main className="max-w-5xl mx-auto py-12 px-6">
//       {/* Page Header */}
//       <section className="text-center mb-12">

//         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
//         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
//           Have questions or feedback? We're here to help. Fill out the form below
//           or reach us directly via email.
//         </p>

//       </section>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Contact Form */}
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 placeholder="Your Name"
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="you@example.com"
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Message</label>
//               <textarea
//                 rows="5"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 required
//                 placeholder="Write your message..."
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               ></textarea>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Send Message
//             </button>
//           </form>

//           {status && (
//             <p className="mt-4 text-center text-green-600 font-medium">{status}</p>
//           )}
//         </div>

//         {/* Contact Info */}
//         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
//           <p className="text-gray-700 mb-4">
//             You can also reach out to us via the following contact details:
//           </p>
//           <ul className="space-y-3 text-gray-700">
//             <li>
//               <span className="font-medium">📧 Email:</span> ashfaqahmed@pdflinx.com
//             </li>
//             <li>
//               {/* <span className="font-medium">📍 Address:</span> Karachi, Pakistan */}
//             </li>
//             <li>
//               {/* <span className="font-medium">☎ Phone:</span> +92 3332758958 */}
//             </li>
//           </ul>
//         </div>
//       </div>
//     </main>
//   );
// }



























// "use client";

// export default function Contact() {
//   return (
//     <main className="max-w-5xl mx-auto py-12 px-6">
//       {/* Page Header */}
//       <section className="text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
//         <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
//           Have questions or feedback? We're here to help. Fill out the form below
//           or reach us directly via email.
//         </p>
//       </section>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Contact Form */}
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
//           <form className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Name</label>
//               <input
//                 type="text"
//                 placeholder="Your Name"
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">Message</label>
//               <textarea
//                 rows="5"
//                 placeholder="Write your message..."
//                 className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* Contact Info */}
//         <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
//           <p className="text-gray-700 mb-4">
//             You can also reach out to us via the following contact details:
//           </p>
//           <ul className="space-y-3 text-gray-700">
//             <li>
//               <span className="font-medium">📧 Email:</span> @pdflinx.com
//             </li>
//             <li>
//               <span className="font-medium">📍 Address:</span> Karachi, Pakistan
//             </li>
//             <li>
//               <span className="font-medium">☎ Phone:</span> +92 3332758958
//             </li>
//           </ul>
//         </div>
//       </div>
//     </main>
//   );
// }
