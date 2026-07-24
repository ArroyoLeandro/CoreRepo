import {
  CreateUserBody,
  ForgotPasswordBody,
  HealthResponse,
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
  Settings,
  UpdateSettingsBody,
  UpdateUserBody,
  User,
  UsersList,
  type CreateUserBody as CreateUserBodyDto,
  type ForgotPasswordBody as ForgotPasswordBodyDto,
  type HealthResponse as HealthResponseDto,
  type LoginBody as LoginBodyDto,
  type RegisterBody as RegisterBodyDto,
  type ResetPasswordBody as ResetPasswordBodyDto,
  type Settings as SettingsDto,
  type UpdateSettingsBody as UpdateSettingsBodyDto,
  type UpdateUserBody as UpdateUserBodyDto,
  type User as UserDto,
  type UsersList as UsersListDto,
} from "@repo/validators";
import { csrfHeaders } from "./csrf";

export type ApiClientOptions = {
  baseUrl: string;
  /** Optional cookie header for server-side calls (SSR gate). */
  cookie?: string;
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
    if (options.cookie) {
      headers.set("Cookie", options.cookie);
    }
    if (init.csrf) {
      const csrf = csrfHeaders(options.cookie);
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

    async listUsers(): Promise<UsersListDto> {
      const response = await request("/users");
      if (!response.ok) {
        throw new Error(`List users failed with status ${response.status}`);
      }
      return UsersList.parse(await parseJson(response));
    },

    async createUser(body: CreateUserBodyDto): Promise<UserDto> {
      const payload = CreateUserBody.parse(body);
      const response = await request("/users", {
        method: "POST",
        csrf: true,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Create user failed with status ${response.status}`);
      }
      return User.parse(await parseJson(response));
    },

    async updateUser(id: string, body: UpdateUserBodyDto): Promise<UserDto> {
      const payload = UpdateUserBody.parse(body);
      const response = await request(`/users/${id}`, {
        method: "PATCH",
        csrf: true,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Update user failed with status ${response.status}`);
      }
      return User.parse(await parseJson(response));
    },

    async deleteUser(id: string): Promise<void> {
      const response = await request(`/users/${id}`, {
        method: "DELETE",
        csrf: true,
      });
      if (!response.ok) {
        throw new Error(`Delete user failed with status ${response.status}`);
      }
    },

    async getSettings(): Promise<SettingsDto> {
      const response = await request("/settings");
      if (!response.ok) {
        throw new Error(`Get settings failed with status ${response.status}`);
      }
      return Settings.parse(await parseJson(response));
    },

    async updateSettings(body: UpdateSettingsBodyDto): Promise<SettingsDto> {
      const payload = UpdateSettingsBody.parse(body);
      const response = await request("/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
        csrf: true,
      });
      if (!response.ok) {
        throw new Error(`Update settings failed with status ${response.status}`);
      }
      return Settings.parse(await parseJson(response));
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
