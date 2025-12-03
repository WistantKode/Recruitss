import Link from "next/link";
import {Sparkles} from "lucide-react";

export function RegisterHeader() {
    return (
        <div className="text-center mb-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            >
                <Sparkles className="h-8 w-8 text-blue-600"/>
                Recruitsss
            </Link>
            <h1 className="mt-6 text-4xl font-bold">Créer un compte</h1>
            <p className="mt-2 text-muted-foreground text-lg">
                Rejoignez la plateforme en quelques étapes
            </p>
        </div>
    );
}
