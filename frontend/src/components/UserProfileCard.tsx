import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface Profile {
  full_name: string;
  email: string;
  faculty: string;
}
export const UserProfileCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profiles.getMe();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = async () => {
    try {
      await api.auth.logout();
      toast({
        title: "Deconectat",
        description: "Te-ai deconectat cu succes."
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu te-am putut deconecta. Te rugăm să încerci din nou.",
        variant: "destructive"
      });
    }
  };
  if (!profile) return null;

  const initials = profile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile view - Avatar only */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Avatar 
          className="h-10 w-10 bg-primary cursor-pointer shadow-soft"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile expanded card */}
      {isExpanded && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
          <Card className="md:hidden fixed top-16 right-4 p-3 bg-background/95 backdrop-blur-sm border-border/50 shadow-soft z-50 animate-fade-in">
            <div className="gap-3 flex items-center justify-center">
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
                <p className="text-xs text-muted-foreground">{profile.faculty}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Desktop view - Full card */}
      <Card className="hidden md:block fixed top-4 right-4 p-3 bg-background/95 backdrop-blur-sm border-border/50 shadow-soft z-50">
        <div className="gap-3 flex items-center justify-center">
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-medium text-foreground">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground">{profile.faculty}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </>
  );
};