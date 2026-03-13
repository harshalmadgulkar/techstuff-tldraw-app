"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@prisma/client";

type ProjectWithOwner = Project & {
    owner: {
        username: string;
    };
};

export default function Dashboard() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [projects, setProjects] = useState<ProjectWithOwner[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchProjects() {
        setLoading(true);
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data.projects);
        } finally {
            setLoading(false);
        }
    }

    async function createProject(event?: React.FormEvent) {
        event?.preventDefault();

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
            }),
        });

        if (res.ok) {
            setName("");
            setDescription("");
            fetchProjects();
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Projects
                    </h1>

                    <form
                        onSubmit={createProject}
                        className="flex w-full max-w-xl items-center gap-3 rounded-full px-4 py-2 shadow-sm ring-1 ring-gray-200"
                    >
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Project name"
                            className="w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)"
                            className="hidden flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:block"
                        />
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="rounded-full bg-white text-black px-4 py-1.5 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                            Create
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-sm">
                            Loading projects...
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm">
                            <p className="font-medium">No projects yet</p>
                            <p>Create your first project using the field above.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {projects.map((p) => (
                                <li
                                    key={p.id}
                                    className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-white hover:shadow-sm hover:text-black"
                                >
                                    <Link
                                        href={`/project/${p.id}`}
                                        className="flex justify-between w-full text-sm"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold group-hover:underline">
                                                {p.name}
                                            </span>
                                            {p.description && (
                                                <span className="mt-0.5 text-sm">
                                                    {p.description}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="mt-1 text-xs text-gray-400">
                                                Owner: {p.owner.username}
                                            </span>
                                            <span className="mt-1 text-xs text-gray-400">
                                                Created: {new Date(p.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}