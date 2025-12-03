import React from 'react';
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckCircle, Sparkles, Star, TrendingUp, Users, Zap} from "lucide-react";

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                    className="text-center mb-16"
                >
                    <Badge variant="secondary" className="mb-4">
                        Fonctionnalités
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Pourquoi choisir Recruitsss ?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Des outils puissants pour simplifier et accélérer votre processus de recrutement
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.1}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Matching IA</CardTitle>
                                <CardDescription className="text-base">
                                    Notre algorithme intelligent trouve les meilleurs matchs entre candidats
                                    et offres d&apos;emploi pour maximiser la pertinence
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.2}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Rapide et Simple</CardTitle>
                                <CardDescription className="text-base">
                                    Postulez en quelques clics ou publiez une offre en moins de 5 minutes.
                                    Interface intuitive et fluide
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.3}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Notifications Instantanées</CardTitle>
                                <CardDescription className="text-base">
                                    Recevez des alertes par email et WhatsApp pour ne rien manquer.
                                    Restez informé en temps réel
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.4}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Gestion Simplifiée</CardTitle>
                                <CardDescription className="text-base">
                                    Tableaux de bord intuitifs pour gérer vos candidatures et offres.
                                    Toutes vos données en un coup d&apos;œil
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.5}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Tracking Avancé</CardTitle>
                                <CardDescription className="text-base">
                                    Suivez le statut de chaque candidature du début à la fin.
                                    Pipeline de recrutement complet
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{delay: 0.6}}
                    >
                        <Card
                            className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                            <CardHeader>
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Star className="h-6 w-6 text-white"/>
                                </div>
                                <CardTitle className="text-2xl">Expérience Premium</CardTitle>
                                <CardDescription className="text-base">
                                    Interface moderne et élégante. Dark mode, animations fluides,
                                    et design responsive
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;