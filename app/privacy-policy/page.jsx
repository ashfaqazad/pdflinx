"use client";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to PDF Converter NSky. Your privacy is very important to us.
        This Privacy Policy explains how we collect, use, and protect your
        personal information when you use our website and services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <p className="mb-4">
        We may collect basic information such as your browser type, device
        details, and anonymous usage statistics to improve our website. When
        you contact us through forms, we may also collect your name and email
        address.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        How We Use Your Information
      </h2>
      <p className="mb-4">
        The information collected is used to enhance user experience, analyze
        website performance, and improve our services. We do not sell, rent, or
        share your personal information with third parties for marketing
        purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        We use cookies to improve website performance and to show relevant ads
        through Google AdSense. You can disable cookies in your browser settings
        at any time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Google AdSense</h2>
      <p className="mb-4">
        This website uses Google AdSense, a service for including advertisements
        from Google. Google AdSense uses cookies to help show relevant ads based
        on your visits to this and other websites. You can learn more about how
        Google uses your data by visiting{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s Advertising Policy
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to external websites. We are not
        responsible for the privacy practices or content of those third-party
        websites.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your data from unauthorized
        access, alteration, or disclosure. However, please understand that no
        method of transmission over the internet is completely secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any changes will be
        posted on this page with an updated revision date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy,
        please contact us at:{" "}
        <span className="font-medium">support@pdfnsky.com</span>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
