import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const usersService = {
    async getDonate(username: string, accessToken?: string): Promise<AxiosResponse<GetDonateResponse>> {
        return axiosInstance.get<GetDonateResponse>(`/users/donates/${username}`, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
        });
    },
    async getDonates(page: number, limit: number, accessToken?: string): Promise<AxiosResponse<GetDonatesResponse>> {
        return axiosInstance.get<GetDonatesResponse>(`/users/donates?page=${page}&limit=${limit}`, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
        });
    },
    async favorite(address_id: string, accessToken: string): Promise<AxiosResponse<{ message: string; status: boolean }>> {
        return axiosInstance.post<{ message: string; status: boolean }>("/users/donates/favorites", { address_id }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    },
    async getFavorites(page: number, limit: number, accessToken: string): Promise<AxiosResponse<GetDonatesResponse>> {
        return axiosInstance.get<GetDonatesResponse>(`/users/donates/favorites?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    },
};