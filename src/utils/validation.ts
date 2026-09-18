export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

export const validateAnalyzeRequest = (
  body: unknown
): { valid: boolean; url?: string; error?: string } => {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const { url } = body as { url?: unknown };

  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required and must be a string" };
  }

  if (!isValidUrl(url)) {
    return { valid: false, error: "Invalid URL format" };
  }

  return { valid: true, url };
};
