/**
 * API client for PixelGenesis backend
 * Handles authentication and API calls
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/config/env';
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  IssueCredentialRequest,
  IssueCredentialResponse,
  VerifyCredentialRequest,
  VerifyCredentialResponse,
  CredentialRecord,
  DID,
} from './types';

const API_BASE_URL = config.apiBaseUrl;

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.loadToken();

    // Add request interceptor to attach token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Optionally redirect to login
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private loadToken(): void {
    const stored = localStorage.getItem('pixelgenesis_token');
    if (stored) {
      this.token = stored;
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('pixelgenesis_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('pixelgenesis_token');
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/v1/auth/register', data);
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/v1/auth/login', data);
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  // DID endpoints
  async getMyDID(): Promise<DID> {
    const response = await this.client.get<DID>('/api/v1/did/me');
    return response.data;
  }

  async createDID(): Promise<DID> {
    const response = await this.client.post<DID>('/api/v1/did');
    return response.data;
  }

  // Credential endpoints
  async getMyCredentials(): Promise<CredentialRecord[]> {
    const response = await this.client.get<CredentialRecord[]>('/api/v1/credentials/me');
    return response.data;
  }

  async issueCredential(data: IssueCredentialRequest): Promise<IssueCredentialResponse> {
    const response = await this.client.post<IssueCredentialResponse>(
      '/api/v1/credentials/issue',
      data
    );
    return response.data;
  }

  async verifyCredential(data: VerifyCredentialRequest): Promise<VerifyCredentialResponse> {
    const response = await this.client.post<VerifyCredentialResponse>(
      '/api/v1/credentials/verify',
      data
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

