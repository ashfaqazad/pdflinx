"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("https://pdflinx.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Message Sent Successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Failed to send message. Try again.");
      }
    } catch (error) {
      setStatus("Error connecting to server.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto py-12 px-6">
      {/* Page Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Have questions or feedback? We're here to help. Fill out the form below 
          or reach us directly via email.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Write your message..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>

          {status && (
            <p className="mt-4 text-center text-green-600 font-medium">{status}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            You can also reach out to us via the following contact details:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>
              <span className="font-medium">📧 Email:</span> ashfaqahmed@pdflinx.com
            </li>
            <li>
              <span className="font-medium">📍 Address:</span> Karachi, Pakistan
            </li>
            <li>
              <span className="font-medium">☎ Phone:</span> +92 3332758958
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}



























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
