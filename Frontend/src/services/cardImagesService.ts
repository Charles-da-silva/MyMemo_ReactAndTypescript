import { API_BASE_URL, authenticatedFetch } from "./api";

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

async function getErrorMessage(response: Response): Promise<string> {
  const body = await response.text();
  if (!body) {
    return `Erro no envio da imagem (HTTP ${response.status}).`;
  }

  try {
    const parsed = JSON.parse(body) as {
      error?: string | { message?: string };
      message?: string;
    };
    if (typeof parsed.error === "string") return parsed.error;
    if (parsed.error?.message) return parsed.error.message;
    if (parsed.message) return parsed.message;
  } catch {
    return body;
  }

  return body;
}

export async function uploadCardImage(file: File): Promise<string> {
  const signatureResponse = await authenticatedFetch(
    `${API_BASE_URL}/cloudinary/signature`,
  );
  if (!signatureResponse.ok) {
    throw new Error(await getErrorMessage(signatureResponse));
  }

  const signature = (await signatureResponse.json()) as CloudinarySignature;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("folder", signature.folder);
  formData.append("signature", signature.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    { method: "POST", body: formData },
  );
  const responseBody = await uploadResponse.text();
  let result: CloudinaryUploadResponse | null = null;
  try {
    result = JSON.parse(responseBody) as CloudinaryUploadResponse;
  } catch {
    if (!uploadResponse.ok) {
      throw new Error(
        responseBody || `Erro no envio da imagem (HTTP ${uploadResponse.status}).`,
      );
    }
  }

  if (!uploadResponse.ok) {
    throw new Error(
      result?.error?.message ||
        `Erro no envio da imagem (HTTP ${uploadResponse.status}).`,
    );
  }
  if (!result?.secure_url) {
    throw new Error("A Cloudinary não retornou a URL segura da imagem.");
  }

  return result.secure_url;
}
