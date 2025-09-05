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
  TrendingUp,
} from "lucide-react";

export default function EduLoginPage() {
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
      // Redirect to edu route after successful login
      window.location.href = "/edu";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Edu Header - Same as Navigation component */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-blue-600">SEBI Edu</div>
              <div className="text-xs text-gray-500">Master Indian Bonds</div>
            </div>
          </div>

          {/* Right side - empty for login page */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Educational Platform
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? "Welcome to SEBI Edu" : "Join SEBI Edu"}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to continue your bond learning journey"
                  : "Start your bond education journey today"}
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
                    "Sign In to SEBI Edu"
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
                      ? "New to bond education?"
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

        {/* Educational Features Preview */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Master Bond Investing with SEBI Edu
            </h2>
            <p className="text-gray-600">
              Comprehensive learning platform for Indian bond markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Interactive Learning</h3>
                <p className="text-sm text-gray-600">
                  Learn through interactive modules, quizzes, and real-world case studies
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Expert Insights</h3>
                <p className="text-sm text-gray-600">
                  Access expert analysis and market insights from industry professionals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Practical Tools</h3>
                <p className="text-sm text-gray-600">
                  Use bond calculators, search tools, and portfolio analyzers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
