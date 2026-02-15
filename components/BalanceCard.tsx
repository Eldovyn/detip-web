import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SECONDARY_BTN, PRIMARY_BTN, MENU_CONTENT, MENU_ITEM } from "@/constants/styles";
import { formatCompactNumber } from "@/utils/format";

export function BalanceCard({ balance, symbol, menuOpen, onMenuChange, onTopupClick }: BalanceCardProps) {
    return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">DTC Balance</p>
                    <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(balance)} {symbol}</p>
                    <p className="text-sm text-slate-500">Available</p>
                </div>

                <DropdownMenu open={menuOpen} onOpenChange={onMenuChange} modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="rounded-md p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                            aria-label="More options"
                        >
                            <HiDotsVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className={MENU_CONTENT}>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                onMenuChange(false);
                                onTopupClick();
                            }}
                            className={MENU_ITEM}
                        >
                            Top up
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className={MENU_ITEM}>
                            <Link href="/swap">Swap</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-emerald-100" />

                        <DropdownMenuItem asChild className={MENU_ITEM}>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
                <button type="button" className={SECONDARY_BTN} onClick={onTopupClick}>
                    Top up
                </button>

                <button type="button" className={PRIMARY_BTN}>
                    Swap token
                </button>
            </div>
        </div>
    );
}
