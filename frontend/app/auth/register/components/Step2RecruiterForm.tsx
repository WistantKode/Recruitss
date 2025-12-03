"use client";

import {Building2, FileText} from "lucide-react";
import {motion} from "framer-motion";
import {Input} from "@/components/ui/input";
import {Step2RecruiterFormProps} from "../types";
import React from "react";



export const Step2RecruiterForm = ({formData, setFormData}: Step2RecruiterFormProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setFormData({[id]: value});
    };

    return (
        <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            className="space-y-6"
        >
            {/* Company Name */}
            <div>
                <label
                    htmlFor="company_name"
                    className="block text-sm font-medium mb-2"
                >
                    Nom de l&#39;entreprise *
                </label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="company_name"
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Ma Super Entreprise"
                    />
                </div>
            </div>

            {/* Company Description */}
            <div>
                <label
                    htmlFor="company_description"
                    className="block text-sm font-medium mb-2"
                >
                    Description de l&#39;entreprise
                </label>
                <textarea
                    id="company_description"
                    rows={4}
                    value={formData.company_description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    placeholder="Décrivez votre entreprise, sa mission, sa culture..."
                />
            </div>

            {/* Industry */}
            <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-2">
                    Secteur d&#39;activité
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Technologie, Finance, Santé, etc."
                    />
                </div>
            </div>
        </motion.div>
    );
};
