import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, Users, Trash2, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfileCard } from "@/components/UserProfileCard";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  faculty: string;
  year: number;
  course: string | null;
  description: string | null;
  member_count: number;
  is_member: boolean;
  created_by: string | null;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  faculty: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [year, setYear] = useState("all");
  const [course, setCourse] = useState("all");
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);

  // Students state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentFaculty, setStudentFaculty] = useState("all");

  const faculties = ["Contabilitate și Informatică de Gestiune", "Comunicare și Relații Publice", "Management", "Științe Economice"];
  const years = ["1", "2", "3", "4", "5"];

  // Get unique courses from groups
  const uniqueCourses = [...new Set(studyGroups.map(g => g.course).filter(Boolean))] as string[];

  const fetchGroups = async () => {
    try {
      const sessionData = await api.auth.getSession();
      if (sessionData.user) {
        setCurrentUserId(sessionData.user.id);
      }

      const groups = await api.groups.getAll();
      setStudyGroups(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await api.profiles.getAll();
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUserId) return;

    setJoiningGroupId(groupId);

    try {
      await api.groups.join(groupId);
      navigate(`/group/${groupId}/chat`);
    } catch (error: any) {
      if (error.message?.includes("Already a member")) {
        navigate(`/group/${groupId}/chat`);
      } else {
        toast({
          title: "Eroare",
          description: "Nu te-ai putut alătura grupului",
          variant: "destructive",
        });
      }
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleOpenChat = (groupId: string) => {
    navigate(`/group/${groupId}/chat`);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!currentUserId) return;

    setDeletingGroupId(groupId);

    try {
      await api.groups.delete(groupId);
      toast({
        title: "Succes",
        description: "Grupul a fost șters",
      });
      fetchGroups();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge grupul",
        variant: "destructive",
      });
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!currentUserId) return;

    setLeavingGroupId(groupId);

    try {
      await api.groups.leave(groupId);
      toast({
        title: "Succes",
        description: "Ai părăsit grupul",
      });
      fetchGroups();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu ai putut părăsi grupul",
        variant: "destructive",
      });
    } finally {
      setLeavingGroupId(null);
    }
  };

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = !faculty || faculty === "all" || group.faculty === faculty;
    const matchesYear = !year || year === "all" || group.year.toString() === year;
    const matchesCourse = !course || course === "all" || group.course === course;
    return matchesSearch && matchesFaculty && matchesYear && matchesCourse;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = !studentFaculty || studentFaculty === "all" || student.faculty === studentFaculty;
    return matchesSearch && matchesFaculty;
  });

  return (
    <ProtectedRoute>
      <UserProfileCard />
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 py-4 border-primary">
            <h1 className="font-bold bg-gradient-hero bg-clip-text mb-4 text-primary text-4xl my-0">
              Alvora
            </h1>

            {/* Instagram-style search bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Caută grupuri, studenți..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50 border-border/50 focus:bg-background transition-smooth py-0 px-[55px] mx-[3px] my-[5px]" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="groups" className="mt-4">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
                <TabsTrigger value="groups" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
                  Grupuri
                </TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
                  Studenți
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="mt-0">
                {/* Filters */}
                <Card className="p-4 mb-4 bg-background/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Filtre
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select value={faculty} onValueChange={setFaculty}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Facultate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate facultățile</SelectItem>
                        {faculties.map(f => <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="An" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toți anii</SelectItem>
                        {years.map(y => <SelectItem key={y} value={y}>
                            Anul {y}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>

                    <Select value={course} onValueChange={setCourse}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Curs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate cursurile</SelectItem>
                        {uniqueCourses.map(c => <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Create Group Button */}
                <div className="flex justify-end mb-4">
                  <CreateGroupDialog onGroupCreated={fetchGroups} />
                </div>

                {/* Results */}
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Se încarcă grupurile...
                    </div>
                  ) : filteredGroups.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nu s-au găsit grupuri.</p>
                      <p className="text-sm">Creează primul grup!</p>
                    </div>
                  ) : (
                    filteredGroups.map(group => (
                      <Card 
                        key={group.id} 
                        className="p-4 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-smooth cursor-pointer"
                        onClick={() => group.is_member ? handleOpenChat(group.id) : null}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">
                              {group.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {group.faculty} • Anul {group.year}
                              {group.course && ` • ${group.course}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {group.member_count} {group.member_count === 1 ? "membru" : "membri"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {group.is_member ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenChat(group.id);
                                  }}
                                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                  Deschide chat
                                </Button>
                                {/* Show leave button only if user is NOT the creator */}
                                {group.created_by !== currentUserId && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLeaveGroup(group.id);
                                    }}
                                    disabled={leavingGroupId === group.id}
                                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <LogOut className="h-4 w-4" />
                                  </Button>
                                )}
                                {/* Show delete button only if user is the creator */}
                                {group.created_by === currentUserId && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteGroup(group.id);
                                    }}
                                    disabled={deletingGroupId === group.id}
                                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinGroup(group.id);
                                }}
                                disabled={joiningGroupId === group.id}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-smooth"
                              >
                                {joiningGroupId === group.id ? "Se procesează..." : "Alătură-te"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="students" className="mt-0">
                {/* Students Filters */}
                <Card className="p-4 mb-4 bg-background/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Filtre
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={studentFaculty} onValueChange={setStudentFaculty}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Facultate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate facultățile</SelectItem>
                        {faculties.map(f => <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Students Results */}
                <div className="space-y-3">
                  {studentsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Se încarcă studenții...
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nu s-au găsit studenți.</p>
                    </div>
                  ) : (
                    filteredStudents.map(student => (
                      <Card 
                        key={student.id} 
                        className="p-4 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-smooth"
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">
                            {student.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.faculty}
                          </p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Search;