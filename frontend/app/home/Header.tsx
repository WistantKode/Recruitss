import React, {Component} from 'react';
import {ArrowRight,} from "lucide-react";
import Link from "next/link";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Button} from "@/components/ui/button";
import Logo from "@/app/home/Logo";

class Header extends Component {
    render() {
        return (
            <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50 transition-all">
                <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Logo/>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Fonctionnalités
                        </Link>
                        <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                            Comment ça marche
                        </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            Tarifs
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <Link href="/auth/login">
                            <Button variant="ghost">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button variant="gradient" size="default">
                                S&apos;inscrire
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;