"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    async function handleLogin() {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            router.push("/dashboard");
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="space-y-4">
                <h1 className="text-xl font-bold">Login</h1>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="border p-2"
                />

                <button
                    onClick={handleLogin}
                    className="bg-black text-white px-4 py-2"
                >
                    Login
                </button>
            </div>
        </div>
    );
}