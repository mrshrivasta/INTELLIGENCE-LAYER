"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users, Plus, Send, CheckCircle2, Circle, Clock, ArrowLeft,
  MessageSquare, ClipboardList, UserPlus, Copy, X, Crown,
  GraduationCap, Sun, Moon, Sparkles
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  created_by: string;
  members: GroupMember[];
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  full_name: string;
  status: string;
  current_activity: string;
}

interface GroupMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  full_name: string;
}

interface GroupAssignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  progress: { user_id: string; full_name: string; status: string }[];
}

export default function GroupStudyPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [assignments, setAssignments] = useState<GroupAssignment[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentDesc, setNewAssignmentDesc] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "assignments" | "members">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserAndGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupData(selectedGroup.id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadUserAndGroups() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
    await updateUserStatus(user.id, "online", "Group Study");
    await loadGroups(user.id);
    setLoading(false);
  }

  async function updateUserStatus(userId: string, status: string, activity: string) {
    const supabase = createClient();
    await supabase.from("user_status").upsert({
      user_id: userId,
      status,
      current_activity: activity,
      last_activity: new Date().toISOString()
    }, { onConflict: "user_id" });
  }

  async function loadGroups(userId: string) {
    const supabase = createClient();
    const { data: memberData } = await supabase
      .from("study_group_members")
      .select("group_id")
      .eq("user_id", userId);

    if (memberData && memberData.length > 0) {
      const groupIds = memberData.map(m => m.group_id);
      const { data: groupsData } = await supabase
        .from("study_groups")
        .select("*")
        .in("id", groupIds);

      if (groupsData) {
        const groupsWithMembers = await Promise.all(groupsData.map(async (group) => {
          const { data: members } = await supabase
            .from("study_group_members")
            .select(`
              id, user_id, role,
              user_profiles!inner(full_name)
            `)
            .eq("group_id", group.id);

          const membersWithStatus = await Promise.all((members || []).map(async (m: any) => {
            const { data: status } = await supabase
              .from("user_status")
              .select("status, current_activity")
              .eq("user_id", m.user_id)
              .single();

            return {
              ...m,
              full_name: m.user_profiles?.full_name || "Unknown",
              status: status?.status || "offline",
              current_activity: status?.current_activity || ""
            };
          }));

          return { ...group, members: membersWithStatus };
        }));

        setGroups(groupsWithMembers);
      }
    }
  }

  async function loadGroupData(groupId: string) {
    const supabase = createClient();

    const { data: messagesData } = await supabase
      .from("group_messages")
      .select(`
        id, user_id, message, created_at,
        user_profiles!inner(full_name)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (messagesData) {
      setMessages(messagesData.map((m: any) => ({
        ...m,
        full_name: m.user_profiles?.full_name || "Unknown"
      })));
    }

    const { data: assignmentsData } = await supabase
      .from("group_assignments")
      .select("*")
      .eq("group_id", groupId)
      .order("due_date", { ascending: true });

    if (assignmentsData) {
      const assignmentsWithProgress = await Promise.all(assignmentsData.map(async (a) => {
        const { data: progressData } = await supabase
          .from("group_assignment_progress")
          .select(`
            user_id, status,
            user_profiles!inner(full_name)
          `)
          .eq("assignment_id", a.id);

        return {
          ...a,
          progress: (progressData || []).map((p: any) => ({
            user_id: p.user_id,
            full_name: p.user_profiles?.full_name || "Unknown",
            status: p.status
          }))
        };
      }));

      setAssignments(assignmentsWithProgress);
    }
  }

  async function createGroup() {
    if (!newGroupName.trim()) return;
    const supabase = createClient();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: group, error } = await supabase
      .from("study_groups")
      .insert({
        name: newGroupName,
        description: newGroupDesc,
        created_by: user.id,
        invite_code: inviteCode
      })
      .select()
      .single();

    if (group) {
      await supabase.from("study_group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "admin"
      });

      setShowCreateGroup(false);
      setNewGroupName("");
      setNewGroupDesc("");
      await loadGroups(user.id);
    }
  }

  async function joinGroup() {
    if (!joinCode.trim()) return;
    const supabase = createClient();

    const { data: group } = await supabase
      .from("study_groups")
      .select("id")
      .eq("invite_code", joinCode.toUpperCase())
      .single();

    if (group) {
      await supabase.from("study_group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "member"
      });

      setShowJoinGroup(false);
      setJoinCode("");
      await loadGroups(user.id);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedGroup) return;
    const supabase = createClient();

    await supabase.from("group_messages").insert({
      group_id: selectedGroup.id,
      user_id: user.id,
      message: newMessage
    });

    setNewMessage("");
    await loadGroupData(selectedGroup.id);
  }

  async function createAssignment() {
    if (!newAssignmentTitle.trim() || !selectedGroup) return;
    const supabase = createClient();

    const { data: assignment } = await supabase
      .from("group_assignments")
      .insert({
        group_id: selectedGroup.id,
        title: newAssignmentTitle,
        description: newAssignmentDesc,
        due_date: newAssignmentDue || null,
        created_by: user.id
      })
      .select()
      .single();

    if (assignment) {
      for (const member of selectedGroup.members) {
        await supabase.from("group_assignment_progress").insert({
          assignment_id: assignment.id,
          user_id: member.user_id,
          status: "pending"
        });
      }
    }

    setShowCreateAssignment(false);
    setNewAssignmentTitle("");
    setNewAssignmentDesc("");
    setNewAssignmentDue("");
    await loadGroupData(selectedGroup.id);
  }

  async function toggleAssignmentStatus(assignmentId: string) {
    const supabase = createClient();
    const assignment = assignments.find(a => a.id === assignmentId);
    const myProgress = assignment?.progress.find(p => p.user_id === user.id);
    const newStatus = myProgress?.status === "completed" ? "pending" : "completed";

    await supabase
      .from("group_assignment_progress")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("assignment_id", assignmentId)
      .eq("user_id", user.id);

    await loadGroupData(selectedGroup!.id);
  }

  const copyInviteCode = () => {
    if (selectedGroup) {
      navigator.clipboard.writeText(selectedGroup.invite_code);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Loading group study...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Group Study</h1>
              <p className="text-[10px] text-primary font-medium tracking-wide">COLLABORATE WITH FRIENDS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateGroup(true)} className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button onClick={() => setShowJoinGroup(true)} variant="outline" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Join
              </Button>
            </div>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No groups yet. Create or join one!</p>
                ) : (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedGroup?.id === group.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/30 border border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{group.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {group.members.length} <Users className="h-3 w-3 ml-1" />
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {group.members.slice(0, 3).map((m, i) => (
                          <div
                            key={m.id}
                            className={`h-2 w-2 rounded-full ${
                              m.status === "online" ? "bg-emerald-500" : "bg-muted-foreground/30"
                            }`}
                          />
                        ))}
                        {group.members.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{group.members.length - 3}</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedGroup ? (
              <Card className="bg-card/50 border-border backdrop-blur-sm h-[calc(100vh-180px)]">
                <CardHeader className="pb-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                        {selectedGroup.name}
                        <Badge variant="secondary" className="text-xs cursor-pointer" onClick={copyInviteCode}>
                          <Copy className="h-3 w-3 mr-1" />
                          {selectedGroup.invite_code}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                    </div>
                    <div className="flex gap-1">
                      {["chat", "assignments", "members"].map((tab) => (
                        <Button
                          key={tab}
                          variant={activeTab === tab ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setActiveTab(tab as any)}
                          className={activeTab === tab ? "" : "text-muted-foreground"}
                        >
                          {tab === "chat" && <MessageSquare className="h-4 w-4" />}
                          {tab === "assignments" && <ClipboardList className="h-4 w-4" />}
                          {tab === "members" && <Users className="h-4 w-4" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 h-[calc(100%-80px)] flex flex-col">
                  {activeTab === "chat" && (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${msg.user_id === user?.id ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                msg.user_id === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}>
                                {msg.user_id !== user?.id && (
                                  <p className="text-xs font-medium mb-1 opacity-70">{msg.full_name}</p>
                                )}
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-50 mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 bg-muted/30 border-border"
                        />
                        <Button onClick={sendMessage} className="bg-primary">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}

                  {activeTab === "assignments" && (
                    <div className="space-y-4 overflow-y-auto">
                      <Button onClick={() => setShowCreateAssignment(true)} variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                      {assignments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No assignments yet.</p>
                        </div>
                      ) : (
                        assignments.map((assignment) => {
                          const myProgress = assignment.progress.find(p => p.user_id === user?.id);
                          const completedCount = assignment.progress.filter(p => p.status === "completed").length;
                          return (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-4 rounded-xl border border-border bg-muted/30"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                                  {assignment.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                                  )}
                                  {assignment.due_date && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant={myProgress?.status === "completed" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleAssignmentStatus(assignment.id)}
                                  className={myProgress?.status === "completed" ? "bg-emerald-500" : ""}
                                >
                                  {myProgress?.status === "completed" ? (
                                    <><CheckCircle2 className="h-4 w-4 mr-1" /> Done</>
                                  ) : (
                                    <><Circle className="h-4 w-4 mr-1" /> Mark Done</>
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">Progress:</span>
                                {assignment.progress.map((p) => (
                                  <Badge
                                    key={p.user_id}
                                    variant="secondary"
                                    className={`text-xs ${
                                      p.status === "completed"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {p.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                    {p.full_name}
                                  </Badge>
                                ))}
                                <span className="text-xs text-primary ml-auto">
                                  {completedCount}/{assignment.progress.length} completed
                                </span>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTab === "members" && (
                    <div className="space-y-3 overflow-y-auto">
                      {selectedGroup.members.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {member.full_name?.charAt(0) || "?"}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                                member.status === "online" ? "bg-emerald-500" : "bg-muted-foreground/50"
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{member.full_name}</span>
                                {member.role === "admin" && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {member.status === "online" 
                                  ? member.current_activity || "Online"
                                  : "Offline"}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className={
                            member.status === "online"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          }>
                            {member.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/50 border-border backdrop-blur-sm h-[calc(100vh-180px)] flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Select a Group</h3>
                  <p className="text-muted-foreground mb-4">Choose a group from the sidebar or create a new one</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setShowCreateGroup(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                    <Button onClick={() => setShowJoinGroup(true)} variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Create Study Group</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateGroup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Group Name</label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Web Dev Study Squad"
                  className="mt-1 bg-muted/30 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description (optional)</label>
                <Input
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What's this group about?"
                  className="mt-1 bg-muted/30 border-border"
                />
              </div>
              <Button onClick={createGroup} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showJoinGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Join Study Group</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowJoinGroup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Invite Code</label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  className="mt-1 bg-muted/30 border-border uppercase"
                  maxLength={6}
                />
              </div>
              <Button onClick={joinGroup} className="w-full bg-gradient-to-r from-violet-500 to-purple-500">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Create Assignment</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateAssignment(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  placeholder="e.g., Complete React Tutorial"
                  className="mt-1 bg-muted/30 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description (optional)</label>
                <Input
                  value={newAssignmentDesc}
                  onChange={(e) => setNewAssignmentDesc(e.target.value)}
                  placeholder="Add details..."
                  className="mt-1 bg-muted/30 border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Due Date (optional)</label>
                <Input
                  type="datetime-local"
                  value={newAssignmentDue}
                  onChange={(e) => setNewAssignmentDue(e.target.value)}
                  className="mt-1 bg-muted/30 border-border"
                />
              </div>
              <Button onClick={createAssignment} className="w-full bg-gradient-to-r from-pink-500 to-rose-500">
                <ClipboardList className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <DeveloperWatermark />
    </div>
  );
}
