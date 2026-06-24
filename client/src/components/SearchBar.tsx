import { Search } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Search leaders..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50",
                    "text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50",
                    "transition-all duration-200"
                )}
            />
        </div>
    );
};
