import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const usersService = {
    async getDonate(username: string): Promise<AxiosResponse<GetDonateResponse>> {
        return axiosInstance.get<GetDonateResponse>(`/users/donates/${username}`);
    },
    async getDonates(page: number, limit: number): Promise<AxiosResponse<GetDonatesResponse>> {
        return axiosInstance.get<GetDonatesResponse>(`/users/donates?page=${page}&limit=${limit}`);
    },
};