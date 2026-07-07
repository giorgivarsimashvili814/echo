export async function addImageToPost(postId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/images`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.image;
}
