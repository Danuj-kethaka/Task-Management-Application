import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import api from "../../services/api";

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

    const router = useRouter();

    const [deleting, setDeleting] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setDeleting(true);

        const token = localStorage.getItem("token");

        await api.delete(
            `/api/tasks/${task._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

            window.location.reload();
        } catch (error: any) {
            console.error(
                "Failed to delete task:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        } finally {
            setDeleting(false);
        }
    };

    
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`mb-4 rounded-lg border bg-white p-4 shadow-sm ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <div
                {...listeners}
                className="cursor-grab"
            >
                <h3 className="font-semibold text-gray-900">
                    {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    {task.description}
                </p>

                <div className="mt-3 text-xs text-gray-500">
                    Created by: {task.creator.name}
                </div>

                <div className="text-xs text-gray-500">
                    Assigned to:{" "}
                    {task.assignedUser
                        ? task.assignedUser.name
                        : "Unassigned"}
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() =>
                        router.push(
                            `/dashboard/edit/${task._id}`
                        )
                    }
                    className="rounded-md border px-3 py-1 text-sm"
                >
                    Edit
                </button>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
    
}