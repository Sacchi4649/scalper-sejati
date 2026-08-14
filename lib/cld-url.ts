export function cldUrl(publicId: string, width = 640) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return "";
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,w_${width}/f_auto/q_auto/${publicId}`;
}

export function cldPreviewUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return "";
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_1600/f_auto/q_auto/${publicId}`;
}
