"use client";

import { use, useEffect, useState } from "react";
import { Editor, Tldraw, TLStoreSnapshot } from "tldraw";
import "tldraw/tldraw.css";

export default function WhiteboardPage({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = use(params);
  const [snapshot, setSnapshot] = useState<TLStoreSnapshot | undefined>(undefined);

  async function saveWhiteboard(editor: Editor) {
    const snapshot = editor.store.getStoreSnapshot();

    await fetch(`/api/whiteboards/${id}`, {
      method: "PUT",
      body: JSON.stringify({ data: snapshot }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/whiteboards/${id}`);
      if (!res.ok) return;

      const text = await res.text();
      if (!text) return;

      const data = JSON.parse(text);
      setSnapshot(data.whiteboard?.canvasState ?? undefined);
    }

    load();
  }, [id]);

  return (
    <div className="h-screen">
      <Tldraw
        snapshot={snapshot}
        onMount={(editor) => {
          let timeout: NodeJS.Timeout;

          editor.store.listen(() => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
              saveWhiteboard(editor);
            }, 1000);
          });
        }}
      />
    </div>
  );
}