"use client";

import React, { FormEvent, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

type EnquiryType =
  | "General Enquiry"
  | "Product Enquiry"
  | "Customer Support"
  | "Installation Support"
  | "Technical Support";

const supportCards = [
  {
    number: "01",
    category: "Customer Support",
    title: "Customer Support",
    icon: "headset",
    phone: "+91 98416 00444",
    phoneHref: "+919841600444",
    email: "bigfoxinfo@gmail.com",
    points: [
      "Product enquiries and solution guidance",
      "Account and service assistance",
      "General RoadLenz customer support",
    ],
  },
  {
    number: "02",
    category: "Installation Support",
    title: "Installation Support",
    icon: "tools",
    phone: "+91 95669 12277",
    phoneHref: "+919566912277",
    email: "projects@bigfox.co.in",
    points: [
      "Device installation support",
      "Vehicle deployment and commissioning",
      "On-site implementation assistance",
    ],
  },
  {
    number: "03",
    category: "Technical Support",
    title: "Technical Support",
    icon: "settings",
    phone: "+91 78710 59890",
    phoneHref: "+917871059890",
    email: "bigfoxsales@gmail.com",
    points: [
      "RoadLenz software support",
      "Device configuration and connectivity",
      "Troubleshooting and technical assistance",
    ],
  },
];

export default function ContactPage() {
  const reduceMotion = useReducedMotion();

  const [enquiryType, setEnquiryType] =
    useState<EnquiryType>("General Enquiry");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSuccess(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      enquiryType,
      name: String(formData.get("name") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      fleetSize: String(formData.get("fleetSize") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to submit enquiry.",
        );
      }

      form.reset();
      setEnquiryType("General Enquiry");
      setSuccess(true);

      window.setTimeout(() => {
        setSuccess(false);
      }, 6000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[#f7fbff] text-[#0b2850]">
      {/* ======================================================
          CONTACT INTRO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-[#e0eaf2] bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,#ffffff_0%,#ffffff_43%,rgba(235,247,255,.75)_74%,rgba(219,241,255,.95)_100%)]" />

          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle,rgba(53,125,181,.14) 1px,transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage:
                "linear-gradient(90deg,transparent 34%,black 100%)",
            }}
          />

          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 70, 0],
                    y: [0, 30, 0],
                  }
            }
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-[180px] -top-[200px] h-[560px] w-[560px] rounded-full bg-[#c4e8fa]/70 blur-[130px]"
          />
        </div>

        <div className="relative mx-auto grid min-h-[530px] w-full max-w-[1400px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:px-12 lg:py-20">
          {/* LEFT */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 28,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#1786d1]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#56748e]">
                Contact RoadLenz
              </span>
            </div>

            <h1 className="mt-5 max-w-[740px] text-[42px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#071f42] sm:text-[52px] lg:text-[60px]">
              Tell us what you need.

              <span className="block text-[#617d98]">
                We&apos;ll connect you with the right team.
              </span>
            </h1>

            <p className="mt-7 max-w-[680px] text-[15px] leading-8 text-[#607990] sm:text-[16px]">
              Talk to us about GPS tracking, dashcams, MDVR,
              AI safety systems, fleet software, installation
              or technical assistance.
            </p>

            {/* BENEFITS */}

            <div className="mt-10 grid max-w-[790px] gap-6 sm:grid-cols-3">
              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -5,
                      }
                }
                className="group flex items-center gap-4"
              >
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[17px] border border-[#d8eaf5] bg-[#eaf6fd] text-[#1486d4] shadow-[0_8px_22px_rgba(20,134,212,.08)] transition duration-300 group-hover:bg-[#e1f2fc]">
                  <MessageIcon className="h-[20px] w-[20px]" />
                </span>

                <div>
                  <p className="text-[14px] font-semibold leading-5 text-[#153d65] sm:text-[15px]">
                    Faster Response
                  </p>

                  <p className="mt-1.5 text-[11px] leading-[1.45] text-[#7f93a5] sm:text-[12px]">
                    Get expert support quickly
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -5,
                      }
                }
                className="group flex items-center gap-4"
              >
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[17px] border border-[#d8eaf5] bg-[#eaf6fd] text-[#1486d4] shadow-[0_8px_22px_rgba(20,134,212,.08)] transition duration-300 group-hover:bg-[#e1f2fc]">
                  <TeamIcon className="h-[20px] w-[20px]" />
                </span>

                <div>
                  <p className="text-[14px] font-semibold leading-5 text-[#153d65] sm:text-[15px]">
                    Right Team
                  </p>

                  <p className="mt-1.5 text-[11px] leading-[1.45] text-[#7f93a5] sm:text-[12px]">
                    Connect with specialists
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -5,
                      }
                }
                className="group flex items-center gap-4"
              >
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[17px] border border-[#d8eaf5] bg-[#eaf6fd] text-[#1486d4] shadow-[0_8px_22px_rgba(20,134,212,.08)] transition duration-300 group-hover:bg-[#e1f2fc]">
                  <ShieldIcon className="h-[20px] w-[20px]" />
                </span>

                <div>
                  <p className="text-[14px] font-semibold leading-5 text-[#153d65] sm:text-[15px]">
                    Keep Moving
                  </p>

                  <p className="mt-1.5 text-[11px] leading-[1.45] text-[#7f93a5] sm:text-[12px]">
                    Reliable fleet assistance
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 45,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.85,
              delay: 0.08,
            }}
            className="relative min-h-[390px]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-[30px]">
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.035, 1],
                      }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/contact/contact-fleet-support.webp')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent" />
            </div>

            {/* QUICK CONTACT */}

            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -7, 0],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-4 top-1/2 w-[calc(100%-2rem)] max-w-[360px] -translate-y-1/2 rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_65px_rgba(18,62,101,.15)] backdrop-blur-xl sm:left-7"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#607b92]">
                Quick Contact
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-[#91a1ae]">
                Reach us directly for immediate assistance.
              </p>

              <a
                href="tel:+919841600444"
                className="group mt-4 flex items-center justify-between rounded-[15px] border border-[#dfeaf2] bg-[#fbfdff] p-3.5 transition duration-300 hover:-translate-y-[2px] hover:bg-white hover:shadow-[0_10px_25px_rgba(15,53,86,.07)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5fd] text-[#1286d3]">
                    <PhoneIcon />
                  </span>

                  <div>
                    <p className="text-[9px] text-[#92a2af]">
                      Customer Support
                    </p>

                    <p className="mt-0.5 text-[13px] font-semibold text-[#133c63]">
                      +91 98416 00444
                    </p>
                  </div>
                </div>

                <span className="text-[#8398aa] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="mailto:bigfoxinfo@gmail.com"
                className="group mt-2.5 flex items-center justify-between rounded-[15px] border border-[#dfeaf2] bg-[#fbfdff] p-3.5 transition duration-300 hover:-translate-y-[2px] hover:bg-white hover:shadow-[0_10px_25px_rgba(15,53,86,.07)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5fd] text-[#1286d3]">
                    <MailIcon />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] text-[#92a2af]">
                      Email Us
                    </p>

                    <p className="mt-0.5 truncate text-[13px] font-semibold text-[#133c63]">
                      bigfoxinfo@gmail.com
                    </p>
                  </div>
                </div>

                <span className="ml-2 text-[#8398aa] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          ENQUIRY SECTION
      ====================================================== */}

      <section
        id="enquiry"
        className="relative py-16 sm:py-20 lg:py-24"
      >
        <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="grid overflow-hidden rounded-[30px] border border-[#dce8f1] bg-white shadow-[0_30px_85px_rgba(10,53,91,.09)] lg:grid-cols-[.95fr_1.05fr]">

            {/* LEFT VISUAL */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -40,
                    }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
              }}
              className="relative min-h-[540px] overflow-hidden bg-[#061f38] lg:min-h-[720px]"
            >
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.035, 1],
                      }
                }
                transition={{
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/contact/support-operations.webp')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#051a30]/95 via-[#061d33]/30 to-[#061d33]/5" />

              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9 lg:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#63c9df]">
                  Always Connected
                </p>

                <h2 className="mt-4 max-w-[440px] text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-[36px]">
                  A smarter, safer fleet starts with a conversation.
                </h2>

                <p className="mt-4 max-w-[420px] text-[13px] leading-7 text-white/60">
                  Our team is here to understand your needs
                  and help you find the right solution.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  <StatItem
                    icon={<VehicleIcon />}
                    value="2000+"
                    label="Vehicles Connected"
                  />

                  <StatItem
                    icon={<ExperienceIcon />}
                    value="10+"
                    label="Years of Experience"
                  />

                  <StatItem
                    icon={<ClockIcon />}
                    value="24/7"
                    label="Customer Support"
                  />
                </div>
              </div>
            </motion.div>

            {/* FORM */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 40,
                    }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
              }}
              className="relative p-6 sm:p-8 lg:p-10 xl:p-12"
            >
              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-8 bg-[#208fd6]" />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#65819a]">
                        Enquiry Form
                      </p>
                    </div>

                    <h2 className="mt-3 text-[31px] font-semibold tracking-[-0.04em] text-[#0a2850] sm:text-[36px]">
                      How can we help?
                    </h2>

                    <p className="mt-2 text-[12px] leading-5 text-[#8194a5]">
                      Fill in the details below and our team
                      will contact you.
                    </p>
                  </div>

                  <span className="hidden h-12 w-12 items-center justify-center rounded-[15px] border border-[#dce8f1] bg-[#f7fbfe] text-[#2776aa] sm:flex">
                    <MessageIcon />
                  </span>
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 rounded-[14px] border border-[#cfe6d8] bg-[#f2faf5] p-4"
                    >
                      <p className="text-[12px] font-semibold text-[#316447]">
                        Enquiry submitted successfully.
                      </p>

                      <p className="mt-1 text-[11px] text-[#718a79]">
                        Our team has received your enquiry.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="mt-6 rounded-[14px] border border-[#ead5d5] bg-[#fff7f7] p-4 text-[11px] text-[#924545]">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 grid gap-5"
                >
                  <FormLabel
                    label="Enquiry Type"
                    required
                  >
                    <select
                      value={enquiryType}
                      required
                      onChange={(event) =>
                        setEnquiryType(
                          event.target.value as EnquiryType,
                        )
                      }
                      className={fieldClass}
                    >
                      <option value="General Enquiry">
                        General Enquiry
                      </option>

                      <option value="Product Enquiry">
                        Product Enquiry
                      </option>

                      <option value="Customer Support">
                        Customer Support
                      </option>

                      <option value="Installation Support">
                        Installation Support
                      </option>

                      <option value="Technical Support">
                        Technical Support
                      </option>
                    </select>
                  </FormLabel>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormLabel
                      label="Name"
                      required
                    >
                      <input
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Enter your name"
                        className={fieldClass}
                      />
                    </FormLabel>

                    <FormLabel
                      label="Company"
                      optional
                    >
                      <input
                        type="text"
                        name="company"
                        autoComplete="organization"
                        placeholder="Company name"
                        className={fieldClass}
                      />
                    </FormLabel>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormLabel
                      label="Phone Number"
                      required
                    >
                      <input
                        type="tel"
                        name="phone"
                        required
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className={fieldClass}
                      />
                    </FormLabel>

                    <FormLabel
                      label="Email Address"
                      required
                    >
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="name@company.com"
                        className={fieldClass}
                      />
                    </FormLabel>
                  </div>

                  <FormLabel
                    label="Fleet Size"
                    optional
                  >
                    <select
                      name="fleetSize"
                      defaultValue=""
                      className={fieldClass}
                    >
                      <option value="">
                        Select fleet size
                      </option>

                      <option value="1 - 10 Vehicles">
                        1 - 10 Vehicles
                      </option>

                      <option value="11 - 50 Vehicles">
                        11 - 50 Vehicles
                      </option>

                      <option value="51 - 100 Vehicles">
                        51 - 100 Vehicles
                      </option>

                      <option value="101 - 500 Vehicles">
                        101 - 500 Vehicles
                      </option>

                      <option value="500+ Vehicles">
                        500+ Vehicles
                      </option>
                    </select>
                  </FormLabel>

                  <FormLabel
                    label="Requirement"
                    required
                  >
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your requirement..."
                      className={`${fieldClass} h-auto resize-none py-4 leading-6`}
                    />
                  </FormLabel>

                  <div className="flex items-center gap-2">
                    <span className="text-[#1687d4]">
                      *
                    </span>

                    <p className="text-[10px] text-[#8597a5]">
                      Mandatory fields
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={
                      reduceMotion || submitting
                        ? undefined
                        : { y: -2 }
                    }
                    whileTap={
                      reduceMotion || submitting
                        ? undefined
                        : { scale: 0.99 }
                    }
                    className="group flex h-[54px] items-center justify-center gap-4 rounded-[12px] bg-gradient-to-r from-[#1289eb] to-[#056bd9] text-[11px] font-semibold text-white shadow-[0_14px_30px_rgba(8,123,229,.20)] transition hover:shadow-[0_18px_36px_rgba(8,123,229,.27)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Enquiry

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 pt-1 text-center text-[9px] leading-5 text-[#8799a7]">
                    <ShieldIcon />

                    <span>
                      Your information will only be used to
                      respond to your enquiry.
                    </span>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SUPPORT TEAMS
      ====================================================== */}

      <section
        id="support"
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-11"
          >
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#208bd4]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-[#69839a]">
                Our Support Teams
              </p>
            </div>

            <div className="mt-3">
              <h2 className="text-[32px] font-semibold tracking-[-0.04em] text-[#09284d] sm:text-[40px]">
                Specialised support, whenever you need it.
              </h2>

              <p className="mt-3 max-w-[620px] text-[14px] leading-7 text-[#71879a]">
                Connect directly with the team best suited to
                your requirement.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {supportCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 40,
                        scale: 0.98,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.1,
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -7,
                      }
                }
                className="group relative overflow-hidden rounded-[25px] border border-[#deebf3] bg-white p-6 shadow-[0_16px_48px_rgba(18,58,90,.06)] transition-shadow duration-500 hover:shadow-[0_28px_65px_rgba(18,58,90,.12)]"
              >
                <span className="absolute right-5 top-5 text-[10px] font-semibold text-[#aac0d1]">
                  {card.number}
                </span>

                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: 6,
                          scale: 1.06,
                        }
                  }
                  className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#eaf6fe] text-[#147ece] shadow-[0_8px_22px_rgba(20,126,206,.08)]"
                >
                  {card.icon === "headset" && (
                    <HeadsetIcon />
                  )}

                  {card.icon === "tools" && (
                    <ToolsIcon />
                  )}

                  {card.icon === "settings" && (
                    <SettingsIcon />
                  )}
                </motion.div>

                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#67829b]">
                  {card.category}
                </p>

                <h3 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#0c2d54]">
                  {card.title}
                </h3>

                <div className="mt-5 min-h-[116px] space-y-3">
                  {card.points.map((point, pointIndex) => (
                    <motion.div
                      key={point}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              x: -12,
                            }
                      }
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay:
                          index * 0.1 +
                          pointIndex * 0.08,
                      }}
                      className="flex items-center gap-3"
                    >
                      <motion.span
                        animate={
                          reduceMotion
                            ? undefined
                            : {
                                rotate: [0, 12, 0],
                                scale: [1, 1.12, 1],
                              }
                        }
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: pointIndex * 0.45,
                          ease: "easeInOut",
                        }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center text-[#2389d2]"
                      >
                        <SparkleIcon />
                      </motion.span>

                      <span className="text-[12px] font-medium leading-5 text-[#58738a]">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="my-5 h-px bg-[#e5edf3]" />

                <SupportAction
                  href={`tel:${card.phoneHref}`}
                  icon={<PhoneIcon />}
                  label="Call Support"
                  value={card.phone}
                />

                <SupportAction
                  href={`mailto:${card.email}`}
                  icon={<MailIcon />}
                  label="Email Support"
                  value={card.email}
                  className="mt-2.5"
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-white pb-20">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[25px] border border-[#d6e9f5] bg-[linear-gradient(100deg,#eaf7ff_0%,#ffffff_52%,#e6f5ff_100%)] px-6 py-7 sm:px-8"
          >
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4d83a8]">
                  Let&apos;s build safer roads together
                </p>

                <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.03em] text-[#092b53] sm:text-[29px]">
                  Ready to make your fleet smarter?
                </h2>

                <p className="mt-1.5 text-[12px] text-[#758da0]">
                  Get in touch with our team today.
                </p>
              </div>

              <a
                href="#enquiry"
                className="group flex h-[48px] min-w-[190px] items-center justify-center gap-4 rounded-full bg-[#087be5] px-6 text-[10px] font-semibold text-white shadow-[0_12px_28px_rgba(7,123,229,.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#066dd0]"
              >
                Contact Us

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   SHARED STYLES
============================================================ */

const fieldClass =
  "h-[52px] w-full rounded-[12px] border border-[#d6e2eb] bg-[#f9fbfd] px-4 text-[13px] text-[#173a57] outline-none transition placeholder:text-[#a1b0bc] focus:border-[#7faeca] focus:bg-white focus:ring-4 focus:ring-[#e7f2f8]";

/* ============================================================
   SMALL HELPERS
============================================================ */

function FormLabel({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-[#183b59]">
        {label}

        {required && (
          <span className="text-[#1687d4]">
            *
          </span>
        )}

        {optional && (
          <span className="text-[9px] font-normal text-[#91a1ae]">
            Optional
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-[#73d8e9]">
        {icon}
      </span>

      <div>
        <p className="text-[20px] font-semibold text-[#7de1ee]">
          {value}
        </p>

        <p className="text-[10px] text-white/55">
          {label}
        </p>
      </div>
    </div>
  );
}

function SupportAction({
  href,
  icon,
  label,
  value,
  className = "",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 3 }}
      className={`group/contact flex items-center justify-between rounded-[14px] border border-[#dfe9f1] bg-[#fbfdff] px-4 py-3.5 transition duration-300 hover:border-[#bdd9ea] hover:bg-white hover:shadow-[0_9px_24px_rgba(15,60,95,.06)] ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#1882cd]">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#9aabb8]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-[12px] font-semibold text-[#153b5c]">
            {value}
          </p>
        </div>
      </div>

      <span className="ml-2 shrink-0 text-[#91a4b3] transition-transform duration-300 group-hover/contact:translate-x-1">
        →
      </span>
    </motion.a>
  );
}

/* ============================================================
   ICONS
============================================================ */

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[15px] w-[15px]"
    >
      <path
        d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2L21 14v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M4 13v-1a8 8 0 0 1 16 0v1M4 13h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4ZM16 19c0 1.1-.9 2-2 2h-2"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0 4-5l-2.5 2.5-2-2L18 1"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.65"
      />

      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M21 11.5a8.4 8.4 0 0 1-9 8.5 10 10 0 0 1-4-.8L3 21l1.6-4.2A8 8 0 1 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeamIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M6 19c0-3 2.7-5 6-5s6 2 6 5M5 9a2.5 2.5 0 0 0 0 5M19 9a2.5 2.5 0 0 1 0 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M5 16V8l2-3h10l2 3v8M5 12h14M7 18h.01M17 18h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="m9 12 2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M12 8v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}