import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export const authService = {
    async createNonce(data: NonceInput): Promise<AxiosResponse<CreateNonceResponse>> {
        return axiosInstance.post<CreateNonceResponse>("/auth/nonce", data);
    },
    async signIn(message: string, signature: string): Promise<AxiosResponse<SignInResponse>> {
        return axiosInstance.post<SignInResponse>("/auth/sign-in", {
            message,
            signature,
        });
    },
    async userMe(accessToken: string): Promise<AxiosResponse<UserMeResponse>> {
        return axiosInstance.get<UserMeResponse>("/auth/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
};