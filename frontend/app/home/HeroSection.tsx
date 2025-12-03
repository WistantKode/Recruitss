import React, {Component} from 'react';
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRight, Sparkles, Users} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

class HeroSection extends Component {
    render() {
        return (
            <section className="container mx-auto px-4 py-20 md:py-32 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <Badge variant="secondary" className="mb-6 px-4 py-2">
                        <Sparkles className="h-3 w-3 mr-2" />
                        Plateforme de recrutement intelligente
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Trouvez votre prochain{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              talent
            </span>{' '}
                        ou{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              emploi
            </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                        La plateforme de recrutement intelligente qui connecte les meilleurs talents
                        avec les meilleures opportunités grâce à l&apos;IA
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href="/auth/register?role=candidate">
                            <Button variant="gradient" size="xl" className="group">
                                Je cherche un emploi
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/auth/register?role=recruiter">
                            <Button variant="outline" size="xl" className="group">
                                Je recrute des talents
                                <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</CardTitle>
                                <CardDescription className="text-base">Candidats actifs</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-purple-600 dark:text-purple-400">500+</CardTitle>
                                <CardDescription className="text-base">Entreprises</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-pink-600 dark:text-pink-400">95%</CardTitle>
                                <CardDescription className="text-base">Taux de satisfaction</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>
        );
    }
}

export default HeroSection;