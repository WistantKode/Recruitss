"use client";
import React, {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {motion} from "framer-motion";
import {toast} from "sonner";
import apiClient from "@/lib/api/client";
import {useAuthStore} from "@/lib/store";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {AnimatedBackground} from "./AnimatedBackground";
import {RegisterHeader} from "./RegisterHeader";
import {ProgressIndicator} from "./ProgressIndicator";
import {Step1Form} from "./Step1Form";
import {Step2CandidateForm} from "./Step2CandidateForm";
import {Step2RecruiterForm} from "./Step2RecruiterForm";
import {FormActions} from "./FormActions";
import {FormData} from "../types";
import {ArrowLeft} from "lucide-react";
import {validatePasswordStrength} from "@/app/auth/register/types/Regex";

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setUser = useAuthStore((state) => state.setUser);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        phone: "",
        role:
            (searchParams.get("role")?.toUpperCase() as "CANDIDATE" | "RECRUITER") ||
            "CANDIDATE",
        bio: "",
        skills: "",
        experience_years: 0,
        location: "",
        company_name: "",
        company_description: "",
        industry: "",
    });
    const [loading, setLoading] = useState(false);

    const handleFormDataChange = (data: Partial<FormData>) => {
        setFormData((prev) => ({...prev, ...data}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (formData.password !== formData.password_confirm) {
                toast.error("Erreur de validation", {
                    description: "Les mots de passe ne correspondent pas",
                });
                return;
            }
            if (!validatePasswordStrength(formData.password)) {
                toast.error("Mot de passe faible", {
                    description:
                        "Le mot de passe ne respecte pas toutes les exigences de sécurité.",
                });
                return;
            }
            setStep(2);
            return;
        }

        setLoading(true);

        try {
            const data: Record<string, unknown> = {
                email: formData.email,
                password: formData.password,
                password_confirm: formData.password_confirm,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                role: formData.role,
            };

            if (formData.role === "CANDIDATE") {
                data.bio = formData.bio;
                data.skills = formData.skills
                    ? formData.skills.split(",").map((s) => s.trim())
                    : [];
                data.experience_years = formData.experience_years;
                data.location = formData.location;
            } else if (formData.role === "RECRUITER") {
                data.company_name = formData.company_name;
                data.company_description = formData.company_description;
                data.industry = formData.industry;
            }

            const response = await apiClient.register(data);
            setUser(response.user);

            toast.success("Inscription réussie !", {
                description: `Bienvenue ${formData.first_name} !`,
            });

            if (formData.role === "CANDIDATE") {
                router.push("/dashboard/candidate");
            } else if (formData.role === "RECRUITER") {
                router.push("/dashboard/recruiter");
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const message =
                error.response?.data?.error ||
                "Erreur lors de l'inscription. Veuillez réessayer.";
            toast.error("Erreur d'inscription", {
                description: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground/>
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="max-w-2xl mx-auto"
                >
                    <RegisterHeader/>
                    <ProgressIndicator step={step}/>

                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle>
                                {step === 1
                                    ? "Informations personnelles"
                                    : "Complétez votre profil"}
                            </CardTitle>
                            <CardDescription>
                                {step === 1
                                    ? "Commençons par les informations de base"
                                    : formData.role === "CANDIDATE"
                                        ? "Parlez-nous de votre expérience"
                                        : "Informations sur votre entreprise"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === 1 ? (
                                    <Step1Form
                                        formData={formData}
                                        setFormData={handleFormDataChange}
                                    />
                                ) : formData.role === "CANDIDATE" ? (
                                    <Step2CandidateForm
                                        formData={formData}
                                        setFormData={handleFormDataChange}
                                    />
                                ) : (
                                    <Step2RecruiterForm
                                        formData={formData}
                                        setFormData={handleFormDataChange}
                                    />
                                )}

                                <FormActions
                                    step={step}
                                    loading={loading}
                                    onBack={() => setStep(1)}
                                />
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Vous avez déjà un compte ?{" "}
                                    <Link
                                        href="/auth/login"
                                        className="font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Connectez-vous
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                            <ArrowLeft className="h-3 w-3"/>
                            Retour à l&apos;accueil
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
