"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../services/api";

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();

    const taskId = params.id as string;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTask = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    router.push("/");
                    return;
                }

                const response = await api.get(
                    `/api/tasks/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const task = response.data.task;

                setTitle(task.title);
                setDescription(task.description);
            } catch (error: any) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load task"
                );
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [taskId, router]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            await api.put(
                `/api/tasks/${taskId}`,
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
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                "Failed to update task"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading task...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-2xl">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mb-6 text-sm text-gray-600"
                >
                    ← Back to Dashboard
                </button>

                <div className="rounded-xl bg-white p-8 shadow">
                    <h1 className="mb-6 text-3xl font-bold">
                        Edit Task
                    </h1>

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
                                    setDescription(
                                        event.target.value
                                    )
                                }
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
                                disabled={saving}
                                className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}