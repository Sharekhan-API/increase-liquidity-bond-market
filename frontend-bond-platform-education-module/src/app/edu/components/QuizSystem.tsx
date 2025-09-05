import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Brain,
  Award,
  TrendingUp,
  Users,
  Play,
  RefreshCw
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questionCount: number;
  estimatedTime: string;
  topics: string[];
  badge?: string;
  points: number;
  attempts: number;
  bestScore?: number;
}

export function QuizSystem() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quizzes: Quiz[] = [
    {
      id: "basics",
      title: "Bond Basics Assessment",
      description: "Test your understanding of fundamental bond concepts",
      difficulty: "Beginner",
      questionCount: 10,
      estimatedTime: "15 min",
      topics: ["Bond Types", "Basic Terminology", "Risk Factors"],
      badge: "Bond Novice",
      points: 100,
      attempts: 0,
      bestScore: undefined
    },
    {
      id: "pricing",
      title: "Bond Pricing & Valuation",
      description: "Advanced concepts in bond pricing and yield calculations",
      difficulty: "Intermediate",
      questionCount: 15,
      estimatedTime: "25 min",
      topics: ["Present Value", "YTM", "Duration", "Convexity"],
      badge: "Quiz Master",
      points: 200,
      attempts: 2,
      bestScore: 85
    },
    {
      id: "ratings",
      title: "Credit Analysis & Ratings",
      description: "Deep dive into credit risk assessment and rating methodologies",
      difficulty: "Intermediate",
      questionCount: 12,
      estimatedTime: "20 min",
      topics: ["Credit Risk", "Rating Agencies", "Default Probability"],
      badge: "Knowledge Seeker",
      points: 150,
      attempts: 1,
      bestScore: 92
    },
    {
      id: "portfolio",
      title: "Bond Portfolio Management",
      description: "Strategic approach to building and managing bond portfolios",
      difficulty: "Advanced",
      questionCount: 20,
      estimatedTime: "35 min",
      topics: ["Asset Allocation", "Hedging", "Performance Measurement"],
      badge: "Portfolio Master",
      points: 300,
      attempts: 0,
      bestScore: undefined
    },
    {
      id: "tax",
      title: "Tax Implications Quiz",
      description: "Navigate the complex tax landscape of bond investing",
      difficulty: "Intermediate",
      questionCount: 8,
      estimatedTime: "12 min",
      topics: ["Tax Treatment", "TDS", "Capital Gains"],
      badge: "Tax Expert",
      points: 120,
      attempts: 0,
      bestScore: undefined
    }
  ];

  const sampleQuestions: Question[] = [
    {
      id: "1",
      question: "What is the relationship between bond prices and interest rates?",
      options: [
        "Bond prices and interest rates move in the same direction",
        "Bond prices and interest rates move in opposite directions",
        "There is no relationship between bond prices and interest rates",
        "The relationship depends on the bond's credit rating"
      ],
      correctAnswer: 1,
      explanation: "Bond prices and interest rates have an inverse relationship. When interest rates rise, bond prices fall, and vice versa. This is because existing bonds with lower rates become less attractive when new bonds offer higher rates.",
      difficulty: "Easy",
      topic: "Bond Basics"
    },
    {
      id: "2",
      question: "Which of the following represents the highest credit quality?",
      options: [
        "BBB+",
        "AA-",
        "AAA",
        "A+"
      ],
      correctAnswer: 2,
      explanation: "AAA represents the highest credit quality rating, indicating the lowest risk of default. The rating scale typically goes from AAA (highest) down to D (default).",
      difficulty: "Easy",
      topic: "Credit Ratings"
    },
    {
      id: "3",
      question: "What does YTM (Yield to Maturity) represent?",
      options: [
        "The current yield of the bond",
        "The total return anticipated if the bond is held until maturity",
        "The coupon rate of the bond",
        "The bond's face value"
      ],
      correctAnswer: 1,
      explanation: "YTM represents the total return anticipated on a bond if held until maturity, assuming all coupon payments are reinvested at the same rate.",
      difficulty: "Medium",
      topic: "Yield Calculations"
    }
  ];

  const leaderboard = [
    { name: "Rajesh Kumar", score: 2850, badges: 8, streak: 15 },
    { name: "Priya Sharma", score: 2720, badges: 7, streak: 12 },
    { name: "Amit Patel", score: 2650, badges: 6, streak: 8 },
    { name: "Sunita Singh", score: 2400, badges: 5, streak: 20 },
    { name: "You", score: 1850, badges: 4, streak: 7 }
  ];

  const userStats = {
    totalQuizzes: 8,
    averageScore: 87,
    totalPoints: 1850,
    badges: 4,
    currentStreak: 7,
    bestStreak: 12,
    rank: 5,
    totalParticipants: 2847
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": case "Easy": return "bg-green-100 text-green-800";
      case "Intermediate": case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Advanced": case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    sampleQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const calculatedScore = Math.round((correctAnswers / sampleQuestions.length) * 100);
    setScore(calculatedScore);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
  };

  if (selectedQuiz && !quizCompleted) {
    const currentQuestion = sampleQuestions[currentQuestionIndex];
    const quiz = quizzes.find(q => q.id === selectedQuiz);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Quiz Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{quiz?.title}</h1>
                  <p className="text-gray-600">Question {currentQuestionIndex + 1} of {sampleQuestions.length + 7}</p>
                </div>
                <Button variant="outline" onClick={restartQuiz}>
                  Exit Quiz
                </Button>
              </div>
              <Progress value={((currentQuestionIndex + 1) / sampleQuestions.length) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.topic}</Badge>
              </div>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion.id] === undefined}
                >
                  {currentQuestionIndex === sampleQuestions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const correctAnswers = sampleQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Results Header */}
          <Card className="mb-6 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-4">
                {score >= 80 ? (
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                ) : score >= 60 ? (
                  <Award className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                ) : (
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
              <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600 mb-4">
                You got {correctAnswers} out of {sampleQuestions.length} questions correct
              </p>

              {score >= 80 && (
                <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                  🏆 Excellent Performance!
                </Badge>
              )}

              <div className="flex justify-center gap-4">
                <Button onClick={restartQuiz}>
                  Try Another Quiz
                </Button>
                <Button variant="outline" onClick={() => startQuiz(selectedQuiz!)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Q{index + 1}.</span>
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>

                      <p className="mb-3">{question.question}</p>

                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${optionIndex === question.correctAnswer
                                ? 'bg-green-100 border border-green-300'
                                : optionIndex === userAnswer && !isCorrect
                                  ? 'bg-red-100 border border-red-300'
                                  : 'bg-gray-50'
                              }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <Badge className="ml-2 bg-green-600">Correct</Badge>
                            )}
                            {optionIndex === userAnswer && !isCorrect && (
                              <Badge variant="destructive" className="ml-2">Your Answer</Badge>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="font-medium text-blue-800 text-sm mb-1">Explanation:</div>
                        <div className="text-blue-700 text-sm">{question.explanation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Knowledge Quiz Center</h1>
          <p className="text-gray-600">
            Test your bond market knowledge, earn points, and compete with fellow learners
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Your Quiz Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalQuizzes}</div>
                    <div className="text-sm text-gray-600">Quizzes Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{userStats.averageScore}%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.totalPoints}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">#{userStats.rank}</div>
                    <div className="text-sm text-gray-600">Global Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Quizzes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{quiz.title}</h3>
                            <Badge className={getDifficultyColor(quiz.difficulty)}>
                              {quiz.difficulty}
                            </Badge>
                            {quiz.badge && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                🏆 {quiz.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {quiz.questionCount} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {quiz.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {quiz.points} points
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {quiz.topics.map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          {quiz.bestScore && (
                            <div className="text-sm text-green-600">
                              Best Score: {quiz.bestScore}% ({quiz.attempts} attempts)
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => startQuiz(quiz.id)}
                        className="w-full sm:w-auto"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {quiz.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-medium">Perfect Score</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">📚</div>
                    <div className="text-xs font-medium">Knowledge Seeker</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-medium">Speed Demon</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-medium">Quiz Master</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((user, index) => (
                    <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${user.name === 'You' ? 'bg-blue-50 border border-blue-200' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-white' :
                              'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{user.name}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                      {user.score} points
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-center text-gray-500 mt-3">
                  {userStats.totalParticipants.toLocaleString()} total participants
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
