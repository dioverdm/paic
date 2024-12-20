import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export const searchWeb = async (query: string): Promise<string> => {
  try {
    const url = new URL("https://www.google.com/search");
    url.searchParams.set("q", query);
    url.searchParams.set("sourceid", "chrome");
    url.searchParams.set("ie", "UTF-8");

    const response = await axios.get(url.toString());
    const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(response.data);

    console.log(bodyMatch);

    return bodyMatch ? bodyMatch[1].trim() : "";
  } catch (error) {
    throw new Error(
      `Failed to fetch search results: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// create an axios instance with base url
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});
