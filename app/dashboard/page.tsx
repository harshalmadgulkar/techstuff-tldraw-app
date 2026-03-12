"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [name, setName] = useState("");
    const [projects, setProjects] = useState([]);

    async function fetchProjects() {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects);
    }

    async function createProject() {
        const res = await fetch("/api/projects", {
            method: "POST",
            body: JSON.stringify({
                name,
                description: "",
            }),
        });

        if (res.ok) {
            setName("");
            fetchProjects();
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Projects</h1>

            <div className="mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                    className="border p-2 mr-2"
                />

                <button
                    onClick={createProject}
                    className="bg-black text-white px-4 py-2"
                >
                    Create
                </button>
            </div>

            <ul>
                {projects.map((p: any) => (
                    <li key={p.id} className="border p-3 mb-2">
                        <Link href={`/project/${p.id}`}>
                            {p.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}