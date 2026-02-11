"use client";

import { useState, ChangeEvent } from "react";
import NavBar from "@/components/NavBar";
import { Label } from "@/components/ui/label";
import { LuUserRound } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { IoLocationOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CompleteProfile = () => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [copied, setCopied] = useState(false);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setAvatarPreview((old) => {
            if (old) URL.revokeObjectURL(old);
            return url;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Saving account...", { username /*, location, avatar*/ });
    };

    const donationBaseUrl = "https://detip.app/donate";
    const cleanUsername = username.trim();
    const donationUrl =
        cleanUsername.length > 0
            ? `${donationBaseUrl}/${encodeURIComponent(cleanUsername)}`
            : "";

    const handleCopy = async () => {
        if (!donationUrl) return;
        await navigator.clipboard.writeText(donationUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };

    return (
        <>
            <NavBar />

            <main className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <section className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">
                            Complete Profile
                        </h1>
                        <p className="text-sm text-slate-500">
                            Fill in your basic account information.
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-6"
                    >
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Personal Information
                            </h2>
                            <p className="text-xs text-slate-500">
                                This information will appear on your public profile.
                            </p>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                                <Avatar className="h-20 w-20 ring-2 ring-emerald-100 ring-offset-2 ring-offset-white">
                                    <AvatarImage
                                        src={avatarPreview ?? "https://github.com/shadcn.png"}
                                        className="h-full w-full object-cover"
                                    />
                                    <AvatarFallback>
                                        {cleanUsername ? cleanUsername[0]?.toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="avatar"
                                        className="inline-flex cursor-pointer items-center rounded-md border border-emerald-500/70 bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                                    >
                                        Change avatar
                                    </label>
                                    <p className="text-[11px] text-slate-400">
                                        PNG or JPG, up to 2MB.
                                    </p>
                                </div>

                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuUserRound size={15} className="text-emerald-500" />
                                    <Label htmlFor="username">Username</Label>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                />

                                {donationUrl && (
                                    <div className="mt-1 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                        <p className="min-w-0 text-xs text-slate-600">
                                            Your donation link:{" "}
                                            <span className="font-mono text-emerald-700 break-all">
                                                {donationUrl}
                                            </span>
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="shrink-0 inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50"
                                        >
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <IoLocationOutline size={15} className="text-emerald-500" />
                                <Label htmlFor="location">Location</Label>
                            </div>
                            <input
                                type="text"
                                id="location"
                                placeholder="Jakarta, Bandung, etc."
                                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                            >
                                Save account
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default CompleteProfile;
