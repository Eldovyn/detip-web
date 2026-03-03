"use client";

import { useState, ChangeEvent, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Label } from "@/components/ui/label";
import { LuUserRound } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/api/authService";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { profileService } from "@/api/profileService";

const CompleteProfile = () => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const token = Cookies.get("accessToken");
    const { logout, account } = useAuth();
    const { data: userProfile, isError } = useQuery({
        queryKey: ["userMe"],
        queryFn: () => authService.userMe(token as string),
        enabled: !!token,
    });

    useEffect(() => {
        if (isError) {
            logout();
        }
    }, [isError, logout]);

    useEffect(() => {
        if (userProfile?.data.data) {
            const profile = userProfile.data.data;

            // Check if backend address matches connected wallet
            if (account?.address && profile.address && account.address.toLowerCase() !== profile.address.toLowerCase()) {
                logout();
                return;
            }

        }
    }, [userProfile?.data.data, account?.address, logout]);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setAvatarPreview((old) => {
            if (old) URL.revokeObjectURL(old);
            return url;
        });
    };

    const { mutate } = useMutation({
        mutationFn: async (data: DataProfile) => {
            const response = await profileService.updateProfile(data, token as string);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
        },

        onError: (error) => {
            // 
        },
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: userProfile?.data.data?.username || "",
            email: userProfile?.data.data?.email || "",
            location: userProfile?.data.data?.location || "",
        },
        onSubmit: (values, { setSubmitting }) => {
            try {
                const { username, email, location } = values;
                const data: DataProfile = {
                    username,
                    email,
                    location,
                };
                mutate(data);
            } catch (error) {
                console.error("Terjadi kesalahan:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const donationBaseUrl = "https://detip.app/donate";
    const cleanUsername = formik.values.username.trim();
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
                        onSubmit={formik.handleSubmit ? formik.handleSubmit : () => { }}
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
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
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
                                <IoMailOutline size={15} className="text-emerald-500" />
                                <Label htmlFor="email">Email</Label>
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <IoLocationOutline size={15} className="text-emerald-500" />
                                <Label htmlFor="location">Location</Label>
                            </div>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Jakarta, Bandung, etc."
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-50"
                            >
                                {formik.isSubmitting ? "Saving..." : "Save account"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default CompleteProfile;
