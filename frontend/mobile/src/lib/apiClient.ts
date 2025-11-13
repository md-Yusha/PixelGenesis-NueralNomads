import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from '../config/env';
import {
  LoginRequest,
  LoginResponse,
  User,
  DIDInfo,
  VerifiableCredential,
  VerifyCredentialRequest,
  VerifyCredentialResponse,
} from './types';

const TOKEN_KEY = 'pixelgenesis_auth_token';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.PIXELGENESIS_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach auth token
    this.client.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear it
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/v1/auth/login', credentials);
    if (response.data.access_token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.access_token);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }

  // DID methods
  async getMyDID(): Promise<DIDInfo> {
    const response = await this.client.get<DIDInfo>('/api/v1/did/me');
    return response.data;
  }

  async createDID(): Promise<DIDInfo> {
    const response = await this.client.post<DIDInfo>('/api/v1/did');
    return response.data;
  }

  // Credential methods
  async getMyCredentials(): Promise<VerifiableCredential[]> {
    const response = await this.client.get<VerifiableCredential[]>('/api/v1/credentials/me');
    return response.data;
  }

  async verifyCredential(request: VerifyCredentialRequest): Promise<VerifyCredentialResponse> {
    const response = await this.client.post<VerifyCredentialResponse>(
      '/api/v1/credentials/verify',
      request
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();

