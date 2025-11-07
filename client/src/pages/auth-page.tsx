import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
// Removed local form and tabs – we use simple Supabase-only cards

// Local validation handled inline for Supabase-only forms

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Supabase-only – no local register/login handlers

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <i className="fas fa-leaf text-primary text-3xl"></i>
              <span className="text-2xl font-bold text-foreground">EcoConnect</span>
            </div>
            <p className="text-muted-foreground">Join our community to reduce food waste</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}> 
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-3 mb-4 text-sm text-muted-foreground">
                Local username/password login is disabled. Please use the email login below.
              </div>
              <div className="mt-6 space-y-3">
                <div className="text-center text-xs text-muted-foreground">or</div>
                <SupabaseLoginBlock />
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="space-y-3 mb-4 text-sm text-muted-foreground">
                Local registration is disabled. Please sign up using email verification below.
              </div>
              <SupabaseRegisterInline />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center p-12 text-white">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Reducing Food Waste Together</h2>
          <p className="text-xl mb-8 text-white/90">
            Join EcoConnect to make a real difference in your community. Whether you're a restaurant with surplus food,
            an NGO distributing meals, or a volunteer ready to help, we connect you with the right partners.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <i className="fas fa-check-circle text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-lg">Real-Time Tracking</h4>
                <p className="text-white/80">Monitor food availability and distribution in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="fas fa-check-circle text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-lg">Community Impact</h4>
                <p className="text-white/80">See the tangible difference you're making with every meal saved</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="fas fa-check-circle text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-lg">Easy Coordination</h4>
                <p className="text-white/80">Seamlessly manage pickups and deliveries through our platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupabaseRegisterInline() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("volunteer");
  const [organizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const redirect = (import.meta.env.VITE_SUPABASE_EMAIL_REDIRECT as string) || `${window.location.origin}/auth`;

  async function onRegister() {
    const em = email.trim();
    const pw = password.trim();
    if (!em || !pw) return alert("Please enter email and password");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, password: pw, role }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return alert(`Registration failed: ${body.error || res.statusText}`);
    alert("User registered and verified successfully. You can log in now.");
  }

  async function onResend() {
    const em = email.trim();
    if (!em) return alert("Please enter your email first");
    const { data, error } = await supabase.auth.resend({ type: "signup", email: em });
    if (error) alert(`❌ ${error.message}`);
    else alert("✅ Verification email sent again!");
  }

  return (
    <div className="space-y-3">
      <Label>Username</Label>
      <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourusername" />
      <Label>Email</Label>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <Label>Password</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <Label>Role</Label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="restaurant">Restaurant</SelectItem>
          <SelectItem value="ngo">NGO</SelectItem>
          <SelectItem value="volunteer">Volunteer</SelectItem>
        </SelectContent>
      </Select>
      <Label>Organization Name</Label>
      <Input type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Green Bites" />
      <Label>Phone Number</Label>
      <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 9876543210" />
      <Label>Address</Label>
      <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Knowledge Park 3, Sharda University, 201310" />
      <Button variant="outline" onClick={onRegister} className="w-full">Sign up</Button>
      <Button variant="ghost" onClick={onResend} className="w-full">Resend verification email</Button>
      <p className="text-xs text-muted-foreground">We’ll associate your role when you first log in.</p>
    </div>
  );
}

function SupabaseLoginBlock() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("volunteer");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const em = email.trim();
    const pw = password.trim();
    if (!em || !pw) return alert("Enter email and password");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, password: pw, role }),
      credentials: "include",
    });
    if (!res.ok) {
      const msg = await res.text();
      return alert(`Login failed: ${msg}`);
    }
    // Update client auth cache so ProtectedRoute recognizes session
    try {
      const { user } = await res.json();
      queryClient.setQueryData(["/api/user"], user);
      // Confirm session cookie works before redirect
      await fetch("/api/user", { credentials: "include" });
    } catch {}
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onLogin} className="space-y-3">
      <h3 className="text-lg font-semibold">Login</h3>
      <Label>Email</Label>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      <Label>Password</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <Label>Role (for first-time linking)</Label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="restaurant">Restaurant</SelectItem>
          <SelectItem value="ngo">NGO</SelectItem>
          <SelectItem value="volunteer">Volunteer</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" className="w-full">Login</Button>
    </form>
  );
}
