"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Whiteboard } from "@prisma/client";
import { toast } from "sonner";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id: projectId } = use(params);

  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [name, setName] = useState("");
  const [shareUser, setShareUser] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWhiteboards() {
    setLoading(true);

    try {
      const res = await fetch(`/api/whiteboards?projectId=${projectId}`);
      const data = await res.json();
      setWhiteboards(data.whiteboards ?? []);
    } catch {
      toast.error("Failed to load whiteboards");
    } finally {
      setLoading(false);
    }
  }

  async function createWhiteboard() {
    if (!name.trim()) return;

    const res = await fetch("/api/whiteboards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, projectId }),
    });

    if (res.ok) {
      toast.success("Whiteboard created");
      setName("");
      fetchWhiteboards();
    } else {
      toast.error("Failed to create whiteboard");
    }
  }

  async function shareProject() {
    if (!shareUser.trim()) return;

    const res = await fetch(`/api/projects/${projectId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: shareUser,
      }),
    });

    if (res.ok) {
      toast.success("Project shared");
      setShareUser("");
    } else {
      const error = await res.json().catch(() => null);
      toast.error(error?.error ?? "Failed to share project");
    }
  }

  async function deleteWhiteboard(id: string) {
    const res = await fetch(`/api/whiteboards/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Whiteboard deleted");
      fetchWhiteboards();
    } else {
      toast.error("Failed to delete whiteboard");
    }
  }

  useEffect(() => {
    fetchWhiteboards();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Page Header */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Project Workspace
        </h1>

        {/* Create Whiteboard */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Whiteboard name"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={createWhiteboard}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create
            </button>
          </div>
        </div>

        {/* Share Project */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Share Project
          </h2>

          <div className="flex items-center gap-3">
            <input
              value={shareUser}
              onChange={(e) => setShareUser(e.target.value)}
              placeholder="Username"
              className="flex-1 rounded-lg text-black border border-gray-200 px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={shareProject}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
            >
              Share
            </button>
          </div>
        </div>

        {/* Whiteboards List */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading whiteboards...
            </div>
          ) : whiteboards.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No whiteboards yet
            </div>
          ) : (
            <ul className="space-y-3">
              {whiteboards.map((board) => (
                <li
                  key={board.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-white hover:shadow-sm"
                >
                  <Link
                    href={`/whiteboard/${board.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {board.name}
                  </Link>

                  <button
                    onClick={() => deleteWhiteboard(board.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </div>
  );
}