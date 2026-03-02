"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <>
          <p>User ID: {user.userId}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
}