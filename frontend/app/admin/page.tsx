"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

type User = { _id: string; name: string; email: string; role: "user" | "admin";};
type Task = {_id: string; title: string; description: string; status: "todo" | "doing" | "done"; creator: User; assignedUser: User | null; createdAt: string;};

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userData = localStorage.getItem("user");

                if (!token || !userData) {
                    router.push("/");
                    return;
                }

                const user = JSON.parse(userData);

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [usersResponse, tasksResponse] =
                    await Promise.all([
                        api.get("/api/admin/users", { headers }),
                        api.get("/api/admin/tasks", { headers }),
                    ]);

                setUsers(usersResponse.data.users);
                setTasks(tasksResponse.data.tasks);
            } catch (error) {
                console.error(
                    "Failed to load admin data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, [router]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const assignTask = async (
        taskId: string,
        userId: string
    ) => {
        try {
            const token = localStorage.getItem("token");

            await api.patch(
                `/api/tasks/${taskId}/assign`,
                {
                    userId: userId || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = await api.get(
                "/api/admin/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTasks(response.data.tasks);
        } catch (error) {
            console.error(
                "Failed to assign task:",
                error
            );
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                    Loading admin dashboard...
                </div>
            </main>
        );
    }

    const completedTasks = tasks.filter(
        (task) => task.status === "done"
    ).length;

    const doingTasks = tasks.filter(
        (task) => task.status === "doing"
    ).length;

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    ).length;

    const progress =
        tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

    const initials = (name: string) =>
        name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <header className="border-b border-slate-200 bg-white">
                <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                   
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                            LT
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Less Taxi
                            </p>

                            <p className="text-xs text-slate-500">
                                Admin Workspace
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                router.push("/dashboard")
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            Task Board
                        </button>

                        <button
                            onClick={logout}
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="w-full px-4 py-7 sm:px-6 lg:px-8">

                <div className="mb-6">
                    <div className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        Administration
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage users, tasks and assignments.
                    </p>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-indigo-700">
                                    Total Users
                                </p>

                                <p className="mt-1 text-3xl font-bold text-indigo-950">
                                    {users.length}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                                👥
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">
                                    Total Tasks
                                </p>

                                <p className="mt-1 text-3xl font-bold text-amber-950">
                                    {tasks.length}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                                ✓
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">
                                    Completed
                                </p>

                                <p className="mt-1 text-3xl font-bold text-emerald-950">
                                    {completedTasks}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                                ✓
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Task Progress
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Current task distribution
                            </p>
                        </div>

                        <span className="text-sm font-bold text-indigo-600">
                            {progress}%
                        </span>
                    </div>

                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="rounded-lg bg-indigo-50 px-3 py-2">
                            <p className="font-medium text-indigo-700">
                                To Do
                            </p>
                            <p className="mt-1 font-bold text-indigo-900">
                                {todoTasks}
                            </p>
                        </div>

                        <div className="rounded-lg bg-amber-50 px-3 py-2">
                            <p className="font-medium text-amber-700">
                                In Progress
                            </p>
                            <p className="mt-1 font-bold text-amber-900">
                                {doingTasks}
                            </p>
                        </div>

                        <div className="rounded-lg bg-emerald-50 px-3 py-2">
                            <p className="font-medium text-emerald-700">
                                Completed
                            </p>
                            <p className="mt-1 font-bold text-emerald-900">
                                {completedTasks}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Users
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Registered users
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {users.length} users
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-3 font-semibold">
                                        User
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Role
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                                    {initials(
                                                        user.name
                                                    )}
                                                </div>

                                                <span className="text-sm font-medium text-slate-900">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3 text-sm text-slate-500">
                                            {user.email}
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    user.role ===
                                                    "admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Tasks
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Manage task assignments and status
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {tasks.length} tasks
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-3 font-semibold">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Created By
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Assigned To
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {tasks.map((task) => (
                                    <tr
                                        key={task._id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        {/* Task */}
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="max-w-[250px] truncate text-sm font-semibold text-slate-900">
                                                    {task.title}
                                                </p>

                                                <p className="mt-1 max-w-[280px] truncate text-xs text-slate-500">
                                                    {task.description}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                    {initials(
                                                        task.creator
                                                            .name
                                                    )}
                                                </div>

                                                <span className="text-sm text-slate-700">
                                                    {
                                                        task
                                                            .creator
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <select
                                                value={
                                                    task
                                                        .assignedUser
                                                        ?._id || ""
                                                }
                                                onChange={(event) =>
                                                    assignTask(
                                                        task._id,
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            >
                                                <option value="">
                                                    Unassigned
                                                </option>

                                                {users
                                                    .filter(
                                                        (user) =>
                                                            user.role ===
                                                            "user"
                                                    )
                                                    .map((user) => (
                                                        <option
                                                            key={
                                                                user._id
                                                            }
                                                            value={
                                                                user._id
                                                            }
                                                        >
                                                            {user.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    task.status ===
                                                    "todo"
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : task.status ===
                                                          "doing"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        task.status ===
                                                        "todo"
                                                            ? "bg-indigo-500"
                                                            : task.status ===
                                                              "doing"
                                                            ? "bg-amber-500"
                                                            : "bg-emerald-500"
                                                    }`}
                                                />

                                                {task.status ===
                                                "todo"
                                                    ? "To Do"
                                                    : task.status ===
                                                      "doing"
                                                    ? "In Progress"
                                                    : "Completed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {tasks.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-slate-400">
                            No tasks available.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}