const getEnv = (keys: string[], fallback?: string) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required environment variable. Tried keys: ${keys.join(", ")}`);
};

const getOptionalEnv = (keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return undefined;
};

export const projectId = getEnv(
  ["NEXT_PUBLIC_SANITY_PROJECT_ID", "SANITY_STUDIO_PROJECT_ID", "SANITY_PROJECT_ID"],
  "c5fppl0v",
);

export const dataset = getEnv(
  ["NEXT_PUBLIC_SANITY_DATASET", "SANITY_STUDIO_DATASET", "SANITY_DATASET"],
  "production",
);

export const apiVersion = getEnv([
  "NEXT_PUBLIC_SANITY_API_VERSION",
  "SANITY_STUDIO_API_VERSION",
  "SANITY_API_VERSION",
], "2025-01-01");

export const readToken = getOptionalEnv(["SANITY_API_READ_TOKEN", "SANITY_STUDIO_READ_TOKEN"]);

export const useCdn = !readToken && process.env.NODE_ENV === "production";
