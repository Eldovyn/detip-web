import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Donation History",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
