import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../consts/variables";

function useUniversalFetch() {
  const queryClient = useQueryClient();
  const lang = localStorage.getItem("app-language");
  const fetchData = async ({
    url,
    method = "GET",
    token,
    body = null,
    headers = {},
  }) => {
    const isFormData = body instanceof FormData;
    const fetchHeaders = {
      ...headers,
      lang: "en" || lang,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    // console.log("Fetching API:", { url, method, body, headers: fetchHeaders });

    const response = await fetch(`${BASE_URL}/${url}`, {
      method,
      headers: fetchHeaders,
      body:
        !isFormData && method !== "GET"
          ? JSON.stringify(body)
          : body,
    });

    const responseData = await response.json();
    // console.log("API Response:", responseData);

    if (!response.ok) {
      // console.log(responseData?.error?.message);
      throw new Error(
        responseData?.error?.message ||
          responseData?.message?.message ||
          responseData?.message ||
          "An error occurred"
      );
    } else {
      return responseData;
    }
  };

  const useFetchQuery = ({
    queryKey,
    id,
    url,
    params = {},
    token = false,
    config = {},
  }) => {
    const queryKeyArray = [queryKey, id, params];
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}${id ? `/${id}` : ""}?${queryString}`;

    return useQuery({
      queryKey: queryKeyArray,
      queryFn: () => fetchData({ url: fullUrl, token, ...config }),
      staleTime: 1000 * 60 * 5,
      refetchOnMount: true, // Ensure fresh data on mount
      refetchOnWindowFocus: true,
      keepPreviousData: false, // Ensures the UI updates immediately after a mutation
      ...config.queryOptions,
    });
  };

  const useFetchMutation = ({
    url,
    method,
    token = false,
    config = {},
    invalidateKey,
  }) =>
    useMutation({
      mutationFn: (data) =>
        fetchData({ url, method, token, body: data, ...config }),
      onSuccess: (data) => {
        // console.log("Mutation Success:", data);
        if (invalidateKey) {
          // console.log("Invalidating Query:", invalidateKey);
          queryClient.invalidateQueries({ queryKey: [invalidateKey] }); // Ensuring correct query invalidation
          queryClient.refetchQueries({ queryKey: [invalidateKey] }); // Force refetch
        }
      },
      ...config.mutationOptions,
    });

  const usePatchMutation = ({
    url,
    token = false,
    config = {},
    invalidateKey,
  }) =>
    useMutation({
      mutationFn: ({ id, data }) =>
        fetchData({ url: `${url}/${id}`, method: "PATCH", token, body: data }),
      onSuccess: () => {
        // console.log("Patch Mutation Success:", data);
        if (invalidateKey) {
          // console.log("Invalidating Query:", invalidateKey);
          queryClient.invalidateQueries({ queryKey: [invalidateKey] });
          queryClient.refetchQueries({ queryKey: [invalidateKey] });
        }
      },
      ...config.mutationOptions,
    });

  const useDeleteMutation = ({
    url,
    token = false,
    config = {},
    invalidateKey,
  }) =>
    useMutation({
      mutationFn: ({ id }) => {
        // Remove trailing slashes and /delete/ if already present
        const cleanUrl = url.replace(/\/+$/, '').replace(/\/delete\/?$/, '');
        return fetchData({ 
          url: `${cleanUrl}/delete/`, 
          method: "POST", 
          token, 
          body: { id } 
        });
      },
      onSuccess: (data) => {
        // console.log("Delete Mutation Success:", data);
        if (invalidateKey) {
          // console.log("Invalidating Query:", invalidateKey);
          queryClient.invalidateQueries({ queryKey: [invalidateKey] });
          queryClient.refetchQueries({ queryKey: [invalidateKey] });
        }
      },
      ...config.mutationOptions,
    });

  return {
    useFetchQuery,
    useFetchMutation,
    usePatchMutation,
    useDeleteMutation,
  };
}

export default useUniversalFetch;
