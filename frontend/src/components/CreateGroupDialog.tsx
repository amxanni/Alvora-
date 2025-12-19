import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
}

export const CreateGroupDialog = ({ onGroupCreated }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [faculty, setFaculty] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  const faculties = [
    "Contabilitate și Informatică de Gestiune",
    "Comunicare și Relații Publice",
    "Management",
    "Științe Economice",
  ];

  const years = ["1", "2", "3", "4", "5"];

  const handleCreate = async () => {
    if (!name.trim() || !faculty || !year) {
      toast({
        title: "Eroare",
        description: "Completează toate câmpurile obligatorii",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await api.groups.create(
        name.trim(),
        description.trim() || "",
        faculty,
        parseInt(year),
        course.trim() || undefined
      );

      toast({
        title: "Succes",
        description: "Grupul a fost creat cu succes!",
      });

      setName("");
      setDescription("");
      setFaculty("");
      setYear("");
      setCourse("");
      setOpen(false);
      onGroupCreated();
    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu s-a putut crea grupul",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Grup nou
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Creează un grup nou</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Numele grupului *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div>
            <Textarea
              placeholder="Descriere (opțional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 resize-none"
              rows={3}
            />
          </div>
          <div>
            <Select value={faculty} onValueChange={setFaculty}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Selectează facultatea *" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Selectează anul *" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    Anul {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Curs (opțional)"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Se creează..." : "Creează grupul"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};