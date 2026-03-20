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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function BalanceCard({ balance, symbol, menuOpen, onMenuChange, onTopupClick, avatar, username }: BalanceCardProps) {
    return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-emerald-100 ring-4 ring-emerald-50 shrink-0">
                        <AvatarImage src={avatar} alt={username || "User"} />
                        <AvatarFallback className="bg-emerald-500 text-white font-bold text-xl">
                            {username ? username[0].toUpperCase() : "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{username || "DTC Balance"}</p>
                        <p className="text-3xl font-semibold text-slate-900">{formatCompactNumber(balance)} {symbol}</p>
                        <p className="text-sm text-slate-500">Available</p>
                    </div>
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

                        <DropdownMenuItem asChild className={MENU_ITEM}>
                            <Link href="/yield">Yield</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-emerald-100" />

                        <DropdownMenuItem asChild className={MENU_ITEM}>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                <button type="button" className={SECONDARY_BTN} onClick={onTopupClick}>
                    Top up
                </button>

                <Link href="/swap" className={PRIMARY_BTN}>
                    Swap token
                </Link>

                <Link href="/yield" className={PRIMARY_BTN}>
                    Yield
                </Link>
            </div>
        </div>
    );
}
