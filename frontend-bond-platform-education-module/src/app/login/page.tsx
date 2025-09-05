"use client"

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard or portfolio after successful login
      window.location.href = "/portfolio";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">anyStockBroker</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <p className="text-gray-600">
                  {isLogin
                    ? "Sign in to access your bond portfolio"
                    : "Join thousands of smart bond investors"}
                </p>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Name field for signup */}
                  {!isLogin && (
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Phone field for signup */}
                  {!isLogin && (
                    <div>
                      <Label htmlFor="phone">
                        Mobile Number
                      </Label>
                      <div className="relative mt-1">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password field */}
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={
                          showPassword ? "text" : "password"
                        }
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password field for signup */}
                  {!isLogin && (
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirmPassword"
                          type={
                            showPassword ? "text" : "password"
                          }
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isLogin
                          ? "Signing in..."
                          : "Creating account..."}
                      </div>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  {/* Forgot Password (Login only) */}
                  {isLogin && (
                    <div className="text-center">
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}

                  {/* Switch between login/signup */}
                  <Separator />

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError("");
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                          setName("");
                          setPhone("");
                        }}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </form>

              </CardContent>
            </Card>
          </div>

      </div>
    </div>
  );
}
