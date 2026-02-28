'use client';

import { QueryProvider } from "./QueryProvider";
import { ThirdwebProviderWrapper } from "./ThirdwebProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <ThirdwebProviderWrapper>
                {children}
            </ThirdwebProviderWrapper>
        </QueryProvider>
    );
}
