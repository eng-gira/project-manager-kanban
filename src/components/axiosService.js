import { ref } from 'vue'

export function useAxios(defaults) {
  const loading = ref(false);
  const data = ref(defaults?.data || null);
  const error = ref(null);

  // const router = useRouter();

  const run = async (promise) => {
    loading.value = true;

    // make sure the return of fn is a promise
    if (!axiosCall || !axiosCall.then) {
      throw new Error(`Only axios calls should be given`);
    }

    return axiosCall
      .then((response) => {
        data.value = response.data.content;
        return response.data.content;
      })
      .catch((e) => {
        const err = e.response // ?.data;
        error.value = err;
        return Promise.reject(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return { data, run, loading, error };
}