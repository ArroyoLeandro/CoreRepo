import { HealthResponse, type HealthResponse as HealthResponseDto } from "@repo/validators";

export type ApiClientOptions = {
  baseUrl: string;
};

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  return {
    async health(): Promise<HealthResponseDto> {
      const response = await fetch(`${baseUrl}/health`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Health request failed with status ${response.status}`);
      }

      const body: unknown = await response.json();
      return HealthResponse.parse(body);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
