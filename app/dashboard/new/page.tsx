"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
    uploadImage,
    uploadVideo,
} from "@/lib/supabase/upload";

export default function NewProjectPage() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState("");
    const [slogan, setSlogan] = useState("");
    const [description, setDescription] = useState("");
    const [rank, setRank] = useState("1");
    const [liveLink, setLiveLink] = useState("");
    const [githubUrl, setGithubUrl] = useState("");

    const [isPersonal, setIsPersonal] = useState(true);

    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState("");

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [pictures, setPictures] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);

    const addSkill = () => {
        const skill = currentSkill.trim();

        if (!skill) return;

        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }

        setCurrentSkill("");
    };

    const removeSkill = (index: number) => {
        setSkills(
            skills.filter((_, i) => i !== index)
        );
    };

    const removePicture = (index: number) => {
        setPictures(
            pictures.filter((_, i) => i !== index)
        );
    };

    const removeVideo = (index: number) => {
        setVideos(
            videos.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !rank) {
            alert(
                "Please fill out all required core parameters."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            let thumbnailUrl: string | null = null;

            if (thumbnail) {
                thumbnailUrl = await uploadImage(
                    thumbnail,
                    "projects/thumbnails"
                );
            }

            const pictureUrls = await Promise.all(
                pictures.map((file) =>
                    uploadImage(
                        file,
                        "projects/pictures"
                    )
                )
            );

            const videoUrls = await Promise.all(
                videos.map((file) =>
                    uploadVideo(
                        file,
                        "projects/videos"
                    )
                )
            );

            const payload = {
                title,
                slogan,
                description,
                rank: Number(rank),
                liveLink: liveLink.trim() || null,
                githubUrl: githubUrl.trim() || null,
                thumbnailUrl,
                isPersonal,
                skills,
                pictures: pictureUrls,
                videos: videoUrls,
            };

            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                const errData = await res.json();

                alert(
                    `Creation error: ${
                        errData.error ||
                        "Server rejected request"
                    }`
                );
            }
        } catch (err) {
            console.error(err);

            alert(
                "Failed to upload project files."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-main text-default p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted">
                        Create New Project
                    </span>

                    <Link
                        href="/dashboard"
                        className="text-xs text-primary hover:text-accent transition-colors"
                    >
                        ← Return To Dashboard
                    </Link>
                </div>

                <h1 className="text-3xl font-extrabold text-primary border-b border-surface pb-4">
                    Register New Project
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-surface p-6 md:p-8 rounded-xl border border-surface/50 shadow-xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label
                                htmlFor="title"
                                className="text-xs font-semibold text-muted uppercase tracking-wider"
                            >
                                Project Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                required
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                            />
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="rank"
                                className="text-xs font-semibold text-muted uppercase tracking-wider"
                            >
                                Display Rank Placement
                            </label>

                            <input
                                id="rank"
                                type="number"
                                required
                                value={rank}
                                onChange={(e) =>
                                    setRank(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
                            Project Classification
                        </label>

                        <div className="inline-flex rounded-lg bg-main p-1 border border-main/40">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPersonal(true)
                                }
                                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${
                                    isPersonal
                                        ? "bg-primary text-default shadow-md"
                                        : "text-muted hover:text-default"
                                }`}
                            >
                                Personal Project
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsPersonal(false)
                                }
                                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${
                                    !isPersonal
                                        ? "bg-accent text-default shadow-md"
                                        : "text-muted hover:text-default"
                                }`}
                            >
                                Freelance Project
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="slogan"
                            className="text-xs font-semibold text-muted uppercase tracking-wider"
                        >
                            Slogan
                        </label>

                        <input
                            id="slogan"
                            type="text"
                            value={slogan}
                            onChange={(e) =>
                                setSlogan(
                                    e.target.value
                                )
                            }
                            className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
                            Engine / Tech Stack Tags
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentSkill}
                                onChange={(e) =>
                                    setCurrentSkill(
                                        e.target.value
                                    )
                                }
                                placeholder="Next.js, Laravel, TailwindCSS, etc."
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        e.preventDefault();
                                        addSkill();
                                    }
                                }}
                                className="flex-1 bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                            />

                            <button
                                type="button"
                                onClick={addSkill}
                                className="bg-primary/20 text-primary border border-primary/30 px-4 rounded-lg text-sm font-semibold hover:bg-primary hover:text-default transition-all"
                            >
                                Add Tag
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                                {skills.map(
                                    (skill, i) => (
                                        <span
                                            key={`${skill}-${i}`}
                                            className="inline-flex items-center text-xs bg-main text-default border border-main/60 px-2.5 py-1 rounded font-mono"
                                        >
                                            <span>
                                                {skill}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSkill(
                                                        i
                                                    )
                                                }
                                                className="ml-2 text-red-400 hover:text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label
                            htmlFor="description"
                            className="text-xs font-semibold text-muted uppercase tracking-wider"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows={4}
                            required
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label
                                htmlFor="live-link"
                                className="text-xs font-semibold text-muted uppercase tracking-wider"
                            >
                                Live Link URL
                            </label>

                            <input
                                id="live-link"
                                type="url"
                                value={liveLink}
                                onChange={(e) =>
                                    setLiveLink(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                            />
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="github-url"
                                className="text-xs font-semibold text-muted uppercase tracking-wider"
                            >
                                GitHub Repository Link
                            </label>

                            <input
                                id="github-url"
                                type="url"
                                value={githubUrl}
                                onChange={(e) =>
                                    setGithubUrl(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default"
                            />
                        </div>
                    </div>

                    <hr className="border-main/20" />

                    <div className="space-y-2">
                        <label
                            htmlFor="thumbnail"
                            className="text-xs font-semibold text-muted uppercase tracking-wider block"
                        >
                            Hero Thumbnail Image
                        </label>

                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setThumbnail(
                                    e.target.files?.[0] ??
                                        null
                                )
                            }
                            className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm text-default"
                        />

                        {thumbnail && (
                            <p className="text-xs text-muted">
                                Selected:{" "}
                                {thumbnail.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="pictures"
                            className="text-xs font-semibold text-muted uppercase tracking-wider block"
                        >
                            Project Showcase Pictures Gallery
                        </label>

                        <input
                            id="pictures"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files =
                                    Array.from(
                                        e.target.files ??
                                            []
                                    );

                                setPictures(
                                    (current) => [
                                        ...current,
                                        ...files,
                                    ]
                                );

                                e.target.value = "";
                            }}
                            className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm text-default"
                        />

                        {pictures.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                                {pictures.map(
                                    (file, i) => (
                                        <span
                                            key={`${file.name}-${i}`}
                                            className="inline-flex items-center text-xs bg-main text-accent border border-main/60 px-2.5 py-1 rounded"
                                        >
                                            <span className="truncate max-w-[200px]">
                                                {
                                                    file.name
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePicture(
                                                        i
                                                    )
                                                }
                                                className="ml-2 text-red-400 hover:text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="videos"
                            className="text-xs font-semibold text-muted uppercase tracking-wider block"
                        >
                            Project Showcase Videos Gallery
                        </label>

                        <input
                            id="videos"
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => {
                                const files =
                                    Array.from(
                                        e.target.files ??
                                            []
                                    );

                                setVideos(
                                    (current) => [
                                        ...current,
                                        ...files,
                                    ]
                                );

                                e.target.value = "";
                            }}
                            className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm text-default"
                        />

                        {videos.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                                {videos.map(
                                    (file, i) => (
                                        <span
                                            key={`${file.name}-${i}`}
                                            className="inline-flex items-center text-xs bg-main text-accent border border-main/60 px-2.5 py-1 rounded"
                                        >
                                            <span className="truncate max-w-[200px]">
                                                {
                                                    file.name
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeVideo(
                                                        i
                                                    )
                                                }
                                                className="ml-2 text-red-400 hover:text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-default font-bold p-3 rounded-lg shadow-md hover:bg-primary/90 hover:scale-[1.01] transition-all whitespace-nowrap border border-primary/20 align-self-start sm:align-self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? "Creating Project..."
                            : "Create Project"}
                    </button>
                </form>
            </div>
        </main>
    );
}