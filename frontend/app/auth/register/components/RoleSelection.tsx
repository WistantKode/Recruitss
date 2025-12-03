import {User, Building2} from "lucide-react";

interface RoleSelectionProps {
    role: "CANDIDATE" | "RECRUITER";
    onRoleChange: (role: "CANDIDATE" | "RECRUITER") => void;
}

export function RoleSelection({role, onRoleChange}: RoleSelectionProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-3">Je suis</label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onRoleChange("CANDIDATE")}
                    className={`p-6 border-2 rounded-xl cursor-pointer text-center transition-all ${
                        role === "CANDIDATE"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20 shadow-lg scale-105"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                    }`}
                >
                    <User className="h-8 w-8 mx-auto mb-3 text-blue-600"/>
                    <div className="font-semibold">Candidat</div>
                    <div className="text-sm cursor-pointer text-muted-foreground mt-1">
                        Je cherche un emploi
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => onRoleChange("RECRUITER")}
                    className={`p-6 border-2 cursor-pointer rounded-xl text-center transition-all ${
                        role === "RECRUITER"
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20 shadow-lg scale-105"
                            : "border-border hover:border-muted-foreground hover:shadow-md"
                    }`}
                >
                    <Building2 className="h-8 w-8 mx-auto mb-3 text-purple-600"/>
                    <div className="font-semibold">Recruteur</div>
                    <div className="text-sm cursor-pointer text-muted-foreground mt-1">
                        Je recrute
                    </div>
                </button>
            </div>
        </div>
    );
}
