"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

type User = {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
};

type Task = {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "doing" | "done";
    creator: User;
    assignedUser: User | null;
    createdAt: string;
};

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
                    Authorization: `Bearer ${token}`
                };

                const [usersResponse, tasksResponse] =
                    await Promise.all([
                        api.get("/api/admin/users", { headers }),
                        api.get("/api/admin/tasks", { headers })
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

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading admin dashboard...</p>
            </main>
        );
    }

    const assignTask = async (
        taskId: string,
        userId: string
    ) => {
        try {
            const token = localStorage.getItem("token");

            await api.patch(
                `/api/tasks/${taskId}/assign`,
                {
                    userId: userId || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const response = await api.get(
                "/api/admin/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="mt-1 text-gray-600">
                            Administrator control panel
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                    >
                        Task Board
                    </button>

                    <button
                        onClick={logout}
                        className="rounded-lg bg-black px-4 py-2 text-white"
                    >
                        Logout
                    </button>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">
                            Total Users
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {users.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">
                            Total Tasks
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {tasks.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">
                            Completed Tasks
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {
                                tasks.filter(
                                    (task) =>
                                        task.status === "done"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <section className="mb-8 rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold">
                        Users
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b"
                                    >
                                        <td className="p-3">
                                            {user.name}
                                        </td>

                                        <td className="p-3">
                                            {user.email}
                                        </td>

                                        <td className="p-3 capitalize">
                                            {user.role}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-bold">
                        Tasks
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3">
                                        Task
                                    </th>

                                    <th className="p-3">
                                        Created By
                                    </th>

                                    <th className="p-3">
                                        Assigned To
                                    </th>

                                    <th className="p-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task._id}
                                        className="border-b"
                                    >
                                        <td className="p-3">
                                            {task.title}
                                        </td>

                                        <td className="p-3">
                                            {task.creator.name}
                                        </td>

                                        <td className="p-3">
                                            <select
                                                value={task.assignedUser?._id || ""}
                                                onChange={(event) =>
                                                    assignTask(
                                                        task._id,
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2"
                                            >
                                                <option value="">
                                                    Unassigned
                                                </option>

                                                {users
                                                    .filter((user) => user.role === "user")
                                                    .map((user) => (
                                                        <option
                                                            key={user._id}
                                                            value={user._id}
                                                        >
                                                            {user.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>

                                        <td className="p-3 capitalize">
                                            {task.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}