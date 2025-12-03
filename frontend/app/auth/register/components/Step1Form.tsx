"use client";

import {
    Mail,
    Lock,
    User,
    Phone,
    Building2,
} from "lucide-react";
import {motion} from "framer-motion";
import {Input} from "@/components/ui/input";
import {FormData} from "../types";
import {PasswordStrengthIndicator} from "./PasswordStrengthIndicator";
import React from "react"; // Import the new component

interface Step1FormProps {
    formData: Partial<FormData>;
    setFormData: (data: Partial<FormData>) => void;
}

export const Step1Form = ({formData, setFormData}: Step1FormProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setFormData({[id]: value});
    };

    return (
        <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="space-y-6"
        >
            {/* Role Selection */}
            <div>
                <label className="block text-sm font-medium mb-3">Je suis</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData({role: "CANDIDATE"})}
                        className={`p-6 border-2 rounded-xl text-center transition-all ${
                            formData.role === "CANDIDATE"
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20 shadow-lg scale-105"
                                : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                    >
                        <User className="h-8 w-8 mx-auto mb-3 text-blue-600"/>
                        <div className="font-semibold">Candidat</div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Je cherche un emploi
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({role: "RECRUITER"})}
                        className={`p-6 border-2 rounded-xl text-center transition-all ${
                            formData.role === "RECRUITER"
                                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20 shadow-lg scale-105"
                                : "border-border hover:border-muted-foreground hover:shadow-md"
                        }`}
                    >
                        <Building2 className="h-8 w-8 mx-auto mb-3 text-purple-600"/>
                        <div className="font-semibold">Recruteur</div>
                        <div className="text-sm text-muted-foreground mt-1">Je recrute</div>
                    </button>
                </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="first_name"
                        className="block text-sm font-medium mb-2"
                    >
                        Prénom *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Jean"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="last_name"
                        className="block text-sm font-medium mb-2"
                    >
                        Nom *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            id="last_name"
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Dupont"
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="jean.dupont@exemple.com"
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Téléphone (optionnel)
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="+33 6 12 34 56 78"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Mot de passe *
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="••••••••"
                    />
                </div>
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator password={formData.password || ""}/>
            </div>

            {/* Confirm Password */}
            <div>
                <label
                    htmlFor="password_confirm"
                    className="block text-sm font-medium mb-2"
                >
                    Confirmer le mot de passe *
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="password_confirm"
                        type="password"
                        required
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="••••••••"
                    />
                </div>
            </div>
        </motion.div>
    );
};
