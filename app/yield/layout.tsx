import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yield Farming",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
