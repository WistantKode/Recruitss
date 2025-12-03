"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import {Briefcase, Search, TrendingUp} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export function RecentActivityCard() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5}}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5"/>
                        Activité récente
                    </CardTitle>
                    <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Briefcase className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <p className="text-muted-foreground mb-4">Aucune activité récente</p>
                        <Link href="/jobs">
                            <Button variant="gradient">
                                <Search className="mr-2 h-4 w-4"/>
                                Commencer à postuler
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
