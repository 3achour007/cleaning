"use client";

import { useState, useEffect } from "react";

// Dummy data for worker tasks
const initialTasks = [
    { id: 1, task: "Apartment Cleaning", date: "2023-10-01", status: "Completed" },
    { id: 2, task: "Carpet Cleaning", date: "2023-10-05", status: "In Progress" },
    { id: 3, task: "Window Cleaning", date: "2023-10-10", status: "Pending" },
];

export default function WorkerDetails({ workerId }: { workerId: number }) {
    const [tasks, setTasks] = useState(initialTasks);

    // Fetch tasks for the worker (replace with your API call)
    useEffect(() => {
        // Simulate fetching tasks for the worker
        console.log("Fetching tasks for worker ID:", workerId);
        setTasks(initialTasks);
    }, [workerId]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Worker Tasks</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {task.task}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {task.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            task.status === "Completed"
                                                ? "bg-green-100 text-green-800"
                                                : task.status === "In Progress"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}