import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const transactionsService = {
    async getTransactionsPage(page: number, limit: number): Promise<AxiosResponse<GetTransactionsPageResponse>> {
        return axiosInstance.get<GetTransactionsPageResponse>(`/transactions/pages?page=${page}&limit=${limit}`);
    },
    async getTransaction(hash: string): Promise<AxiosResponse<GetTransactionResponse>> {
        return axiosInstance.get<GetTransactionResponse>(`/transactions/${hash}`);
    },
};