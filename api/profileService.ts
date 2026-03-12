import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const profileService = {
    async updateProfile(data: DataProfile, accessToken: string): Promise<AxiosResponse<UpdateProfileResponse>> {
        return axiosInstance.patch<UpdateProfileResponse>("/users/profile", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    async getLocations(query: string): Promise<AxiosResponse<{ message: string; data: string[] }>> {
        return axiosInstance.get<{ message: string; data: string[] }>(`/users/locations?q=${encodeURIComponent(query)}`);
    }
};