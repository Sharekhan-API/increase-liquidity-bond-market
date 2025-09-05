import { useState } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  Target,
  Brain,
  DollarSign,
  TrendingUp,
  Shield,
  Building,
  Calendar,
  Award,
  Clock,
  Users,
  Lightbulb
} from "lucide-react";
// Remove ImageWithFallback import as it's not available in this context

interface LearningFlowProps {
  onBack: () => void;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'concept' | 'example' | 'quiz' | 'summary';
  content: React.ReactNode;
  keyPoints: string[];
  nextAction?: string;
}

export function BondLearningFlow({ onBack, onComplete, onProgress }: LearningFlowProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "What is a Bond?",
      duration: "5 min",
      type: "concept",
      keyPoints: [
        "A bond is a loan you give to companies or governments",
        "You receive regular interest payments",
        "Your principal is returned at maturity",
        "Bonds are generally safer than stocks"
      ],
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Building className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Bond Investment Concept</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-3">Think of it like this:</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Imagine your friend needs ₹10,000 for their business. You lend them the money with an agreement:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="text-blue-700 text-sm flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                They'll pay you ₹500 interest every 6 months
              </li>
              <li className="text-blue-700 text-sm flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                After 2 years, they'll return your full ₹10,000
              </li>
              <li className="text-blue-700 text-sm flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                This agreement is written down and can be traded
              </li>
            </ul>
            <p className="text-blue-700 text-sm mt-3 font-medium">
              That's exactly what a bond is - but with companies and governments!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">For Investors</h4>
              </div>
              <ul className="space-y-1">
                <li className="text-green-700 text-sm">• Regular income stream</li>
                <li className="text-green-700 text-sm">• Principal protection</li>
                <li className="text-green-700 text-sm">• Portfolio diversification</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-800">For Issuers</h4>
              </div>
              <ul className="space-y-1">
                <li className="text-purple-700 text-sm">• Raise capital for growth</li>
                <li className="text-purple-700 text-sm">• Fixed interest costs</li>
                <li className="text-purple-700 text-sm">• No ownership dilution</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Types of Bonds in India",
      duration: "7 min",
      type: "concept",
      keyPoints: [
        "Government bonds are the safest",
        "Corporate bonds offer higher yields",
        "Tax-free bonds provide tax benefits",
        "Different bonds suit different goals"
      ],
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800 mb-2">Government Bonds (G-Secs)</h4>
                    <p className="text-green-700 text-sm mb-3">
                      Issued by the Government of India. Considered the safest investment as they're backed by sovereign guarantee.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-green-600 font-medium">Risk:</span> Very Low
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Returns:</span> 6-8%
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Tenure:</span> 1-40 years
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Min Investment:</span> ₹10,000
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 mb-2">Corporate Bonds</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Issued by companies to fund business operations. Higher returns but with credit risk.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Risk:</span> Low to Moderate
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Returns:</span> 7-12%
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Tenure:</span> 1-10 years
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Min Investment:</span> ₹10,000-₹1L
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-800 mb-2">Tax-Free Bonds</h4>
                    <p className="text-orange-700 text-sm mb-3">
                      Interest income is exempt from tax. Issued by government entities for infrastructure projects.
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-orange-600 font-medium">Risk:</span> Very Low
                      </div>
                      <div>
                        <span className="text-orange-600 font-medium">Returns:</span> 4-6% (tax-free)
                      </div>
                      <div>
                        <span className="text-orange-600 font-medium">Tenure:</span> 10-20 years
                      </div>
                      <div>
                        <span className="text-orange-600 font-medium">Min Investment:</span> ₹10,000
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Which Bond Type for You?</h4>
            </div>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>Conservative investors:</strong> Start with Government bonds</p>
              <p><strong>Moderate risk-takers:</strong> Mix of Government + AAA corporate bonds</p>
              <p><strong>High tax bracket:</strong> Consider tax-free bonds</p>
              <p><strong>Short-term goals:</strong> Treasury Bills (T-Bills)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Real-World Example",
      duration: "5 min",
      type: "example",
      keyPoints: [
        "See how bond investing works in practice",
        "Understand cash flows and returns",
        "Learn about market price fluctuations",
        "Calculate actual returns"
      ],
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-4">Meet Priya's Bond Investment Journey</h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">January 2023 - Purchase</span>
                </div>
                <p className="text-sm text-gray-700">
                  Priya buys ₹1,00,000 worth of HDFC Bank bonds with 8% annual coupon rate,
                  maturing in January 2028 (5 years).
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Every 6 Months - Interest</span>
                </div>
                <p className="text-sm text-gray-700">
                  Priya receives ₹4,000 every 6 months (₹8,000 annually) as interest income.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">January 2028 - Maturity</span>
                </div>
                <p className="text-sm text-gray-700">
                  HDFC Bank returns her original ₹1,00,000 principal amount.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-medium text-green-800 mb-3">Priya's Total Returns</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Interest Income (5 years)</div>
                <div className="text-lg font-bold text-green-600">₹40,000</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Principal Repayment</div>
                <div className="text-lg font-bold text-green-600">₹1,00,000</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Amount Received</div>
                <div className="text-xl font-bold text-green-600">₹1,40,000</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Return</div>
                <div className="text-xl font-bold text-green-600">40%</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">What if Interest Rates Change?</h4>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
              If RBI reduces rates to 6%, new bonds will offer lower returns. Priya's 8% bond becomes more valuable!
            </p>
            <div className="text-yellow-700 text-sm">
              <p><strong>Bond price increases:</strong> She could sell for ₹1,05,000+ before maturity</p>
              <p><strong>If rates increase to 10%:</strong> Her bond price would decrease, but she still gets 8% if held to maturity</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Knowledge Check",
      duration: "3 min",
      type: "quiz",
      keyPoints: [
        "Test your understanding",
        "Reinforce key concepts",
        "Identify areas for review",
        "Build confidence"
      ],
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Question 1: What is the main benefit of investing in bonds?</h4>
                <div className="space-y-2">
                  {[
                    "High capital appreciation potential",
                    "Regular income through interest payments",
                    "Complete tax exemption",
                    "No risk of loss"
                  ].map((option, index) => (
                    <label key={index} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="q1"
                        value={option}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, q1: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Question 2: Which type of bond is considered the safest in India?</h4>
                <div className="space-y-2">
                  {[
                    "Corporate bonds from private companies",
                    "Government bonds (G-Secs)",
                    "Municipal bonds",
                    "Foreign currency bonds"
                  ].map((option, index) => (
                    <label key={index} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="q2"
                        value={option}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, q2: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Question 3: If you buy a ₹10,000 bond with 6% annual coupon, how much interest will you receive per year?</h4>
                <div className="space-y-2">
                  {[
                    "₹60",
                    "₹600",
                    "₹6,000",
                    "₹1,000"
                  ].map((option, index) => (
                    <label key={index} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="q3"
                        value={option}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, q3: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {Object.keys(quizAnswers).length === 3 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Quiz Results</h4>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${quizAnswers.q1 === "Regular income through interest payments" ? "text-green-600" : "text-red-600"}`}>
                  {quizAnswers.q1 === "Regular income through interest payments" ? <CheckCircle className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  <span>Question 1: {quizAnswers.q1 === "Regular income through interest payments" ? "Correct!" : "Incorrect. The main benefit is regular income."}</span>
                </div>
                <div className={`flex items-center gap-2 ${quizAnswers.q2 === "Government bonds (G-Secs)" ? "text-green-600" : "text-red-600"}`}>
                  {quizAnswers.q2 === "Government bonds (G-Secs)" ? <CheckCircle className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  <span>Question 2: {quizAnswers.q2 === "Government bonds (G-Secs)" ? "Correct!" : "Incorrect. Government bonds are the safest."}</span>
                </div>
                <div className={`flex items-center gap-2 ${quizAnswers.q3 === "₹600" ? "text-green-600" : "text-red-600"}`}>
                  {quizAnswers.q3 === "₹600" ? <CheckCircle className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  <span>Question 3: {quizAnswers.q3 === "₹600" ? "Correct!" : "Incorrect. 6% of ₹10,000 = ₹600."}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 5,
      title: "Module Summary & Next Steps",
      duration: "3 min",
      type: "summary",
      keyPoints: [
        "You've learned bond fundamentals",
        "Ready to explore different bond types",
        "Understand risk-return relationship",
        "Know how to evaluate bonds"
      ],
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">Congratulations!</h3>
            <p className="text-gray-600">You've completed the Introduction to Bonds module</p>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-blue-800 mb-3">What You've Learned</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">What bonds are and how they work</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Different types of bonds in India</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">How bond investments generate returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Risk levels of different bond types</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Recommended Next Modules</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Understanding Bond Pricing</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Yield Calculations & Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Credit Ratings Explained</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Practice & Apply</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Take the Bond Basics Quiz</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Explore Bond Case Studies</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Browse Available Bonds</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={onComplete} size="lg" className="w-full md:w-auto">
              <Award className="h-4 w-4 mr-2" />
              Complete Module & Earn Certificate
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentLesson = lessons[currentLessonIndex];
  const progressPercentage = ((completedLessons.size) / lessons.length) * 100;

  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      updateProgress();
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      updateProgress();
    }
  };

  const updateProgress = () => {
    const progress = Math.round(((currentLessonIndex + 1) / lessons.length) * 100);
    onProgress?.(progress);
  };

  const markLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    if (currentLessonIndex === lessons.length - 1) {
      onComplete();
    } else {
      nextLesson();
    }
  };

  // Update progress when component mounts or lesson changes
  React.useEffect(() => {
    updateProgress();
  }, [currentLessonIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Introduction to Bonds</h1>
            <p className="text-gray-600">Learn the fundamentals of bond investing</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-gray-600">{completedLessons.size} of {lessons.length} lessons completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Lesson Navigation */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => setCurrentLessonIndex(index)}
              disabled={index > currentLessonIndex && !completedLessons.has(lesson.id)}
              className={`p-2 rounded-lg text-sm transition-colors ${index === currentLessonIndex
                  ? 'bg-blue-600 text-white'
                  : completedLessons.has(lesson.id)
                    ? 'bg-green-100 text-green-800'
                    : index <= currentLessonIndex
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              <div className="flex items-center justify-center mb-1">
                {completedLessons.has(lesson.id) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : lesson.type === 'concept' ? (
                  <BookOpen className="h-4 w-4" />
                ) : lesson.type === 'example' ? (
                  <Lightbulb className="h-4 w-4" />
                ) : lesson.type === 'quiz' ? (
                  <Target className="h-4 w-4" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
              </div>
              <div className="font-medium">{lesson.id}</div>
            </button>
          ))}
        </div>

        {/* Current Lesson */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentLesson.type === 'concept' && <BookOpen className="h-5 w-5 text-blue-600" />}
                  {currentLesson.type === 'example' && <Lightbulb className="h-5 w-5 text-yellow-600" />}
                  {currentLesson.type === 'quiz' && <Target className="h-5 w-5 text-purple-600" />}
                  {currentLesson.type === 'summary' && <Award className="h-5 w-5 text-green-600" />}
                  Lesson {currentLesson.id}: {currentLesson.title}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {currentLesson.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {currentLesson.duration}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Lesson Content */}
            <div className="mb-6">
              {currentLesson.content}
            </div>

            {/* Key Points */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {currentLesson.keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={previousLesson}
                disabled={currentLessonIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={markLessonComplete}
              >
                {currentLessonIndex === lessons.length - 1 ? (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Complete Module
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}