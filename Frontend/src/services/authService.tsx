import axios from "axios";

interface LoginResponse {
  message: string;
  EmployeeId: string;
  Permission: string;
  Status: string;
}

export const loginUser = async (EmployeeId: string, Password: string) => {
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:3000/api/login",
      { EmployeeId, Password }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Login failed. Please check your credentials."
    );
  }
};
