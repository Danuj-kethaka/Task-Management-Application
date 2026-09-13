"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    useRouter,
} from "next/navigation";

import api from "../../services/api";
import BoardColumn from "./BoardColumn";

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
    createdAt: string;
};

type Status = "todo" | "doing" | "done";

export default function Dashboard() {
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
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

            if (!token) {
                router.push("/");
                return;
            }

            const response = await api.get("/api/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTasks(response.data.tasks);
        } catch (error) {
            console.error(
                "Failed to load tasks:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDragEnd = async (
        event: DragEndEvent
    ) => {
        const {
            active,
            over,
        } = event;

        if (!over) {
            return;
        }

        const taskId = active.id.toString();
        const newStatus = over.id.toString() as Status;

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

        // Optimistically update the UI
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

            // Restore previous status if API fails
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
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading tasks...</p>
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

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Task Dashboard
                        </h1>

                        <p className="mt-1 text-gray-600">
                            Manage your tasks
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                router.push(
                                    "/dashboard/create"
                                )
                            }
                            className="rounded-lg bg-black px-4 py-2 text-white"
                        >
                            Create Task
                        </button>

                        <button
                            onClick={logout}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid gap-6 md:grid-cols-3">
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
            </div>
        </main>
    );
}