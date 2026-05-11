"use client";

import { useState, useEffect, useRef } from "react";
import { sendBroadcast, getUserCount } from "@/features/admin/actions";
import { toast } from "sonner";
import Image from "next/image";

export default function BroadcastPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [userCount, setUserCount] = useState<number | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getUserCount().then((res) => {
            if (!res.success) setUnauthorized(true);
            else setUserCount(res.count ?? null);
        });
    }, []);

    if (unauthorized) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <p className="text-neutral-500 text-lg">Not authorized.</p>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setImagePreview(result);
            // Strip the data URL prefix to get raw base64
            setImageBase64(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageBase64(null);
        setImageName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error("Fill in both fields.");
            return;
        }
        if (!confirm(`Send this to all ${userCount ?? "?"} users?`)) return;

        setLoading(true);
        try {
            const res = await sendBroadcast({
                subject,
                message,
                imageBase64: imageBase64 ?? undefined,
                imageName: imageName ?? undefined,
            });
            if (res.success) {
                toast.success(`Sent to ${res.count} users.`);
                setSubject("");
                setMessage("");
                removeImage();
            } else {
                toast.error(res.error ?? "Failed to send.");
            }
        } catch {
            toast.error("Unexpected error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 flex justify-center items-center">
            <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Broadcast Email</h1>
                    {userCount !== null && (
                        <span className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">
                            {userCount} users
                        </span>
                    )}
                </div>

                <form onSubmit={handleSend} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New game just dropped..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={8}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                            placeholder="Plain text — write exactly what users will receive..."
                        />
                        <p className="text-xs text-neutral-500 mt-1">Sent as plain text.</p>
                    </div>

                    {/* Image attachment */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Attach Image <span className="text-neutral-500 font-normal">(optional)</span>
                        </label>

                        {imagePreview ? (
                            <div className="relative inline-block">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={200}
                                    height={120}
                                    className="rounded-lg object-cover border border-neutral-700"
                                    style={{ maxHeight: 120, width: "auto" }}
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-rose-500"
                                >
                                    ✕
                                </button>
                                <p className="text-xs text-neutral-500 mt-1">{imageName}</p>
                            </div>
                        ) : (
                            <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-800 border border-dashed border-neutral-600 rounded-lg px-4 py-3 hover:border-neutral-500 transition-colors">
                                <span className="text-neutral-400 text-sm">Click to upload PNG, JPG, GIF…</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white"
                    >
                        {loading ? `Sending to ${userCount} users…` : "Send Broadcast"}
                    </button>
                </form>
            </div>
        </div>
    );
}
