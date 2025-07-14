import { useAuthStore } from "~/stores/auth";

export const useMyFetch = (request: any, opts?: any) => {
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const token = useCookie("token");

  return useFetch(request, {
    baseURL: config.public.baseURL,
    key: request,
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    onRequest({ request, options }) {
      // Set the request headers
    },
    onRequestError({ request, options, error }) {
      console.log("request", request);
      console.log("error", error);
      // Handle the request errors
    },
    onResponse({ request, response, options }) {
      // Process the response data
      return response._data;
    },
    onResponseError({ request, response, options }) {
      console.log("request", request);
      console.log("response", response);
      if (response.status === 401 || response.status === 403) {
        auth.clearUser();

        navigateTo("/login");
      }

      // Handle the response errors
    },
    ...opts,
  });
};
