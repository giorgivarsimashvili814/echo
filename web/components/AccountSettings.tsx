"use client";

import { useState } from "react";
import Image from "next/image";
import defaultAvatar from "@/public/default-avatar-3.svg";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  username: string;
  email: string;
  avatar: { url: string } | null;
}

export default function AccountSettings({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-8">
      <AvatarSection avatar={user.avatar} />
      <UsernameSection currentUsername={user.username} />
      <EmailSection currentEmail={user.email} />
      <PasswordSection />
    </div>
  );
}

function AvatarSection({ avatar }: { avatar: { url: string } | null }) {
  const [preview, setPreview] = useState<string | null>(avatar?.url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/users/me/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to upload avatar");
      }

      const data = await res.json();
      setPreview(data.url);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/me/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to remove avatar");
      }

      setPreview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-gray-700">Profile photo</h2>
      <div className="flex items-center gap-4">
        <Image
          src={preview ?? defaultAvatar}
          alt="Avatar"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover ring-1 ring-black/5"
        />
        <div className="flex gap-2">
          <label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
            {loading ? "Uploading..." : "Change"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
          {preview && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}

function UsernameSection({ currentUsername }: { currentUsername: string }) {
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/me/username`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to update username");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-gray-700">Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
        minLength={3}
        maxLength={50}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Username updated</p>}
      <button
        type="submit"
        disabled={loading || username === currentUsername}
        className="self-start rounded-md bg-black px-4 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/me/email`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to update email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-gray-700">Email</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Email updated</p>}
      <button
        type="submit"
        disabled={loading || email === currentEmail}
        className="self-start rounded-md bg-black px-4 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/me/password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to update password");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-gray-700">Password</h2>
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
        required
      />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
        minLength={8}
        maxLength={72}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Password updated</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-black px-4 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
