"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ApiResponse } from "@/lib/api-client";

/**
 * Load a resource from the REST API in a Client Component.
 *
 * `fetcher` must be a stable reference (e.g. `skillsApi.list`). Call
 * `reload()` after a mutation to refetch — `router.refresh()` does not
 * re-run client-side fetches.
 */
export function useApiResource<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  fallback: T,
) {
  const fallbackRef = useRef(fallback);
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>(undefined);

  const reload = useCallback(async () => {
    const result = await fetcher();
    if (result.ok) {
      setData(result.data ?? fallbackRef.current);
      setError(null);
      setStatus(undefined);
    } else {
      setError(result.error ?? "Request failed.");
      setStatus(result.status);
    }
    setLoading(false);
  }, [fetcher]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    loading,
    error,
    reload,
    /** False when the API reports a server-side failure (database down/unconfigured). */
    dbConfigured: !(error && (status === undefined || status >= 500)),
  };
}
