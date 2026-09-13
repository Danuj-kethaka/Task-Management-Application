"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../services/api";

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

                if (!token) {router.push("/");
                   return;
                }

                const response = await api.get(`/api/tasks/${taskId}`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );

                const task = response.data.task;

                setTitle(task.title);
                setDescription(task.description);
            } catch (error: any) {
                setError(error.response?.data?.message || "Failed to load task");
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [taskId, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {router.push("/");
                return;
            }

            await api.put(`/api/tasks/${taskId}`,
                {title,description},
                {
                    headers: {Authorization: `Bearer ${token}`},
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
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                Loading task...
            </div>
        </main>
    );
}

return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">

            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Edit Task
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Update your task details
                    </p>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    ← Back
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label
                            htmlFor="title"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Task Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="Enter task title"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Enter task description"
                            rows={5}
                            className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">

                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </main>
);
}