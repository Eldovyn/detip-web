"use client";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useTopup } from "@/hooks/useTopup";
import { BalanceCard } from "@/components/BalanceCard";
import { TopupDialog } from "@/components/TopupDialog";
import { TransactionList } from "@/components/TransactionList";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useAuth } from "@/hooks/useAuth";

const MOCK_TRANSACTIONS = Array.from({ length: 3 }, () => ({
    hash: "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421",
    status: "Success",
    time: "12s ago",
    amount: "0.024 ETH",
    fee: "0.00042",
}));

export default function Page() {
    const [menuOpen, setMenuOpen] = useState(false);
    const topup = useTopup();


    const { account } = useAuth();
    const { balance, symbol } = useTokenBalance(account?.address);

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">
                    <BalanceCard
                        symbol={symbol}
                        balance={balance}
                        menuOpen={menuOpen}
                        onMenuChange={setMenuOpen}
                        onTopupClick={topup.open}
                    />

                    <TopupDialog
                        isOpen={topup.isOpen}
                        step={topup.step}
                        amount={topup.amount}
                        isValidAmount={topup.isValidAmount}
                        estimatedIDR={topup.estimatedIDR}
                        onOpenChange={topup.setIsOpen}
                        onAmountChange={topup.setAmount}
                        onStepChange={topup.setStep}
                        onPayment={topup.goToPayment}
                        onPaid={topup.handlePaid}
                    />

                    <TransactionList transactions={MOCK_TRANSACTIONS} />
                </div>
            </section>
        </>
    );
}
