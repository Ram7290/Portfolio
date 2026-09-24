import axios, { type AxiosInstance } from "axios";
import type { StatItem } from "@/types/portfolio";

/**
 * Axios-based API client for browser-side (Client Component) calls.
 * Server Components use `serverApi` from `@/lib/api-server` instead.
 */

export interface ApiResponse<T = undefined> {
  ok: boolean;
  data?: T;
  error?: string;
  /** HTTP status of a failed request (undefined for network errors). */
  status?: number;
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Include credentials for auth cookies
  withCredentials: true,
});

// Helper to handle API responses: never throws, always resolves to ApiResponse
async function handleResponse<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      return {
        ok: false,
        error: error.response?.data?.error ?? error.message,
        status: error.response?.status,
      };
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/auth/login", credentials));
  },

  logout: async (): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/auth/logout"));
  },
};

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export interface ProfileInput {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  available: boolean;
  availabilityLabel: string;
  imageUrl: string | null;
  stats: StatItem[];
}

export const profileApi = {
  get: async (): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.get("/profile"));
  },

  save: async (data: ProfileInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put("/profile", data));
  },
};

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface SkillInput {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  order: number;
  active: boolean;
}

export const skillsApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/skills"));
  },

  create: async (data: Omit<SkillInput, "id">): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.post("/skills", data));
  },

  update: async (id: string, data: SkillInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put(`/skills/${id}`, data));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/skills/${id}`));
  },

  toggleActive: async (id: string, active: boolean): Promise<ApiResponse> => {
    return handleResponse(apiClient.patch(`/skills/${id}`, { active }));
  },

  reorder: async (ids: string[]): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/skills/reorder", { ids }));
  },
};

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface ExperienceInput {
  id?: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  order: number;
}

export const experienceApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/experience"));
  },

  create: async (data: Omit<ExperienceInput, "id">): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.post("/experience", data));
  },

  update: async (id: string, data: ExperienceInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put(`/experience/${id}`, data));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/experience/${id}`));
  },

  reorder: async (ids: string[]): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/experience/reorder", { ids }));
  },
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export interface ProjectInput {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  challenges: string;
  results: string;
  technologies: string[];
  category: string;
  thumbnailUrl: string | null;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

export const projectsApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/projects"));
  },

  create: async (data: Omit<ProjectInput, "id">): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.post("/projects", data));
  },

  update: async (id: string, data: ProjectInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put(`/projects/${id}`, data));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/projects/${id}`));
  },

  reorder: async (ids: string[]): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/projects/reorder", { ids }));
  },
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface ServiceInput {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export const servicesApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/services"));
  },

  create: async (data: Omit<ServiceInput, "id">): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.post("/services", data));
  },

  update: async (id: string, data: ServiceInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put(`/services/${id}`, data));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/services/${id}`));
  },

  reorder: async (ids: string[]): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/services/reorder", { ids }));
  },
};

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface EducationInput {
  id?: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string;
  order: number;
}

export const educationApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/education"));
  },

  create: async (data: Omit<EducationInput, "id">): Promise<ApiResponse<any>> => {
    return handleResponse(apiClient.post("/education", data));
  },

  update: async (id: string, data: EducationInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.put(`/education/${id}`, data));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/education/${id}`));
  },

  reorder: async (ids: string[]): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/education/reorder", { ids }));
  },
};

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export const messagesApi = {
  list: async (): Promise<ApiResponse<any[]>> => {
    return handleResponse(apiClient.get("/messages"));
  },

  unreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return handleResponse(apiClient.get("/messages/unread-count"));
  },

  submit: async (data: ContactFormInput): Promise<ApiResponse> => {
    return handleResponse(apiClient.post("/messages", data));
  },

  setRead: async (id: string, read: boolean): Promise<ApiResponse> => {
    return handleResponse(apiClient.patch(`/messages/${id}`, { read }));
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete(`/messages/${id}`));
  },
};

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export interface SocialLinkInput {
  id?: string;
  platform: string;
  url: string;
  order: number;
  active: boolean;
}

export interface SiteSettingsInput {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  resumeUrl?: string;
  resumeEnabled?: boolean;
  accentColor: string | null;
  seoKeywords: string[];
}

export interface ResumeSettingsInput {
  resumeUrl: string;
  resumeEnabled: boolean;
}

export const settingsApi = {
  // Social Links
  socialLinks: {
    list: async (): Promise<ApiResponse<any[]>> => {
      return handleResponse(apiClient.get("/settings/social-links"));
    },

    create: async (data: Omit<SocialLinkInput, "id">): Promise<ApiResponse<any>> => {
      return handleResponse(apiClient.post("/settings/social-links", data));
    },

    update: async (id: string, data: SocialLinkInput): Promise<ApiResponse> => {
      return handleResponse(apiClient.put(`/settings/social-links/${id}`, data));
    },

    delete: async (id: string): Promise<ApiResponse> => {
      return handleResponse(apiClient.delete(`/settings/social-links/${id}`));
    },

    reorder: async (ids: string[]): Promise<ApiResponse> => {
      return handleResponse(apiClient.post("/settings/social-links/reorder", { ids }));
    },
  },

  // Site Settings
  site: {
    get: async (): Promise<ApiResponse<any>> => {
      return handleResponse(apiClient.get("/settings/site"));
    },

    save: async (data: SiteSettingsInput): Promise<ApiResponse> => {
      return handleResponse(apiClient.put("/settings/site", data));
    },
  },

  // Resume (only the resume fields of site settings)
  resume: {
    get: async (): Promise<ApiResponse<ResumeSettingsInput>> => {
      return handleResponse(apiClient.get("/settings/resume"));
    },

    save: async (data: ResumeSettingsInput): Promise<ApiResponse> => {
      return handleResponse(apiClient.put("/settings/resume", data));
    },
  },
};

/* ------------------------------------------------------------------ */
/* Upload                                                              */
/* ------------------------------------------------------------------ */

export interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadApi = {
  image: async (file: File, folder: "profile" | "projects"): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return handleResponse(
      apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },

  remove: async (publicId: string): Promise<ApiResponse> => {
    return handleResponse(apiClient.delete("/upload", { data: { publicId } }));
  },
};

// Export the axios instance for custom requests if needed
export { apiClient };
