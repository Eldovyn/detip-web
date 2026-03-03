'use client';

import { QueryProvider } from "./QueryProvider";
import { ThirdwebProviderWrapper } from "./ThirdwebProvider";
import { AuthProvider } from "./AuthProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <ThirdwebProviderWrapper>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThirdwebProviderWrapper>
        </QueryProvider>
    );
}

