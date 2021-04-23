import axios from "axios"

const axiosClient = axios.create()

axiosClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("jwt")
  if (token) {
    config.headers.authorization = "Bearer " + token
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      const { data } = await axiosClient.get("/api/auth/refresh")
      if (data.success) {
        const { token: newToken } = data

        window.localStorage.setItem("jwt", newToken)
        originalRequest.headers.authorization = "Bearer " + newToken
        return await axiosClient(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
