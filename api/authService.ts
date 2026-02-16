import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const authService = {
    async createNonce(): Promise<AxiosResponse<CreateNonceResponse>> {
        return axiosInstance.get<CreateNonceResponse>("/auth/nonce");
    },
    async signIn(message: string, signature: string): Promise<AxiosResponse<SignInResponse>> {
        return axiosInstance.post<SignInResponse>("/auth/sign-in", {
            message,
            signature,
        });
    },
};