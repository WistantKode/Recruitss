"use client";

import {ArrowLeft, ArrowRight, CheckCircle2, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {FormActionsProps} from "@/app/auth/register/types";



export const FormActions = ({step, loading, onBack}: FormActionsProps) => {
    return (
        <div className="flex gap-4 pt-4">
            {step === 2 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Retour
                </Button>
            )}
            <Button
                type="submit"
                variant={step === 1 ? "default" : "gradient"}
                disabled={loading}
                className="flex-1"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Inscription...
                    </>
                ) : step === 1 ? (
                    <>
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </>
                ) : (
                    <>
                        S&rsquo;inscrire
                        <CheckCircle2 className="ml-2 h-4 w-4"/>
                    </>
                )}
            </Button>
        </div>
    );
};
