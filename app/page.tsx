import { Metadata } from "next";
import BrowseCreatorsPage from "./HomeClient";

export const metadata: Metadata = {
    title: "Browse Creators",
};

export default function Page() {
    return <BrowseCreatorsPage />;
}
