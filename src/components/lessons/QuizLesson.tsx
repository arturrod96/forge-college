import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // Or index, depending on how we store it
}

interface Props {
  quizData: QuizQuestion[];
}

export function QuizLesson({ quizData }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, maybe show final score or navigate
      alert(`Quiz Finished! Your score: ${score}/${quizData.length}`);
    }
  };

  if (!currentQuestion) {
    return <div className="text-red-500">No quiz data available.</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {quizData.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer}>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`option-${index}`} disabled={showResult} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {!showResult && (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="mt-6">
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className="mt-6">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="text-green-600 font-semibold">Correct!</p>
            ) : (
              <p className="text-red-600 font-semibold">Incorrect. The correct answer was: {currentQuestion.correctAnswer}</p>
            )}
            <Button onClick={handleNextQuestion} className="mt-4">
              {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
