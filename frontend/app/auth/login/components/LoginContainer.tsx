"use client";
import Link from "next/link";
import {motion} from "framer-motion";
import {AnimatedBackground} from "@/app/auth/login/components/AnimatedBackground";
import {LoginHeader} from "@/app/auth/login/components/LoginHeader";
import {LoginForm} from "@/app/auth/login/components/LoginForm";

export default function LoginContainer() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <AnimatedBackground/>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-md"
            >
                <LoginHeader/>
                <LoginForm/>
                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
                    >
                        ← Retour à l&apos;accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
