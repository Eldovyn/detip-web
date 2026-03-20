import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const donationsService = {
    async getDonations(page: number, limit: number, accessToken?: string): Promise<AxiosResponse<GetDonationsResponse>> {
        return axiosInstance.get<GetDonationsResponse>(`/donations`, {
            params: { page, limit },
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
        });
    }
};