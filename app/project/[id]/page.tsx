"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Whiteboard } from "@prisma/client";

export default function ProjectPage({ params }: { params: Promise<{ id: string; }>; }) {
  const { id: projectId } = use(params);

  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [name, setName] = useState("");

  async function createWhiteboard() {
    if (!name.trim()) return;
    const res = await fetch("/api/whiteboards", {
      method: "POST",
      body: JSON.stringify({
        name,
        projectId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setName("");
    }
  }

  async function deleteWhiteboard(id: string) {
    await fetch(`/api/whiteboards/${id}`, {
      method: "DELETE",
    });
  }

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/whiteboards?projectId=${projectId}`);
      const data = await res.json();

      setWhiteboards(data.whiteboards);
    };

    load();
  }, [projectId]);

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Project Workspace
      </h1>

      {/* Create Whiteboard */}
      <div className="mb-6">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Whiteboard name"
          className="border p-2 mr-2"
        />

        <button
          onClick={createWhiteboard}
          className="bg-black text-white px-4 py-2"
        >
          Create
        </button>

      </div>

      {/* Whiteboard List */}

      {whiteboards.length === 0 ?
        (
          <p>No whiteboards yet</p>
        ) : (
          <ul>
            {whiteboards.map((board) => (

              <li
                key={board.id}
                className="border p-3 mb-2 flex justify-between"
              >

                <Link href={`/whiteboard/${board.id}`}>
                  {board.name}
                </Link>

                <button
                  onClick={() => deleteWhiteboard(board.id)}
                  className="text-red-500"
                >
                  Delete
                </button>

              </li>

            ))}

          </ul>)
      }
    </div>
  );
};