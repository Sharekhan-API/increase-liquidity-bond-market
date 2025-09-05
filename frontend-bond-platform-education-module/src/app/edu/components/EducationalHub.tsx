import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Star,
  Clock,
  Users,
  FileText,
  Video,
  Award,
  ArrowLeft,
} from "lucide-react";
import { BondLearningFlow } from "./BondLearningFlow";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  topics: string[];
  type: "video" | "article" | "interactive" | "quiz";
}

export function EducationalHub() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLearningFlow, setShowLearningFlow] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [moduleProgress, setModuleProgress] = useState<{ [key: string]: { progress: number; isCompleted: boolean } }>({});

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('bondEducationProgress');
    if (savedProgress) {
      setModuleProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bondEducationProgress', JSON.stringify(moduleProgress));
  }, [moduleProgress]);

  const getModuleState = (moduleId: string, defaultProgress: number, defaultCompleted: boolean) => {
    const saved = moduleProgress[moduleId];
    return {
      progress: saved?.progress ?? defaultProgress,
      isCompleted: saved?.isCompleted ?? defaultCompleted
    };
  };

  const updateModuleProgress = (moduleId: string, progress: number, isCompleted: boolean) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: { progress, isCompleted }
    }));
  };

  const learningModules: LearningModule[] = [
    {
      id: "1",
      title: "Introduction to Bonds",
      description: "Learn the fundamentals of bond investing, what bonds are, and how they work",
      duration: "45 min",
      difficulty: "Beginner",
      ...getModuleState("1", 0, false),
      isLocked: false,
      topics: ["Bond Basics", "Types of Bonds", "Bond vs Stocks"],
      type: "video"
    },
    {
      id: "2",
      title: "Understanding Bond Pricing",
      description: "Deep dive into how bonds are priced and what affects bond valuations",
      duration: "60 min",
      difficulty: "Intermediate",
      ...getModuleState("2", 100, true),
      isLocked: false,
      topics: ["Present Value", "Interest Rates", "Credit Risk"],
      type: "interactive"
    },
    {
      id: "3",
      title: "Yield Calculations & Analysis",
      description: "Master different types of yields and how to calculate them",
      duration: "50 min",
      difficulty: "Intermediate",
      ...getModuleState("3", 45, false),
      isLocked: false,
      topics: ["Current Yield", "YTM", "YTC", "Spread Analysis"],
      type: "article"
    },
    {
      id: "4",
      title: "Credit Ratings Explained",
      description: "Understanding credit ratings, rating agencies, and what they mean for investors",
      duration: "40 min",
      difficulty: "Beginner",
      ...getModuleState("4", 100, true),
      isLocked: false,
      topics: ["Rating Agencies", "Rating Scale", "Default Risk"],
      type: "video"
    },
    {
      id: "5",
      title: "Types of Bonds",
      description: "Advanced concepts of bonds sensitivity and risk measurement",
      duration: "70 min",
      difficulty: "Advanced",
      ...getModuleState("5", 0, false),
      isLocked: true,
      topics: ["Modified Duration", "Convexity", "Hedging"],
      type: "interactive"
    },
    {
      id: "6",
      title: "Tax Implications of Bond Investing",
      description: "Navigate the tax landscape for bond investments in India",
      duration: "35 min",
      difficulty: "Intermediate",
      ...getModuleState("6", 0, false),
      isLocked: false,
      topics: ["Tax Treatment", "TDS", "Capital Gains"],
      type: "article"
    }
  ];

  const glossaryTerms = [
    { term: "Yield to Maturity (YTM)", definition: "The total return anticipated on a bond if held until maturity" },
    { term: "Coupon Rate", definition: "The annual interest rate paid by the bond issuer" },
    { term: "Duration", definition: "A measure of bond price sensitivity to interest rate changes" },
    { term: "Credit Spread", definition: "The difference in yield between a corporate bond and government bond" },
    { term: "Face Value", definition: "The principal amount that will be paid back at maturity" }
  ];

  const videoLibrary = [
    {
      title: "RBI Monetary Policy Explained",
      speaker: "Dr. Raghuram Rajan",
      duration: "25:30",
      views: "45K",
      rating: 4.8
    },
    {
      title: "Corporate Bond Market Outlook 2024",
      speaker: "Sanjay Sharma, CFA",
      duration: "18:45",
      views: "32K",
      rating: 4.6
    },
    {
      title: "Government Securities: Safe Haven Assets",
      speaker: "Priya Nair, Fixed Income Analyst",
      duration: "22:15",
      views: "28K",
      rating: 4.7
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "interactive": return <Play className="h-4 w-4" />;
      case "quiz": return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === "1") { // Introduction to Bonds module
      setSelectedModuleId(moduleId);
      setShowLearningFlow(true);
    }
    // Handle other modules as needed
  };

  const handleLearningFlowBack = () => {
    setShowLearningFlow(false);
    setSelectedModuleId(null);
  };

  const handleLearningFlowComplete = () => {
    // Update the module progress to completed
    if (selectedModuleId) {
      updateModuleProgress(selectedModuleId, 100, true);
    }
    setShowLearningFlow(false);
    setSelectedModuleId(null);
  };

  const handleLearningFlowProgress = (progress: number) => {
    // Update the module progress when user leaves mid-way
    if (selectedModuleId) {
      updateModuleProgress(selectedModuleId, progress, false);
    }
  };

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" ||
      activeFilter === module.difficulty.toLowerCase() ||
      (activeFilter === "completed" && module.isCompleted) ||
      (activeFilter === "in-progress" && module.progress > 0 && !module.isCompleted);
    return matchesSearch && matchesFilter;
  });

  if (showLearningFlow && selectedModuleId === "1") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleLearningFlowBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Educational Hub
            </Button>
          </div>
          <BondLearningFlow 
            onBack={handleLearningFlowBack}
            onComplete={handleLearningFlowComplete}
            onProgress={handleLearningFlowProgress}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Educational Hub</h1>
          <p className="text-gray-600">
            Master bond investing with comprehensive learning modules, expert insights, and practical case studies
          </p>
        </div>

        {/* Learning Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {learningModules.filter(m => m.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round(learningModules.reduce((acc, m) => acc + m.progress, 0) / learningModules.length)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {learningModules.filter(m => m.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {learningModules.filter(m => m.progress > 0).length * 2}h
                </div>
                <div className="text-sm text-gray-600">Learning Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Learning Modules</TabsTrigger>
            <TabsTrigger value="videos">Video Library</TabsTrigger>
            <TabsTrigger value="glossary">Glossary</TabsTrigger>
          </TabsList>

          {/* Learning Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {/* Modules Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <Card key={module.id} className={`relative ${module.isLocked ? 'opacity-60' : 'hover:shadow-lg transition-shadow cursor-pointer'}`}>
                  {module.isLocked && (
                    <div className="absolute top-4 right-4 z-10">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(module.type)}
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      {module.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </div>
                        <div className="text-gray-500">
                          {module.progress}% complete
                        </div>
                      </div>

                      <Progress value={module.progress} className="h-2" />

                      <div className="flex flex-wrap gap-1">
                        {module.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {module.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{module.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      {module.isLocked ? (
                        <Button disabled className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      ) : module.isCompleted ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleModuleClick(module.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      ) : module.progress > 0 ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleModuleClick(module.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleModuleClick(module.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Library Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoLibrary.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Video className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Video Content</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                      <Button size="lg" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {video.speaker}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {video.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {video.rating}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Glossary Tab */}
          <TabsContent value="glossary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bond Market Glossary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {glossaryTerms.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h3 className="font-medium mb-1">{item.term}</h3>
                      <p className="text-sm text-gray-600">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
