import {
  ForgotPasswordBody,
  HealthResponse,
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
  User,
  type ForgotPasswordBody as ForgotPasswordBodyDto,
  type HealthResponse as HealthResponseDto,
  type LoginBody as LoginBodyDto,
  type RegisterBody as RegisterBodyDto,
  type ResetPasswordBody as ResetPasswordBodyDto,
  type User as UserDto,
} from "@repo/validators";
import { csrfHeaders } from "./csrf";

export type ApiClientOptions = {
  baseUrl: string;
};

async function parseJson(response: Response): Promise<unknown> {
  return response.json() as Promise<unknown>;
}

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  async function request(
    path: string,
    init: RequestInit & { csrf?: boolean } = {},
  ): Promise<Response> {
    const headers = new Headers(init.headers);
    if (init.csrf) {
      const csrf = csrfHeaders();
      for (const [key, value] of Object.entries(csrf)) {
        headers.set(key, value);
      }
    }
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  }

  return {
    async health(): Promise<HealthResponseDto> {
      const response = await request("/health");
      if (!response.ok) {
        throw new Error(`Health request failed with status ${response.status}`);
      }
      return HealthResponse.parse(await parseJson(response));
    },

    async register(body: RegisterBodyDto): Promise<UserDto> {
      const payload = RegisterBody.parse(body);
      const response = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Register failed with status ${response.status}`);
      }
      return User.parse(await parseJson(response));
    },

    async login(body: LoginBodyDto): Promise<UserDto> {
      const payload = LoginBody.parse(body);
      const response = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }
      return User.parse(await parseJson(response));
    },

    async logout(): Promise<void> {
      const response = await request("/auth/logout", {
        method: "POST",
        csrf: true,
      });
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
    },

    async refresh(): Promise<void> {
      const response = await request("/auth/refresh", {
        method: "POST",
        csrf: true,
      });
      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }
    },

    async me(): Promise<UserDto> {
      const response = await request("/auth/me");
      if (!response.ok) {
        throw new Error(`Me failed with status ${response.status}`);
      }
      return User.parse(await parseJson(response));
    },

    async forgotPassword(body: ForgotPasswordBodyDto): Promise<void> {
      const payload = ForgotPasswordBody.parse(body);
      const response = await request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `Forgot password failed with status ${response.status}`,
        );
      }
    },

    async resetPassword(body: ResetPasswordBodyDto): Promise<void> {
      const payload = ResetPasswordBody.parse(body);
      const response = await request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `Reset password failed with status ${response.status}`,
        );
      }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
