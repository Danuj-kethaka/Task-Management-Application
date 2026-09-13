"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import api from "../../../services/api";

type User = {
    _id: string;
    name: string;
    email: string;
};

type Task = {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "doing" | "done";
    creator: User;
    assignedUser: User | null;
};

type TaskCardProps = {
    task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
    });

    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [error, setError] = useState("");

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            const token = localStorage.getItem("token");

            await api.delete(`/api/tasks/${task._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            window.location.reload();
        } catch (error: any) {
            console.error("Failed to delete task:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        } finally {
            setDeleting(false);
        }
    };

    const openEditModal = () => {
        setTitle(task.title);
        setDescription(task.description);
        setError("");
        setEditing(true);
    };

    const closeEditModal = () => {
        if (saving) return;
        setEditing(false);
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            await api.put(
                `/api/tasks/${task._id}`,
                {
                    title: title.trim(),
                    description: description.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditing(false);
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to update task:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update task"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
           
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={`mb-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all ${
                    isDragging
                        ? "scale-[1.02] opacity-60 shadow-lg"
                        : "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                }`}
            >
                <div
                    {...listeners}
                    className="cursor-grab"
                >
                    <h3 className="font-semibold text-slate-900">
                        {task.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                        {task.description}
                    </p>

                    <div className="mt-3 text-xs text-slate-500">
                        Created by: {task.creator.name}
                    </div>

                    <div className="text-xs text-slate-500">
                        Assigned to:{" "}
                        {task.assignedUser
                            ? task.assignedUser.name
                            : "Unassigned"}
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                        onClick={openEditModal}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Edit
                    </button>

                    <button
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>

         
            {editing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-[2px]"
                    onClick={closeEditModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Edit Task
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Update task details
                                </p>
                            </div>

                            <button
                                onClick={closeEditModal}
                                disabled={saving}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                required
                            />
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={saving}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}