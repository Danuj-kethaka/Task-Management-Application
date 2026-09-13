"use client";

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../task/page";

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

const columnStyles = {
    todo: {
        container: "bg-indigo-50/70 border-indigo-100",
        header: "text-indigo-950",
        count: "bg-indigo-100 text-indigo-700",
        dot: "bg-indigo-500",
        over: "bg-indigo-100 border-indigo-300",
        empty: "text-indigo-400",
    },

    doing: {
        container: "bg-amber-50/70 border-amber-100",
        header: "text-amber-950",
        count: "bg-amber-100 text-amber-700",
        dot: "bg-amber-500",
        over: "bg-amber-100 border-amber-300",
        empty: "text-amber-500",
    },

    done: {
        container: "bg-emerald-50/70 border-emerald-100",
        header: "text-emerald-950",
        count: "bg-emerald-100 text-emerald-700",
        dot: "bg-emerald-500",
        over: "bg-emerald-100 border-emerald-300",
        empty: "text-emerald-500",
    },
};

export default function BoardColumn({
    id,
    title,
    tasks,
}: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const styles = columnStyles[id];

    return (
        <section
            ref={setNodeRef}
            className={`min-h-[420px] rounded-2xl border p-4 transition-all duration-200 ${
                isOver
                    ? `${styles.over} shadow-md`
                    : styles.container
            }`}
        >
        
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
                    />

                    <h2
                        className={`text-sm font-bold tracking-tight ${styles.header}`}
                    >
                        {title}
                    </h2>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.count}`}
                >
                    {tasks.length}
                </span>
            </div>

            <div className="space-y-1">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                        />
                    ))
                ) : (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/40 p-6 text-center">
                        <div>
                            <div
                                className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm ${styles.empty}`}
                            >
                                +
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                No tasks here
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Drag a task into this column
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}