"use client";

import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

interface Project {
    id: string;
    title: string;
    slogan: string;
    description: string;
    rank: number;
    liveLink: string | null;
    githubUrl: string | null;
    thumbnailUrl: string | null;
    isPersonal: boolean;
    skills: string[];
    pictures: string[];
    videos: string[];
}

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [project, setProject] =
        useState<Project | null>(null);

    const [title, setTitle] = useState("");
    const [slogan, setSlogan] = useState("");
    const [description, setDescription] = useState("");
    const [rank, setRank] = useState("1");
    const [liveLink, setLiveLink] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isPersonal, setIsPersonal] = useState(true);

    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState("");

    const [pictures, setPictures] = useState<string[]>([]);
    const [currentPicture, setCurrentPicture] = useState("");

    const [videos, setVideos] = useState<string[]>([]);
    const [currentVideo, setCurrentVideo] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(
                    `/api/projects/${id}`
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load project."
                    );
                }

                const data = await res.json();

                const formattedSkills =
                    data.skills?.map((skill: any) =>
                        typeof skill === "object"
                            ? skill.name
                            : skill
                    ) || [];

                const formattedPictures =
                    data.pictures?.map((picture: any) =>
                        typeof picture === "object"
                            ? picture.url
                            : picture
                    ) || [];

                const formattedVideos =
                    data.videos?.map((video: any) =>
                        typeof video === "object"
                            ? video.url
                            : video
                    ) || [];

                const projectData: Project = {
                    id: data.id,
                    title: data.title || "",
                    slogan: data.slogan || "",
                    description: data.description || "",
                    rank: data.rank ?? 1,
                    liveLink: data.liveLink || null,
                    githubUrl: data.githubUrl || null,
                    thumbnailUrl:
                        data.thumbnailUrl || null,
                    isPersonal:
                        data.isPersonal !== undefined
                            ? data.isPersonal
                            : true,
                    skills: formattedSkills,
                    pictures: formattedPictures,
                    videos: formattedVideos,
                };

                setProject(projectData);

                setTitle(projectData.title);
                setSlogan(projectData.slogan);
                setDescription(projectData.description);
                setRank(String(projectData.rank));
                setLiveLink(
                    projectData.liveLink || ""
                );
                setGithubUrl(
                    projectData.githubUrl || ""
                );
                setThumbnailUrl(
                    projectData.thumbnailUrl || ""
                );
                setIsPersonal(projectData.isPersonal);

                setSkills(projectData.skills);
                setPictures(projectData.pictures);
                setVideos(projectData.videos);
            } catch (error) {
                console.error(
                    "Failed to load project:",
                    error
                );

                setError(
                    "Failed to load project data."
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProject();
        }
    }, [id]);

    function addSkill() {
        const value = currentSkill.trim();

        if (!value) return;

        if (!skills.includes(value)) {
            setSkills((current) => [
                ...current,
                value,
            ]);
        }

        setCurrentSkill("");
    }

    function removeSkill(index: number) {
        setSkills((current) =>
            current.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )
        );
    }

    function addPicture() {
        const value = currentPicture.trim();

        if (!value) return;

        setPictures((current) => [
            ...current,
            value,
        ]);

        setCurrentPicture("");
    }

    function removePicture(index: number) {
        setPictures((current) =>
            current.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )
        );
    }

    function addVideo() {
        const value = currentVideo.trim();

        if (!value) return;

        setVideos((current) => [
            ...current,
            value,
        ]);

        setCurrentVideo("");
    }

    function removeVideo(index: number) {
        setVideos((current) =>
            current.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )
        );
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                `/api/projects/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        slogan,
                        description,
                        rank: Number(rank),
                        liveLink:
                            liveLink.trim() || null,
                        githubUrl:
                            githubUrl.trim() || null,
                        thumbnailUrl:
                            thumbnailUrl.trim() ||
                            null,
                        isPersonal,
                        skills,
                        pictures,
                        videos,
                    }),
                }
            );

            if (!response.ok) {
                const data =
                    await response.json();

                throw new Error(
                    data.error ||
                        "Failed to update project."
                );
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(
                "Failed to update project:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update project."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-main p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border border-surface bg-surface p-6 text-sm text-muted">
                        Loading project...
                    </div>
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="min-h-screen bg-main p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-400">
                        {error ||
                            "Project not found."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-main p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="
                            rounded-lg
                            p-2
                            text-muted
                            transition-colors
                            hover:bg-surface
                            hover:text-default
                        "
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-default">
                            Update Project
                        </h1>

                        <p className="mt-1 text-sm text-muted">
                            Update the project
                            information and
                            showcase content.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        rounded-xl
                        border
                        border-surface
                        bg-surface
                        p-5
                        shadow-sm
                        sm:p-6
                    "
                >
                    <div className="space-y-6">
                        {/* Title + Rank */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-default"
                                >
                                    Project Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target
                                                .value
                                        )
                                    }
                                    required
                                    className="
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="rank"
                                    className="mb-2 block text-sm font-medium text-default"
                                >
                                    Display Rank
                                </label>

                                <input
                                    id="rank"
                                    type="number"
                                    value={rank}
                                    onChange={(e) =>
                                        setRank(
                                            e.target
                                                .value
                                        )
                                    }
                                    required
                                    className="
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />
                            </div>
                        </div>

                        {/* Classification */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-default">
                                Project Classification
                            </label>

                            <div className="inline-flex rounded-lg border border-main bg-main p-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsPersonal(
                                            true
                                        )
                                    }
                                    className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                                        isPersonal
                                            ? "bg-primary text-default shadow-md"
                                            : "text-muted hover:text-default"
                                    }`}
                                >
                                    📁 Personal Project
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsPersonal(
                                            false
                                        )
                                    }
                                    className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                                        !isPersonal
                                            ? "bg-accent text-default shadow-md"
                                            : "text-muted hover:text-default"
                                    }`}
                                >
                                    💼 Freelance Project
                                </button>
                            </div>
                        </div>

                        {/* Slogan */}
                        <div>
                            <label
                                htmlFor="slogan"
                                className="mb-2 block text-sm font-medium text-default"
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
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-main
                                    bg-main
                                    px-3
                                    text-sm
                                    text-default
                                    outline-none
                                    transition
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/15
                                "
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-default">
                                Engine / Tech Stack
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={
                                        currentSkill
                                    }
                                    onChange={(e) =>
                                        setCurrentSkill(
                                            e.target
                                                .value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                    placeholder="Next.js, Laravel, TailwindCSS, etc."
                                    className="
                                        h-11
                                        min-w-0
                                        flex-1
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        placeholder:text-muted
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="
                                        rounded-lg
                                        border
                                        border-primary/30
                                        bg-primary/20
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-primary
                                        transition-all
                                        hover:bg-primary
                                        hover:text-default
                                    "
                                >
                                    Add Tag
                                </button>
                            </div>

                            {skills.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg border border-main/10 bg-main/40 p-2">
                                    {skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded
                                                    border
                                                    border-main
                                                    bg-main
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    text-default
                                                "
                                            >
                                                <span>
                                                    {
                                                        skill
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(
                                                            index
                                                        )
                                                    }
                                                    className="ml-2 font-bold text-red-400 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-default"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                rows={5}
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target
                                            .value
                                    )
                                }
                                required
                                className="
                                    w-full
                                    resize-none
                                    rounded-lg
                                    border
                                    border-main
                                    bg-main
                                    p-3
                                    text-sm
                                    text-default
                                    outline-none
                                    transition
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/15
                                "
                            />
                        </div>

                        {/* Links */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="live-link"
                                    className="mb-2 block text-sm font-medium text-default"
                                >
                                    Live Link URL
                                </label>

                                <input
                                    id="live-link"
                                    type="url"
                                    value={liveLink}
                                    onChange={(e) =>
                                        setLiveLink(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="github-url"
                                    className="mb-2 block text-sm font-medium text-default"
                                >
                                    GitHub Repository
                                </label>

                                <input
                                    id="github-url"
                                    type="url"
                                    value={githubUrl}
                                    onChange={(e) =>
                                        setGithubUrl(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="
                                        h-11
                                        w-full
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />
                            </div>
                        </div>

                        <div className="border-t border-main/20 pt-2" />

                        {/* Thumbnail */}
                        <div>
                            <label
                                htmlFor="thumbnail"
                                className="mb-2 block text-sm font-medium text-default"
                            >
                                Hero Thumbnail Image URL
                            </label>

                            <input
                                id="thumbnail"
                                type="url"
                                value={thumbnailUrl}
                                onChange={(e) =>
                                    setThumbnailUrl(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="https://domain.com/thumbnail.png"
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-main
                                    bg-main
                                    px-3
                                    text-sm
                                    text-default
                                    outline-none
                                    transition
                                    placeholder:text-muted
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/15
                                "
                            />
                        </div>

                        {/* Pictures */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-default">
                                Project Showcase Pictures
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={
                                        currentPicture
                                    }
                                    onChange={(e) =>
                                        setCurrentPicture(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="https://domain.com/image.png"
                                    className="
                                        h-11
                                        min-w-0
                                        flex-1
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        placeholder:text-muted
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={addPicture}
                                    className="
                                        rounded-lg
                                        border
                                        border-primary/30
                                        bg-primary/20
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-primary
                                        transition-all
                                        hover:bg-primary
                                        hover:text-default
                                    "
                                >
                                    Add Link
                                </button>
                            </div>

                            {pictures.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg border border-main/10 bg-main/40 p-2">
                                    {pictures.map(
                                        (
                                            url,
                                            index
                                        ) => (
                                            <span
                                                key={`${url}-${index}`}
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded
                                                    border
                                                    border-main
                                                    bg-main
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    text-accent
                                                "
                                            >
                                                <span className="max-w-[200px] truncate">
                                                    {url}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePicture(
                                                            index
                                                        )
                                                    }
                                                    className="ml-2 font-bold text-red-400 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Videos */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-default">
                                Project Showcase Videos
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={
                                        currentVideo
                                    }
                                    onChange={(e) =>
                                        setCurrentVideo(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="
                                        h-11
                                        min-w-0
                                        flex-1
                                        rounded-lg
                                        border
                                        border-main
                                        bg-main
                                        px-3
                                        text-sm
                                        text-default
                                        outline-none
                                        transition
                                        placeholder:text-muted
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/15
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={addVideo}
                                    className="
                                        rounded-lg
                                        border
                                        border-primary/30
                                        bg-primary/20
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-primary
                                        transition-all
                                        hover:bg-primary
                                        hover:text-default
                                    "
                                >
                                    Add Link
                                </button>
                            </div>

                            {videos.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg border border-main/10 bg-main/40 p-2">
                                    {videos.map(
                                        (
                                            url,
                                            index
                                        ) => (
                                            <span
                                                key={`${url}-${index}`}
                                                className="
                                                    inline-flex
                                                    items-center
                                                    rounded
                                                    border
                                                    border-main
                                                    bg-main
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    text-accent
                                                "
                                            >
                                                <span className="max-w-[200px] truncate">
                                                    {url}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeVideo(
                                                            index
                                                        )
                                                    }
                                                    className="ml-2 font-bold text-red-400 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Link
                                href="/dashboard"
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    px-4
                                    text-sm
                                    font-medium
                                    text-muted
                                    transition-colors
                                    hover:bg-main
                                    hover:text-default
                                "
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-primary
                                    px-5
                                    text-sm
                                    font-medium
                                    text-default
                                    transition-colors
                                    hover:bg-primary/90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {saving
                                    ? "Updating Project..."
                                    : "Update Project"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}