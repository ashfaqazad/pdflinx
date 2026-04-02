"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Utility ────────────────────────────────────────────────────────────────
function formatMB(mb) {
  if (mb >= 1000) return `${(mb / 1024).toFixed(2)} GB`;
  if (mb < 0.1) return `${(mb * 1024).toFixed(0)} KB`;
  return `${mb.toFixed(2)} MB`;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 2, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 700;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = clamp((timestamp - startRef.current) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else fromRef.current = to;
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ─── Circular Progress Ring ──────────────────────────────────────────────────
function SavingsRing({ percent }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = circ * clamp(percent / 100, 0, 1);

  const color =
    percent >= 60 ? "#22c55e" : percent >= 30 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      {/* Fill */}
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.34,1.56,0.64,1), stroke 0.4s" }}
      />
    </svg>
  );
}

// ─── Slider Input ─────────────────────────────────────────────────────────────
function SliderInput({ label, value, min, max, step = 0.1, unit, onChange, color = "#3b82f6" }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </label>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}
        >
          {value % 1 === 0 ? value : parseFloat(value).toFixed(1)} {unit}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{ background: `${accent}0d`, border: `1px solid ${accent}22` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${accent}18` }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-lg font-bold mt-0.5" style={{ color: accent }}>
            {value}
          </p>
          {sub && (
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CompressionSavingsCalculator() {
  // Inputs
  const [originalMB, setOriginalMB] = useState(10);
  const [compressedMB, setCompressedMB] = useState(4);
  const [filesPerMonth, setFilesPerMonth] = useState(50);

  // Guard: compressed can't exceed original
  const safeCompressed = clamp(compressedMB, 0.1, originalMB);

  // ── Calculations ──────────────────────────────────────────────────────────
  const savedPerFile = originalMB - safeCompressed;                // MB
  const savingsPct = (savedPerFile / originalMB) * 100;

  const monthlySavedMB = savedPerFile * filesPerMonth;             // MB
  const yearlySavedMB = monthlySavedMB * 12;                       // MB

  // Storage cost: ~$0.023 / GB / month (S3 standard)
  const monthlyCostSaved = (monthlySavedMB / 1024) * 0.023;

  // Bandwidth: ~$0.09 / GB
  const monthlyBandwidthSaved = (monthlySavedMB / 1024) * 0.09;

  // Extra emails: avg email limit 25 MB
  const extraEmailsMonthly = Math.floor(monthlySavedMB / 25);

  // CO2: ~0.000002 kg per MB of data stored/transferred (rough estimate)
  const monthlyCO2 = monthlySavedMB * 0.000002;

  // Transfer time saved @ 10 Mbps (typical upload)
  const timeSavedSec = (savedPerFile * 8) / 10; // file * bits/MB / Mbps
  const monthlyTimeSavedMin = (timeSavedSec * filesPerMonth) / 60;

  // ── Sync compressed slider max ────────────────────────────────────────────
  useEffect(() => {
    if (compressedMB > originalMB) setCompressedMB(parseFloat((originalMB * 0.5).toFixed(1)));
  }, [originalMB]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span>💰</span> Free Calculator
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            PDF Compression{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Savings Calculator
            </span>
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            See exactly how much storage, bandwidth, and money you save by compressing your PDFs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── Left: Inputs ── */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-7">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">⚙️</span>
              Your Numbers
            </h2>

            <SliderInput
              label="Original PDF Size"
              value={originalMB}
              min={0.5}
              max={100}
              step={0.5}
              unit="MB"
              color="#3b82f6"
              onChange={setOriginalMB}
            />

            <SliderInput
              label="Compressed PDF Size"
              value={safeCompressed}
              min={0.1}
              max={originalMB}
              step={0.1}
              unit="MB"
              color="#6366f1"
              onChange={setCompressedMB}
            />

            <SliderInput
              label="Files Per Month"
              value={filesPerMonth}
              min={1}
              max={500}
              step={1}
              unit="files"
              color="#8b5cf6"
              onChange={setFilesPerMonth}
            />

            {/* Size comparison bar */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Size Comparison
              </p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Original</span>
                    <span>{formatMB(originalMB)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-red-100">
                    <div className="h-full rounded-full bg-red-400" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Compressed</span>
                    <span>{formatMB(safeCompressed)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-green-100">
                    <div
                      className="h-full rounded-full bg-green-400 transition-all duration-700"
                      style={{ width: `${(safeCompressed / originalMB) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-5">

            {/* Savings ring card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <SavingsRing percent={savingsPct} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-gray-900">
                      <AnimatedNumber value={savingsPct} decimals={0} suffix="%" />
                    </span>
                    <span className="text-xs text-gray-400 font-medium">saved</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Per file you save</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    <AnimatedNumber value={savedPerFile} decimals={2} suffix=" MB" />
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatMB(originalMB)} → {formatMB(safeCompressed)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon="📦"
                label="Monthly Storage"
                value={formatMB(monthlySavedMB)}
                sub={`${formatMB(yearlySavedMB)} / year`}
                accent="#3b82f6"
              />
              <StatCard
                icon="💵"
                label="Storage Cost Saved"
                value={`$${monthlyCostSaved < 0.01 ? "<0.01" : monthlyCostSaved.toFixed(2)}/mo`}
                sub="Based on S3 pricing"
                accent="#10b981"
              />
              <StatCard
                icon="📧"
                label="Extra Emails/mo"
                value={`+${extraEmailsMonthly}`}
                sub="vs 25 MB email limit"
                accent="#8b5cf6"
              />
              <StatCard
                icon="⚡"
                label="Upload Time Saved"
                value={`${monthlyTimeSavedMin < 1 ? "<1" : monthlyTimeSavedMin.toFixed(0)} min/mo`}
                sub="At 10 Mbps upload"
                accent="#f59e0b"
              />
              <StatCard
                icon="📡"
                label="Bandwidth Saved"
                value={`$${monthlyBandwidthSaved < 0.01 ? "<0.01" : monthlyBandwidthSaved.toFixed(2)}/mo`}
                sub="Outbound bandwidth"
                accent="#ef4444"
              />
              <StatCard
                icon="🌍"
                label="CO₂ Reduced"
                value={`${monthlyCO2 < 0.001 ? "<0.001" : monthlyCO2.toFixed(3)} kg/mo`}
                sub="Data center emissions"
                accent="#06b6d4"
              />
            </div>

            {/* CTA */}
            <Link
              href="/compress-pdf"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              }}
            >
              <span>🗜️</span>
              Compress My PDF Now — It&apos;s Free
              <span className="ml-1 opacity-75">→</span>
            </Link>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Estimates are approximate. Storage costs based on AWS S3 Standard pricing. CO₂ figures based on average data center energy usage.
        </p>
      </div>
    </section>
  );
}