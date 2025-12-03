import React from 'react';
import {Sparkles} from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-border py-12 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="h-6 w-6 text-primary"/>
                            <div className="text-xl font-bold">Recruitsss</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-md">
                            La plateforme de recrutement intelligente qui connecte les meilleurs talents
                            avec les meilleures opportunités. Propulsé par l&apos;IA.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features"
                                      className="hover:text-foreground transition-colors">Fonctionnalités</Link>
                            </li>
                            <li><Link href="#pricing"
                                      className="hover:text-foreground transition-colors">Tarifs</Link></li>
                            <li><Link href="/auth/register"
                                      className="hover:text-foreground transition-colors">Inscription</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Légal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#"
                                      className="hover:text-foreground transition-colors">Confidentialité</Link>
                            </li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>© 2025 Recruitsss. Tous droits réservés. Fait avec ❤️</p>
                </div>
            </div>
        </footer>

    );
};

export default Footer;