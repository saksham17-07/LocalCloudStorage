import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Cloud, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";

interface UserAccount {
  email: string;
  password: string;
  name: string;
}

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();

  // Initialize user database from localStorage
  const getUserDatabase = (): UserAccount[] => {
    const stored = localStorage.getItem("userDatabase");
    return stored ? JSON.parse(stored) : [];
  };

  const saveUserDatabase = (users: UserAccount[]) => {
    localStorage.setItem("userDatabase", JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic Validation
    if (!email.includes('@')) {
      setIsLoading(false);
      toast.error("Invalid email", {
        description: "Please enter a valid email address"
      });
      return;
    }

    if (password.length === 0) {
      setIsLoading(false);
      toast.error("Password required", {
        description: "Please enter your password"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const users = getUserDatabase();
      const user = users.find(u => u.email === email);

      if (!user) {
        setIsLoading(false);
        toast.error("Email not found", {
          description: "This email is not registered. Please sign up to create an account."
        });
        return;
      }

      if (user.password !== password) {
        setIsLoading(false);
        toast.error("Wrong password", {
          description: "The password you entered is incorrect. Please try again."
        });
        return;
      }

      // Login successful
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      toast.success("Welcome back!", {
        description: `Logged in as ${user.email}`
      });
      setLocation("/");
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic Validation
    if (!email.includes('@')) {
      setIsLoading(false);
      toast.error("Invalid email", {
        description: "Please enter a valid email address"
      });
      return;
    }

    if (password.length < 6) {
      setIsLoading(false);
      toast.error("Password too short", {
        description: "Password must be at least 6 characters"
      });
      return;
    }

    if (!name.trim()) {
      setIsLoading(false);
      toast.error("Name required", {
        description: "Please enter your full name"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const users = getUserDatabase();
      const existingUser = users.find(u => u.email === email);

      if (existingUser) {
        setIsLoading(false);
        toast.error("Email already registered", {
          description: "This email is already in use. Please log in instead."
        });
        return;
      }

      // Create new account
      const newUser: UserAccount = { email, password, name };
      const updatedUsers = [...users, newUser];
      saveUserDatabase(updatedUsers);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);

      setIsLoading(false);
      toast.success("Account created!", {
        description: `Welcome ${name}! Your account has been set up.`
      });
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Toaster position="bottom-right" />
      
      <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Cloud className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">MiniCloud</CardTitle>
          <CardDescription>
            Your personal local cloud storage workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 bg-background/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button className="w-full font-semibold shadow-md active:scale-[0.98] transition-transform mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="animate-pulse">Signing in...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="m@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 bg-background/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                <Button className="w-full font-semibold shadow-md active:scale-[0.98] transition-transform mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="animate-pulse">Creating account...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center px-8">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
