import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Favorite Creators",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
