
import axiosInstance from "../../utils/axioInstance"

export const signInApi = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post(
      "/auth/sign-in",
      { email, password },
      { withCredentials: true }
    )
    return { data: response.data, error: null }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Something went wrong. Please try again!"

    return { data: null, error: message }
  }
}
