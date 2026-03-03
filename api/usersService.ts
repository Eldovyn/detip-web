import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const usersService = {
    async getDonate(username: string): Promise<AxiosResponse<GetDonateResponse>> {
        return axiosInstance.get<GetDonateResponse>(`/users/donate?username=${username}`);
    },
};