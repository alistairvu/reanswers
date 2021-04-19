import axios from "axios"

const axiosClient = axios.create()

axiosClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("jwt")
  if (token) {
    config.headers.authorization = "Bearer " + token
  }
  return config
})

export default axiosClient
