"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [displayText, setDisplayText] = useState("");

    const quote =
        "Build your workspace. Turn ideas into progress.";

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < quote.length) {
                setDisplayText(
                    quote.slice(0, index + 1)
                );

                index++;
            } else {
                clearInterval(interval);
            }
        }, 55);

        return () => clearInterval(interval);
    }, []);

    const handleRegister = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post(
                "/api/auth/register",
                {
                    name,
                    email,
                    password,
                }
            );

            router.push("/");
        } catch (error: any) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to create your account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950">
            <div className="grid min-h-screen md:grid-cols-2">

                <section
                    className="relative order-1 h-[38vh] min-h-[260px] overflow-hidden bg-cover bg-center sm:h-[42vh] md:order-1 md:h-screen"
                    style={{
                        backgroundImage:
                            "url('https://images.stockcake.com/public/3/e/5/3e5df37e-2e3d-4603-a575-8e0924254c5e_large.jpg')",
                    }}
                >
                 
                    <div className="absolute inset-0 bg-slate-950/40" />

                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold text-white backdrop-blur-md">
                                LT
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Less Taxi
                                </p>

                                <p className="text-xs text-white/60">
                                    Task Management
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs font-medium text-white backdrop-blur-md sm:right-8 sm:top-8">
                        New workspace
                    </div>

                    <div className="absolute bottom-7 left-5 right-5 sm:bottom-10 sm:left-8 sm:right-8">
                        <div className="max-w-xl text-white">
                            <p className="text-xl font-semibold leading-relaxed sm:text-2xl lg:text-3xl">
                                “{displayText}
                                <span className="ml-1 animate-pulse">
                                    |
                                </span>
                                ”
                            </p>

                            <div className="mt-4 h-px w-14 bg-white/50" />

                            <p className="mt-3 text-xs text-white/70 sm:text-sm">
                                Create • Organise • Collaborate • Deliver
                            </p>
                        </div>
                    </div>
                </section>

                <section className="order-2 flex min-h-0 items-start justify-center bg-white px-6 py-10 sm:px-10 sm:py-12 md:order-2 md:min-h-screen md:items-center md:px-12 lg:px-20">
                    <div className="w-full max-w-md">

                        <div className="mb-8 flex items-center gap-3 md:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                                LT
                            </div>

                            <div>
                                <p className="text-base font-bold text-slate-950">
                                    Less Taxi
                                </p>

                                <p className="text-xs text-slate-500">
                                    Task Management System
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="mb-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                Get started
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Create your account
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Set up your account and start
                                managing your work in one place.
                            </p>
                        </div>

                        <form
                            onSubmit={handleRegister}
                            autoComplete="on"
                            className="flex flex-col gap-5"
                        >
                            {/* Full name */}
                            <div className="grid gap-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-950 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-950 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <span className="text-xs text-slate-400">
                                        Keep it secure
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-950 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3l18 18"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M10.58 10.58a2 2 0 002.84 2.84"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.88 4.24A9.86 9.86 0 0112 4c5 0 8.27 4.11 9.33 6a17.7 17.7 0 013.17 3.94"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.61 6.61C4.66 7.97 3.25 9.72 2.67 10.75c1.06 1.89 4.33 6 9.33 6 1.09 0 2.1-.2 3.03-.54"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.67 10.75C3.73 8.86 7 4.75 12 4.75s8.27 4.11 9.33 6c-1.06 1.89-4.33 6-9.33 6s-8.27-4.11-9.33-6z"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="10.75"
                                                    r="2.5"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}
                            </button>
                        </form>

                        <div className="mt-7 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/")
                                }
                                className="mt-1 text-sm font-semibold text-slate-950 underline-offset-4 transition hover:underline"
                            >
                                Sign in instead
                            </button>
                        </div>

                        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                            Your account gives you access to the
                            Less Taxi task workspace.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}