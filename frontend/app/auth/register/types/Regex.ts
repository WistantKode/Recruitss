export const validatePasswordStrength = (password: string) => {
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
    return validations.every((v) => v.isValid);
};