import NavBar from "@/components/NavBar"
import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";

const truncateMiddle = (str: string, front = 14, back = 4) => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};

export default function Page() {
    return (
        <>
            <NavBar />
            <section className="flex flex-col h-screen bg-[#F9F8F5] pt-10 gap-5">
                <div className="flex flex-col gap-2 border rounded-md w-[30%] mx-auto bg-white p-5">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">Saldo DTC</p>
                        < HiDotsVertical size={20} />
                    </div>
                    <p className="text-[30px] font-semibold">100 DTC</p>
                    <p className="text-sm">Tersedia</p>
                    <button className="bg-[#38B9B7] text-white py-2 px-4 rounded-md">Swap Token</button>
                </div>
                <div className="flex flex-col w-[30%] mx-auto bg-white p-5 rounded-md border gap-5">
                    <p className="font-bold">Transactions</p>
                    <div className="flex flex-col border rounded-md p-3">
                        <div className="flex gap-3">
                            <GrTransaction size={20} />
                            {(() => {
                                const hash = "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421";
                                return (
                                    <Link
                                        href="/transaction"
                                        title={hash}
                                        className="text-[#01308F] text-sm"
                                    >
                                        {truncateMiddle(hash, 45, 4)}
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="flex flex-col border rounded-md p-3">
                        <div className="flex gap-3">
                            <GrTransaction size={20} />
                            {(() => {
                                const hash = "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421";
                                return (
                                    <Link
                                        href="/transaction"
                                        title={hash}
                                        className="text-[#01308F] text-sm"
                                    >
                                        {truncateMiddle(hash, 45, 4)}
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="flex flex-col border rounded-md p-3">
                        <div className="flex gap-3">
                            <GrTransaction size={20} />
                            {(() => {
                                const hash = "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421";
                                return (
                                    <Link
                                        href="/transaction"
                                        title={hash}
                                        className="text-[#01308F] text-sm"
                                    >
                                        {truncateMiddle(hash, 45, 4)}
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}