export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body },
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data: { secure_url: string } = await res.json();
  return data.secure_url;
}


