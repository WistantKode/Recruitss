import Logo from "@/app/home/Logo";

export function LoginHeader() {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-6">
                <Logo/>
            </div>
            <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
            <p className="text-muted-foreground">
                Connectez-vous pour accéder à votre espace
            </p>
        </div>
    );
}
