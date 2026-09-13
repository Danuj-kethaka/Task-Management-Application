"use client";

import { useEffect, useState } from "react";
import {DndContext,DragEndEvent,PointerSensor,useSensor,useSensors,} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import BoardColumn from "./column/page";

type User = { _id: string; name: string; email: string; role?: "user" | "admin";};
type Task = { _id: string; title: string; description: string; status: "todo" | "doing" | "done"; creator: User; assignedUser: User | null; createdAt: string;};
type Status = "todo" | "doing" | "done";

export default function Dashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (!token) {
                router.push("/");
                return;
            }

            if (userData) {
                setCurrentUser(JSON.parse(userData));
            }

            const response = await api.get("/api/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTasks(response.data.tasks);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        const taskId = active.id.toString();
        const newStatus = over.id.toString() as Status;

        if (!["todo", "doing", "done"].includes(newStatus)) {
            return;
        }

        const task = tasks.find(
            (item) => item._id === taskId
        );

        if (!task) {
            return;
        }

        if (task.status === newStatus) {
            return;
        }

        const oldStatus = task.status;

        // Update UI immediately
        setTasks((currentTasks) =>
            currentTasks.map((item) =>
                item._id === taskId
                    ? {
                          ...item,
                          status: newStatus,
                      }
                    : item
            )
        );

        try {
            const token = localStorage.getItem("token");

            await api.patch(
                `/api/tasks/${taskId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error(
                "Failed to update task status:",
                error
            );

            // Roll back if API request fails
            setTasks((currentTasks) =>
                currentTasks.map((item) =>
                    item._id === taskId
                        ? {
                              ...item,
                              status: oldStatus,
                          }
                        : item
                )
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                        Loading workspace...
                    </div>
                </div>
            </main>
        );
    }

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );

    const doingTasks = tasks.filter(
        (task) => task.status === "doing"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    const firstName =
        currentUser?.name?.split(" ")[0] || "there";

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">

            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                            LT
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-slate-950">
                                Less Taxi
                            </p>

                            <p className="text-[11px] text-slate-400">
                                Task Workspace
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/dashboard/create"
                                )
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
                        >
                            <span className="text-base leading-none">
                                +
                            </span>

                            <span className="hidden sm:inline">
                                Create Task
                            </span>
                        </button>

                        <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
                            <div className="text-right">
                                <p className="text-xs font-semibold text-slate-700">
                                    {currentUser?.name ||
                                        "User"}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                    {currentUser?.email || ""}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                                {(currentUser?.name?.charAt(0) ||
                                    "U")
                                    .toUpperCase()}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:px-4"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                <section className="mb-6">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

                        <div>
                            <p className="mb-1 text-sm font-medium text-slate-400">
                                My Workspace
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                Welcome back, {firstName}
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Keep your work organised and
                                move tasks forward.
                            </p>
                        </div>

                        <div className="text-left text-xs text-slate-400 lg:text-right">
                            <p>
                                {tasks.length}{" "}
                                {tasks.length === 1
                                    ? "task"
                                    : "tasks"}{" "}
                                in your workspace
                            </p>

                            <p className="mt-1">
                                Drag cards to update their status
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">

                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    To Do
                                </p>

                                <p className="mt-1 text-2xl font-bold text-indigo-950 sm:text-3xl">
                                    {todoTasks.length}
                                </p>
                            </div>

                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        </div>

                        <p className="mt-2 hidden text-xs text-indigo-500 sm:block">
                            Tasks waiting to start
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-amber-700">
                                    In Progress
                                </p>

                                <p className="mt-1 text-2xl font-bold text-amber-950 sm:text-3xl">
                                    {doingTasks.length}
                                </p>
                            </div>

                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>

                        <p className="mt-2 hidden text-xs text-amber-600 sm:block">
                            Tasks currently being worked on
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-emerald-700">
                                    Completed
                                </p>

                                <p className="mt-1 text-2xl font-bold text-emerald-950 sm:text-3xl">
                                    {doneTasks.length}
                                </p>
                            </div>

                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>

                        <p className="mt-2 hidden text-xs text-emerald-600 sm:block">
                            Tasks successfully completed
                        </p>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-700">
                            Task Board
                        </h2>

                        <span className="text-xs text-slate-400">
                            Drag & drop enabled
                        </span>
                    </div>

                    <DndContext
                        sensors={sensors}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                            <BoardColumn
                                id="todo"
                                title="To Do"
                                tasks={todoTasks}
                            />

                            <BoardColumn
                                id="doing"
                                title="Doing"
                                tasks={doingTasks}
                            />

                            <BoardColumn
                                id="done"
                                title="Done"
                                tasks={doneTasks}
                            />
                        </div>
                    </DndContext>
                </section>
            </div>
        </main>
    );
}