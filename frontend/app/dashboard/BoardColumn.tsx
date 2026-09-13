"use client";

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

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

type BoardColumnProps = {
    id: Task["status"];
    title: string;
    tasks: Task[];
};

export default function BoardColumn({
    id,
    title,
    tasks,
}: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <section
            ref={setNodeRef}
            className={`min-h-[400px] rounded-xl p-4 transition ${
                isOver ? "bg-blue-100" : "bg-gray-200"
            }`}
        >
            <h2 className="mb-4 text-xl font-bold">
                {title}
            </h2>

            {tasks.map((task) => (
                <TaskCard
                    key={task._id}
                    task={task}
                />
            ))}
        </section>
    );
}