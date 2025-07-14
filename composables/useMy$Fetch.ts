import { useAuthStore } from "~/stores/auth";

export const useMy$Fetch = <T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1],
) => {
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const token = useCookie("token");

  return $fetch<T>(request, {
    baseURL: config.public.baseURL,
    ...opts,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : "",
      ...opts?.headers,
    },

    onRequest({ request, options }) {
      // Set the request headers
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
    },
    onResponse({ request, response, options }) {
      // Process the response data

      return response._data;
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors

      if (response.status === 401 || response.status === 403) {
        auth.clearUser();
        navigateTo("/login");
      }
    },
    ...opts,
  });
};
