import { supabase } from "@/lib/supabase/client";

const IMAGES_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET!;

const VIDEOS_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_VIDEOS_BUCKET!;

export async function uploadImage(
    file: File,
    folder: string
): Promise<string> {
    return uploadFile(file, folder, IMAGES_BUCKET);
}

export async function uploadVideo(
    file: File,
    folder: string
): Promise<string> {
    return uploadFile(file, folder, VIDEOS_BUCKET);
}

export async function deleteImage(
    publicUrl: string
): Promise<void> {
    return deleteFile(publicUrl, IMAGES_BUCKET);
}

export async function deleteVideo(
    publicUrl: string
): Promise<void> {
    return deleteFile(publicUrl, VIDEOS_BUCKET);
}

async function uploadFile(
    file: File,
    folder: string,
    bucket: string
): Promise<string> {
    const extension = file.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${
        extension ?? "bin"
    }`;

    const path = `${folder}/${fileName}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error(error);

        throw new Error(
            `Failed to upload file: ${error.message}`
        );
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}

async function deleteFile(
    publicUrl: string,
    bucket: string
): Promise<void> {
    const marker =
        `/storage/v1/object/public/${bucket}/`;

    const index = publicUrl.indexOf(marker);

    if (index === -1) {
        throw new Error(
            "Invalid Supabase file URL"
        );
    }

    const path = publicUrl.substring(
        index + marker.length
    );

    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        throw new Error(
            `Failed to delete file: ${error.message}`
        );
    }

    if (!data || data.length === 0) {
        throw new Error(
            `Supabase did not delete anything at path: ${path}`
        );
    }
}