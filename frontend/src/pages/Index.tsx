import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, BookOpen, Shield } from "lucide-react";

const Index = () => {
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-primary-foreground text-4xl">Alvora</h1>
            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/auth'} className="shadow-soft border-solid rounded-md text-lg text-gray-50 bg-black">
              Intră în cont
            </Button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                  Conectează-te cu colegii tăi
                </h2>
                <p className="text-xl text-primary-foreground/90 leading-relaxed">Alvora este platforma dedicată studenților unde poți găsi 
parteneri de studiu, 
tutori și colaboratori pentru proiecte academice.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" onClick={() => window.location.href = '/auth'} className="text-lg shadow-medium hover:shadow-glow transition-smooth bg-primary-foreground text-secondary">
                  Înscrie-te acum
                </Button>
                
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 to-transparent rounded-3xl blur-3xl" />
              <img alt="Studenți colaborând împreună" className="relative rounded-3xl shadow-glow w-full h-auto" src="/lovable-uploads/68b8f4de-039a-4027-91c5-8169b037e861.jpg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold text-foreground">
              De ce să alegi Alvora?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Platforma care transformă modul în care studenții colaborează și se sprijină reciproc
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-smooth shadow-soft hover:shadow-medium">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle>Siguranță garantată</CardTitle>
                <CardDescription>
                  Acces exclusiv cu e-mail instituțional pentru studenții verificați
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-smooth shadow-soft hover:shadow-medium">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-accent-foreground" />
                </div>
                <CardTitle>Grupuri de studiu</CardTitle>
                <CardDescription>
                  Creează sau alătură-te grupurilor bazate pe cursuri și interese comune
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-smooth shadow-soft hover:shadow-medium">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle>Chat integrat</CardTitle>
                <CardDescription>
                  Comunicare directă între studenți pentru schimb de materiale și planificare
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-smooth shadow-soft hover:shadow-medium">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-accent-foreground" />
                </div>
                <CardTitle>Profil personalizat</CardTitle>
                <CardDescription>
                  Prezintă-ți facultatea, anul și interesele pentru a găsi parteneri potriviți
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold text-foreground">
              Cum funcționează?
            </h3>
            <p className="text-xl text-muted-foreground">
              Trei pași simpli către o experiență universitară mai bună
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-4xl font-bold text-primary-foreground mx-auto shadow-medium">
                1
              </div>
              <h4 className="text-2xl font-bold">Înregistrează-te</h4>
              <p className="text-muted-foreground">
                Folosește e-mailul tău instituțional pentru a crea un cont securizat
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center text-4xl font-bold text-accent-foreground mx-auto shadow-medium">
                2
              </div>
              <h4 className="text-2xl font-bold">Creează-ți profilul</h4>
              <p className="text-muted-foreground">
                Adaugă informații despre facultate, cursuri și interesele tale academice
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-4xl font-bold text-primary-foreground mx-auto shadow-medium">
                3
              </div>
              <h4 className="text-2xl font-bold">Conectează-te</h4>
              <p className="text-muted-foreground">
                Găsește parteneri de studiu și alătură-te grupurilor care te interesează
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl font-bold text-foreground">
              Cine folosește Alvora?
            </h3>
            <p className="text-xl text-muted-foreground">
              Platforma este perfectă pentru toți studenții universitari
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-medium hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl">Studenți din primul an</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrează-te rapid în mediul universitar și creează-ți un cerc de prieteni cu interese comune
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl">Studenți internaționali</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Adaptează-te mai ușor la noul mediu și colaborează eficient cu colegii locali
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-glow transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl">Studenți performanți</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Devino mentor pentru colegii mai tineri și împărtășește-ți experiența și cunoștințele
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
          <h3 className="text-4xl lg:text-5xl font-bold text-primary-foreground max-w-3xl mx-auto leading-tight">
            Începe să construiești conexiuni academice valoroase astăzi
          </h3>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Alătură-te comunității Alvora și transformă-ți experiența universitară
          </p>
          <Button size="lg" variant="secondary" className="text-lg shadow-glow hover:scale-105 transition-smooth" onClick={() => window.location.href = '/auth'}>
            Creează cont gratuit
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold text-foreground">Alvora</h4>
              <p className="text-muted-foreground mt-2">
                Platforma studenților pentru colaborare academică
              </p>
            </div>
            <div className="text-center md:text-right text-muted-foreground">
              <p>© 2024 Alvora. Toate drepturile rezervate.</p>
              <p className="mt-1">Universitatea Româno-Americană</p>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;