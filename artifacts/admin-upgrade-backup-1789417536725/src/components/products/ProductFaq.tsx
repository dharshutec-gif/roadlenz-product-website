"use client";

import {
  useState,
} from "react";

type Faq = {
  label: string;

  value: string;
};

export default function ProductFaq({
  faqs,
}: {
  faqs: Faq[];
}) {
  const [
    opened,
    setOpened,
  ] =
    useState<
      number | null
    >(
      faqs.length >
        0
        ? 0
        : null,
    );

  if (
    !faqs.length
  ) {
    return null;
  }

  return (
    <section
      id="faq"
      className="scroll-mt-32 bg-[#f6f6f7] py-14 sm:py-20"
    >
      <div className="shell max-w-5xl">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand-600">
            Common Questions
          </p>

          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Frequently asked
            questions
          </h2>
        </div>

        <div className="mt-9 grid gap-3 md:grid-cols-2">
          {faqs.map(
            (
              faq,
              index,
            ) => {
              const open =
                opened ===
                index;

              return (
                <article
                  key={`${faq.label}-${index}`}
                  className={`overflow-hidden rounded-xl border bg-white transition ${
                    open
                      ? "border-brand-200 shadow-sm md:col-span-2"
                      : "border-line"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpened(
                        open
                          ? null
                          : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-ink">
                      {
                        faq.label
                      }
                    </span>

                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-base ${
                        open
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-brand-200 bg-brand-50 text-brand-700"
                      }`}
                    >
                      {open
                        ? "−"
                        : "+"}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-line px-5 pb-5 pt-4 text-sm leading-7 text-ink-muted">
                      {
                        faq.value
                      }
                    </div>
                  )}
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}