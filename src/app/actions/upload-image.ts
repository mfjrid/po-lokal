"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "preorder-lokal",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result?.secure_url);
            }
        ).end(buffer);
    });
}
