export type ApplicantStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

export interface Applicant {
  id: string;
  fullName: string;
  email: string;
  track: string;
  status: ApplicantStatus;
  applicationDate: string;
  country?: string;
  phoneNumber?: string;
  skills?: string[];
  experienceLevel?: string;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedInUrl?: string | null;
  motivation?: string | null;
  notes?: string | null;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ApplicantMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApplicantListResponse {
  data: Applicant[];
  meta: ApplicantMeta;
  // legacy aliases for compatibility
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface Statistics {
  total: number;
  byStatus: Record<ApplicantStatus, number>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  token?: string;
}

export interface StatusUpdateRequest {
  status: ApplicantStatus;
}

export interface ApplicantQueryParams {
  q?: string;
  status?: ApplicantStatus | '';
  sortBy?: 'fullName' | 'email' | 'applicationDate' | 'status' | 'track';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ListUIState {
  q: string;
  status: ApplicantStatus | '';
  sortBy: string;
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface AuthState {
  token: string | null;
  lastEmail: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  setLastEmail: (email: string) => void;
}
