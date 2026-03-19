import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const donationsService = {
    async getDonations(page: number, limit: number): Promise<AxiosResponse<GetDonationsResponse>> {
        return axiosInstance.get<GetDonationsResponse>(`/donations`, {
            params: { page, limit }
        });
    }
};