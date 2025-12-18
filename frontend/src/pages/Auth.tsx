import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const faculties = [
    "Contabilitate și Informatică de Gestiune",
    "Comunicare și Relații Publice",
    "Management",
    "Științe Economice"
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await api.auth.getSession();
        if (data.user) {
          navigate("/search");
        }
      } catch (err) {
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await api.auth.login(email, password);
        toast({
          title: "Bine ai revenit!",
          description: "Te-ai conectat cu succes.",
        });
        navigate("/search");
      } else {
        if (!faculty) {
          toast({
            title: "Eroare",
            description: "Te rugăm să selectezi facultatea.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        await api.auth.register(email, password, fullName, faculty);
        toast({
          title: "Cont creat cu succes!",
          description: "Te-ai înregistrat cu succes. Poți să te conectezi acum.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "A apărut o eroare. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-background/80 backdrop-blur-sm border-border/50 shadow-medium">
        <div className="text-center space-y-2">
          <h1 className="font-bold bg-gradient-hero bg-clip-text text-[#4aadf4] text-5xl">
            Alvora
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Bine ai revenit!" : "Creează-ți contul"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nume complet
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Ion Popescu" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  className="bg-background border-border focus:border-primary transition-smooth" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty" className="text-foreground">
                  Facultatea
                </Label>
                <Select value={faculty} onValueChange={setFaculty} required>
                  <SelectTrigger className="bg-background border-border focus:border-primary transition-smooth">
                    <SelectValue placeholder="Selectează facultatea" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(f => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email instituțional
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nume@rau.ro" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="bg-background border-border focus:border-primary transition-smooth" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Parolă
            </Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-background border-border focus:border-primary transition-smooth" 
              required 
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-smooth"
          >
            {loading ? "Se procesează..." : (isLogin ? "Conectează-te" : "Creează cont")}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-smooth">
            {isLogin ? "Nu ai cont? Înregistrează-te" : "Ai deja cont? Conectează-te"}
          </button>
        </div>
      </Card>
    </div>;
};
export default Auth;