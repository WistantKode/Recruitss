"use client";

import {Briefcase, MapPin} from "lucide-react";
import {motion} from "framer-motion";
import {Input} from "@/components/ui/input";
import {Step2CandidateFormProps} from "../types";
import React from "react";



export const Step2CandidateForm = ({formData, setFormData}: Step2CandidateFormProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        if (id === "experience_years") {
            setFormData({[id]: parseInt(value) || 0});
        } else {
            setFormData({[id]: value});
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            className="space-y-6"
        >
            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                    Bio (optionnel)
                </label>
                <textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    placeholder="Parlez-nous de vous, votre parcours, vos ambitions..."
                />
            </div>

            {/* Skills */}
            <div>
                <label htmlFor="skills" className="block text-sm font-medium mb-2">
                    Compétences (séparées par des virgules)
                </label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                    <Input
                        id="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="JavaScript, React, Node.js, Python"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Experience Years */}
                <div>
                    <label
                        htmlFor="experience_years"
                        className="block text-sm font-medium mb-2"
                    >
                        Années d&#39;expérience
                    </label>
                    <Input
                        id="experience_years"
                        type="number"
                        min="0"
                        value={formData.experience_years}
                        onChange={handleInputChange}
                        placeholder="5"
                    />
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                        Localisation
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Paris, France"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
