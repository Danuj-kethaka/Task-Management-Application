"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/api/auth/register", {
                name,
                email,
                password,
            });

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
        <main className="min-h-screen bg-slate-950 px-6 py-12">
            <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
                    {/* Left section */}
                    <div className="hidden bg-slate-900 p-12 text-white md:flex md:flex-col md:justify-between">
                        <div>
                            <div className="mb-10 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900">
                                    LT
                                </div>

                                <span className="text-xl font-bold">
                                    Less Taxi
                                </span>
                            </div>

                            <h1 className="max-w-md text-4xl font-bold leading-tight">
                                Start managing
                                <br />
                                your work better.
                            </h1>

                            <p className="mt-6 max-w-md text-slate-300">
                                Create your account and
                                start organising tasks
                                across To Do, Doing and
                                Done.
                            </p>
                        </div>

                        <div className="text-sm text-slate-400">
                            Task Management System
                        </div>
                    </div>

                    {/* Register form */}
                    <div className="p-8 sm:p-12">
                        <div className="mx-auto max-w-md">
                            <div className="mb-8 md:hidden">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                                        LT
                                    </div>

                                    <span className="text-xl font-bold">
                                        Less Taxi
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm font-medium text-slate-500">
                                    Get started
                                </p>

                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    Create your account
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Register as a normal
                                    user to start managing
                                    tasks.
                                </p>
                            </div>

                            <form
                                onSubmit={handleRegister}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Full name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create account"}
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/")
                                }
                                className="mt-6 w-full text-sm text-slate-500 transition hover:text-slate-900"
                            >
                                Already have an account?{" "}
                                <span className="font-medium">
                                    Sign in
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}