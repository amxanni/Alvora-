import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Image, Paperclip, X, Download, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  group_id: string;
  user_id: string;
  text: string | null;
  file_url: string | null;
  file_name: string | null;
  type: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Group {
  id: string;
  name: string;
  faculty: string;
  year: number;
}

const GroupChat = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await api.auth.getSession();
        if (data.user) setCurrentUserId(data.user.id);
      } catch (err) {
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupAndMessages = async () => {
      try {
        const groupData = await api.groups.getById(groupId);
        setGroup(groupData);

        const messagesData = await api.messages.getByGroup(groupId);
        setMessages(messagesData);
      } catch (error) {
        toast({ title: "Eroare", description: "Grupul nu a fost găsit", variant: "destructive" });
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndMessages();

    const interval = setInterval(() => {
      api.messages.getByGroup(groupId).then((messagesData) => {
        setMessages(messagesData);
      }).catch(() => {});
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [groupId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (isImage && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string } | null> => {
    if (!groupId) return null;

    try {
      const result = await api.storage.upload(file, groupId);
      return { url: result.url, name: result.name };
    } catch (error) {
      toast({ title: "Eroare", description: "Nu s-a putut încărca fișierul", variant: "destructive" });
      return null;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    if (!currentUserId || !groupId) return;

    setUploading(true);

    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let messageType = "text";

      if (selectedFile) {
        const uploaded = await uploadFile(selectedFile);
        if (uploaded) {
          fileUrl = uploaded.url;
          fileName = uploaded.name;
          messageType = selectedFile.type.startsWith("image/") ? "image" : "file";
        }
      }

      await api.messages.send(
        groupId,
        newMessage.trim() || undefined,
        fileUrl || undefined,
        fileName || undefined,
        messageType
      );

      setNewMessage("");
      clearSelectedFile();

      const messagesData = await api.messages.getByGroup(groupId);
      setMessages(messagesData);
    } catch (error: any) {
      toast({ title: "Eroare", description: error.message || "Nu s-a putut trimite mesajul", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Se încarcă...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/search")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">{group?.name}</h1>
              <p className="text-xs text-muted-foreground">
                {group?.faculty} • Anul {group?.year}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Niciun mesaj încă.</p>
              <p className="text-sm">Fii primul care scrie!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.user_id === currentUserId;
              const userName = message.profiles?.full_name || "Utilizator";

              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] ${isOwn ? "order-first" : ""}`}>
                    {!isOwn && (
                      <p className="text-xs text-muted-foreground mb-1 ml-1">
                        {userName}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {message.type === "image" && message.file_url && (
                        <div className="relative inline-block">
                          <img
                            src={message.file_url}
                            alt="Imagine"
                            className="rounded-lg max-w-full mb-2 cursor-pointer"
                            onClick={() => window.open(message.file_url!, "_blank")}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className={`absolute top-1/2 -translate-y-1/2 h-8 w-8 bg-white border-primary text-primary hover:bg-white hover:text-primary z-10 shadow-sm ${
                              isOwn ? "right-full mr-6" : "left-full ml-6"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(message.file_url!, "_blank");
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {message.type === "file" && message.file_url && (
                        <div className="relative group">
                          <div className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                              isOwn ? "bg-primary-foreground/10" : "bg-background"
                            }`}>
                            <FileText className={`h-8 w-8 flex-shrink-0 ${isOwn ? "text-primary-foreground" : "text-primary"}`} />
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">{message.file_name}</span>
                              <span className={`text-[10px] uppercase ${isOwn ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                {message.file_name?.split('.').pop() || 'FILE'}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`absolute top-1/2 -translate-y-1/2 h-8 w-8 bg-white border-primary text-primary hover:bg-white hover:text-primary z-10 shadow-sm ${
                              isOwn ? "right-full mr-6" : "left-full ml-6"
                            }`}
                            onClick={() => window.open(message.file_url!, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {message.text && <p className="text-sm">{message.text}</p>}
                    </div>
                    <p
                      className={`text-[10px] text-muted-foreground mt-1 ${
                        isOwn ? "text-right mr-1" : "ml-1"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        Tu
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <div className="flex items-center gap-2">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
              ) : (
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={clearSelectedFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, true)}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
              className="hidden"
              onChange={(e) => handleFileSelect(e, false)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary"
            >
              <Image className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrie un mesaj..."
              className="flex-1 bg-muted/50 border-border/50"
              disabled={uploading}
            />
            <Button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && !selectedFile) || uploading}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GroupChat;
