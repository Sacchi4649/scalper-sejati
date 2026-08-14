import { v2 as cloudinary } from "cloudinary";

const UPLOAD_FOLDER = "scalper-sejati/products";

function parseCloudinaryUrl() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) {
    throw new Error("CLOUDINARY_URL belum diatur");
  }

  const match = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) {
    throw new Error("CLOUDINARY_URL tidak valid");
  }

  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  };
}

export function createSignedUpload() {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = UPLOAD_FOLDER;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return {
    timestamp,
    signature,
    folder,
    apiKey,
    cloudName,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}
