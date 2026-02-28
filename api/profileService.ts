import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const profileService = {
    async updateProfile(data: DataProfile): Promise<AxiosResponse<UpdateProfileResponse>> {
        return axiosInstance.patch<UpdateProfileResponse>("/users/profile", data);
    }
};