"use client"

import { useState } from "react"

export default function ProjectPage({ params }: any) {
  const [username, setUsername] = useState("")

  async function shareProject() {
    await fetch(`/api/projects/${params.id}/share`, {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setUsername("")
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Project</h1>

      <div className="mb-6">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to share"
          className="border p-2 mr-2"
        />

        <button
          onClick={shareProject}
          className="bg-black text-white px-4 py-2"
        >
          Share
        </button>
      </div>
    </div>
  )
}