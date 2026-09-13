"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";

export default function CreateTaskPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            await api.post(
                "/api/tasks",
                {
                    title,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to create task"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="rounded-xl bg-white p-8 shadow">
                    <h1 className="mb-2 text-3xl font-bold">
                        Create Task
                    </h1>

                    <p className="mb-6 text-gray-600">
                        Add a new task to your board.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="mb-2 block font-medium">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Enter task title"
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Enter task description"
                                rows={6}
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard")
                                }
                                className="rounded-lg border px-5 py-3"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}