import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { useCommonStore } from "@/store"

const getRequestKey = (config: InternalAxiosRequestConfig): string => `${config.method}:${config.url}`

const pendingRequests = new Set<string>()
const requestControllers = new Map<string, AbortController>()
const loadingTimers = new Map<string, ReturnType<typeof setTimeout>>()

const LOADING_DELAY = 300

const baseURL = import.meta.env.VITE_API_URL

const service: AxiosInstance = axios.create({
  baseURL,
  timeout: 180000, 
  maxContentLength: 100000000,
  maxBodyLength: 10000000000,
});

function stopLoading(requestKey: string) {
  const timer = loadingTimers.get(requestKey)
  if (timer) {
    clearTimeout(timer);
    loadingTimers.delete(requestKey)
  }
  pendingRequests.delete(requestKey)
  useCommonStore().setLoading(false)
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestKey = getRequestKey(config)
    if (pendingRequests.has(requestKey)) {
      const controller = new AbortController()
      config.signal = controller.signal
      controller.abort("Duplicate request")
      requestControllers.delete(requestKey)
      return Promise.reject(new Error("Duplicate request: " + requestKey))
    }

    const controller = new AbortController()
    config.signal = controller.signal
    requestControllers.set(requestKey, controller)

    const timer = setTimeout(() => {
      useCommonStore().setLoading(true)
      loadingTimers.delete(requestKey)
    }, LOADING_DELAY);
    loadingTimers.set(requestKey, timer)

    pendingRequests.add(requestKey)
    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const requestKey = getRequestKey(response.config)
    stopLoading(requestKey)
    requestControllers.delete(requestKey)

    if (response.config.responseType && response.config.responseType === "blob") {
      if (!response.data) {
        throw new Error("Blob response is empty")
      }
      return response
    }

    return response.data ?? response
  },
  async (error) => {
    const requestKey = getRequestKey(error.config || {})
    stopLoading(requestKey)
    requestControllers.delete(requestKey)

    if (!axios.isCancel(error)) {
      await handleErrorResponse(error)
    } else {
      console.warn("요청 취소됨:", error.message)
    }

    return Promise.reject(error)
  }
);

async function handleErrorResponse(error: any) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.error("인증 실패")
        break;
      case 403:
        console.error("권한 없음")
        break;
      case 500:
        console.error("서버 오류가 발생했습니다.")
        break;
      default:
        console.error(`응답 오류: ${error.response.status}`)
    }
  } else if (error.request) {
    console.error("서버 응답 없음:", error.message)
  } else {
    console.error("요청 설정 오류:", error.message)
  }
  return Promise.reject(error)
}

export default service
