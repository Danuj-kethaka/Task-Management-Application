"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function Home() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [displayText, setDisplayText] = useState("");

    const quote =
        "Welcome back. Let's get your work moving.";

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (index < quote.length) {
                setDisplayText(quote.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 55);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to connect to the server"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
        <div className="grid min-h-screen md:grid-cols-2">

            <section className="order-2 flex min-h-0 items-start justify-center bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-16 md:order-1 md:min-h-screen md:items-center md:py-10">
                <div className="w-full max-w-md">

                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
                            LT
                        </div>

                        <div>
                            <p className="text-lg font-bold tracking-tight text-slate-950">
                                Less Taxi
                            </p>

                            <p className="text-xs text-slate-500">
                                Task Management System
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="mb-2 text-sm font-medium text-slate-500">
                            Welcome back
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Sign in to your account
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Enter your email below to access
                            your task workspace.
                        </p>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        autoComplete="on"
                        className="flex flex-col gap-5"
                    >
           
                        <div className="grid gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-slate-700"
                            >
                                Email
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
                                placeholder="m@example.com"
                                autoComplete="email"
                                required
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                      
                        <div className="grid gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

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
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
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
                                                d="M9.88 4.24A9.86 9.86 0 0112 4c5 0 8.27 4.11 9.33 6a17.7 17.7 0 01-3.17 3.94"
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
                            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>
                    </form>

                 
                    <div className="my-7 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-xs font-medium text-slate-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                  
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/register")
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        Create an account
                    </button>

                    <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                        Task management made simple.
                    </p>
                </div>
            </section>

            <section
                className="relative order-1 h-[40vh] min-h-[280px] overflow-hidden bg-cover bg-center sm:h-[45vh] md:order-2 md:h-screen"
                style={{
                    backgroundImage:
                        "url('https://cdn.prod.website-files.com/62a85c75feb9bdf4905f9f24/66f5687053d7cc64b402593d_65fdbd5f3a0ed0a4c6b485f7_pexels-olia-danilevich-8145335.jpeg')",
                }}
            >
               
                <div className="absolute inset-0 bg-slate-950/35" />

               
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-md sm:left-8 sm:top-8">
                    Less Taxi Workspace
                </div>

             
                <div className="absolute bottom-7 left-5 right-5 sm:bottom-10 sm:left-8 sm:right-8">
                    <div className="max-w-xl text-white">
                        <p className="text-xl font-medium leading-relaxed sm:text-2xl lg:text-3xl">
                            “{displayText}
                            <span className="ml-1 animate-pulse">
                                |
                            </span>
                            ”
                        </p>

                        <div className="mt-4 h-px w-14 bg-white/50" />

                        <p className="mt-3 text-xs text-white/70 sm:text-sm">
                            Plan • Assign • Track • Complete
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>
);
}