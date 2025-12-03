import React from "react";
import {CheckCircle, XCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {PasswordStrengthIndicatorProps} from "@/app/auth/register/types";


export const PasswordStrengthIndicator: React.FC<
    PasswordStrengthIndicatorProps
> = ({password}) => {
    // Only render the indicator if a password has been entered
    if (!password) {
        return null;
    }

    const validations = [
        {
            label: "Au moins 8 caractères",
            isValid: password.length >= 8,
        },
        {
            label: "Au moins une minuscule",
            isValid: /[a-z]/.test(password),
        },
        {
            label: "Au moins une majuscule",
            isValid: /[A-Z]/.test(password),
        },
        {
            label: "Au moins un chiffre",
            isValid: /[0-9]/.test(password),
        },
        {
            label: "Au moins un caractère spécial",
            isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        },
    ];

    const fulfilledValidations = validations.filter((v) => v.isValid).length;
    const strength = (fulfilledValidations / validations.length) * 100;

    const getProgressBarColorClass = (strength: number) => {
        if (strength < 40) return "bg-red-500";
        if (strength < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    const progressBarColorClass = getProgressBarColorClass(strength);

    return (
        <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
                <Progress
                    value={strength}
                    indicatorColorClass={progressBarColorClass} // Pass the dynamic color class
                    className="h-2" // Base styling for the progress bar container
                />
                <span className="text-sm text-muted-foreground">
          {strength.toFixed(0)}% Fort
        </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
                {validations.map((validation, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {validation.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500"/>
                        ) : (
                            <XCircle className="h-4 w-4 text-red-500"/>
                        )}
                        <span>{validation.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
