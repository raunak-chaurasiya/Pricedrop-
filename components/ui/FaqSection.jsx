"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Is this website completely free to use?",
    answer: "Yes, it is 100% free to use! You can track any product, view price history, and monitor price drops with zero fees or subscriptions.",
  },
  {
    question: "How do I use DealDrop to track prices?",
    answer: "Just copy the product link from Amazon, Flipkart, or any supported store, paste it into the tracker box above, and click Track. Let the magic happen!",
  },
  {
    question: "Which e-commerce stores are supported?",
    answer: "We support major online shopping platforms including Amazon, Flipkart, Myntra, and many more, with real-time price extraction.",
  },
  {
    question: "How do price drop alerts and history work?",
    answer: "We continuously record the price changes of your tracked products. You can inspect interactive price trend charts to see if you're getting the best deal.",
  },
  {
    question: "Do I need to install any browser extension or app?",
    answer: "No extra extensions or installations required. DealDrop works seamlessly on any browser across desktop, tablet, and mobile devices.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-100/80 text-orange-800 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-orange-200/80 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-lg mx-auto">
            Quick answers to help you start tracking prices and saving money like a pro.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-xs rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                  isOpen
                    ? "border-orange-300 ring-2 ring-orange-500/10 shadow-sm"
                    : "border-gray-200/80 hover:border-orange-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-medium text-gray-900 focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5 text-sm sm:text-base font-semibold text-gray-800">
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-orange-500 text-white font-bold"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Animated Collapsible Body */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-orange-100/60 mt-1">
                      <div className="flex items-start gap-2 pt-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
