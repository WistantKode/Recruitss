"use client";
import {CheckCircle2} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {ProgressIndicatorProps} from "@/app/auth/register/types";


export const ProgressIndicator = ({step}: ProgressIndicatorProps) => {
    return (
        <Card className="mb-8">
            <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                step >= 1
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {step > 1 ? <CheckCircle2 className="h-5 w-5"/> : "1"}
                        </div>
                        <span
                            className={`ml-3 text-sm font-medium hidden sm:inline ${
                                step >= 1 ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
                          Informations de base
                        </span>
                    </div>
                    <div
                        className={`w-16 sm:w-24 h-1 mx-4 transition-all ${
                            step >= 2
                                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                                : "bg-muted"
                        }`}
                    ></div>
                    <div className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                step >= 2
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            2
                        </div>
                        <span
                            className={`ml-3 text-sm font-medium hidden sm:inline ${
                                step >= 2 ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
                          Profil
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
