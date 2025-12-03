import React from 'react';
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

const CtaSection = () => {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10 dark:opacity-20"/>
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                >
                    <Badge variant="secondary" className="mb-6">
                        Commencez maintenant
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Prêt à transformer votre recrutement ?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Rejoignez des milliers d&apos;entreprises et de candidats qui nous font confiance
                        pour trouver les meilleures opportunités
                    </p>
                    <Link href="/auth/register">
                        <Button variant="gradient" size="xl" className="group">
                            Commencer gratuitement
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CtaSection;