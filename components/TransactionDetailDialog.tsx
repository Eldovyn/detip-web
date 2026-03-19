"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/utils/format";
import { truncateMiddle } from "@/utils/string";
import { Copy, Check, ArrowUpRight, ArrowDownLeft, Hash, Clock, Fuel, Layers, Wallet } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
    Success: {
        label: "Success",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: Check,
    },
    Pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
    },
    Failed: {
        label: "Failed",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertCircle,
    },
} as const;

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-2 rounded-lg border transition-all duration-200",
                copied
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
            )}
            title="Copy to clipboard"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
    );
}

function InfoRow({
    label,
    value,
    copyValue,
    icon: Icon,
}: {
    label: string;
    value: string;
    copyValue?: string;
    icon?: React.ElementType;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-500">
                {Icon && <Icon size={14} className="text-slate-400" />}
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-center gap-2 max-w-[60%]">
                <code className="font-mono text-xs text-slate-900 break-all text-right">
                    {value}
                </code>
                {copyValue && <CopyButton text={copyValue} />}
            </div>
        </div>
    );
}

function AlertCircle({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}

export function TransactionDetailDialog({
    isOpen,
    onOpenChange,
    transaction,
}: TransactionDetailDialogProps) {
    if (!transaction) return null;

    const status = statusConfig[transaction.status as keyof typeof statusConfig] || statusConfig.Pending;
    const StatusIcon = status.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-0 gap-0 overflow-hidden border border-slate-200">
                <div className="p-6 pb-4 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white pt-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600">
                                <Hash size={20} className="text-white" />
                            </div>
                            Transaction Details
                        </DialogTitle>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border",
                                status.className
                            )}
                        >
                            <StatusIcon size={12} />
                            {status.label}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {formatDateTime(transaction.datetime)}
                    </p>
                </div>

                <div className="p-6 space-y-5">
                    <div className="rounded-2xl bg-linear-to-br from-emerald-50 via-emerald-50/50 to-white border border-emerald-100 p-5">
                        <div className="flex items-center gap-2 text-emerald-700 mb-2">
                            <ArrowUpRight size={16} className="text-emerald-500" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Amount Transferred</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                            {transaction.value_eth} <span className="text-lg font-semibold text-slate-500">ETH</span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Hash size={14} className="text-slate-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Transaction Hash</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
                            <code className="flex-1 font-mono text-sm text-slate-900">
                                {truncateMiddle(transaction.hash)}
                            </code>
                            <CopyButton text={transaction.hash} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <ArrowUpRight size={14} className="text-rose-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">From</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 font-mono text-sm text-slate-900">
                                    {truncateMiddle(transaction.from)}
                                </code>
                                <CopyButton text={transaction.from} />
                            </div>
                        </div>

                        <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <ArrowDownLeft size={14} className="text-emerald-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">To</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 font-mono text-sm text-slate-900">
                                    {transaction.to ? truncateMiddle(transaction.to) : "-"}
                                </code>
                                {transaction.to && <CopyButton text={transaction.to} />}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 space-y-4">
                        <InfoRow
                            label="Gas Fee"
                            value={String(transaction.gas)}
                            icon={Fuel}
                        />
                        <div className="h-px bg-slate-100" />
                        <InfoRow
                            label="Block"
                            value={String(transaction.block_number) || "-"}
                            icon={Layers}
                        />
                        <div className="h-px bg-slate-100" />
                        <InfoRow
                            label="Nonce"
                            value={String(transaction.nonce)}
                            icon={Wallet}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
