import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Target,
  PieChart,
  TrendingUp,
  Bell,
  User,
  Menu,
  X,
  Star,
  Award
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: "education",
      label: "Learn",
      icon: BookOpen,
      badge: null
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: Target,
      badge: null
    },
    {
      id: "search",
      label: "Explore Bonds",
      icon: Search,
      badge: null
    },
    {
      id: "suggestions",
      label: "Suggestions",
      icon: PieChart,
      badge: "New"
    },
  ];

  const userStats = {
    name: "Anant Dubey",
    level: "Intermediate",
    points: 1850,
    streak: 7
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4">
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

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className="relative"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 pl-4">
            <div className="text-right">
              <div className="font-medium text-sm">{userStats.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{userStats.level}</Badge>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {userStats.points}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-lg text-blue-600">SEBI Edu</div>
            </div>

            {/* User Info & Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium text-sm">{userStats.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {userStats.points}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeView === item.id ? "default" : "ghost"}
                      onClick={() => {
                        onViewChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start relative"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto bg-green-500 text-white text-xs px-1 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <div className="font-medium text-sm">Learning Progress</div>
                    <div className="text-xs text-gray-500">Intermediate Level</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      4 Badges
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col gap-1 h-auto py-2 relative ${activeView === item.id ? "text-blue-600 bg-blue-50" : "text-gray-600"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
