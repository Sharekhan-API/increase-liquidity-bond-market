"use client";

import { useState } from "react";
import { EducationalHub } from "./components/EducationalHub";
import { BondSearch } from "./components/BondSearch";
import { QuizSystem } from "./components/QuizSystem";
import { PortfolioSuggestion } from "./components/PortfolioSuggestion";
import { Navigation } from "./components/Navigation";

export default function EduPage() {
  const [activeView, setActiveView] = useState("education");

  const renderActiveView = () => {
    switch (activeView) {
      case "search":
        return <BondSearch />;
      case "education":
        return <EducationalHub />;
      case "quiz":
        return <QuizSystem />;
      case "suggestions":
        return <PortfolioSuggestion />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      {renderActiveView()}
    </div>
  );
}
