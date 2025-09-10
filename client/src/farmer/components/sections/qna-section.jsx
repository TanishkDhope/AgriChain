import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { MessageCircle, ThumbsUp, Send, Plus } from "lucide-react"

const initialQA = [
  {
    id: "q1",
    question: "How to store tomatoes to increase shelf life?",
    answers: [
      { id: "a1", text: "Keep them at room temperature and avoid direct sunlight for better ripening.", helpful: 4 },
      { id: "a2", text: "Do not refrigerate unless fully ripe. Cold temperatures affect taste.", helpful: 2 },
    ],
  },
  {
    id: "q2", 
    question: "Best fertilizer for organic vegetable farming?",
    answers: [
      { id: "a3", text: "Compost and vermicompost work excellently for organic vegetables.", helpful: 6 },
    ],
  },
]

export default function QnASection() {
  const [qa, setQa] = useState(initialQA)
  const [qText, setQText] = useState("")
  const [aText, setAText] = useState({})

  const ask = () => {
    if (!qText.trim()) return
    setQa((prev) => [{ id: crypto.randomUUID(), question: qText.trim(), answers: [] }, ...prev])
    setQText("")
  }

  const answer = (qid) => {
    const text = (aText[qid] || "").trim()
    if (!text) return
    setQa((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, answers: [...q.answers, { id: crypto.randomUUID(), text, helpful: 0 }] }
          : q
      )
    )
    setAText((m) => ({ ...m, [qid]: "" }))
  }

  const markHelpful = (qid, aid) => {
    setQa((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, answers: q.answers.map((a) => (a.id === aid ? { ...a, helpful: a.helpful + 1 } : a)) }
          : q
      )
    )
  }

  return (
    <section 
      id="queries" 
      className="py-16 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Community Q&A</h2>
          <p className="text-gray-600">Ask questions, share answers, and mark helpful tips</p>
        </div>

        {/* Ask Question */}
        <Card className="border-0 shadow-sm mb-10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Ask a Question</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="What would you like to know about farming, produce storage, or market trends?"
              className="border-gray-200"
              rows={4}
            />
            <Button 
              onClick={ask} 
              disabled={!qText.trim()}
              className="h-12 text-base"
            >
              <Send className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </CardContent>
        </Card>

        {/* Questions & Answers */}
        <div className="space-y-6 mb-10">
          {qa.map((q) => (
            <Card key={q.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{q.question}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Answers */}
                <div className="space-y-4 mb-6">
                  {q.answers.length > 0 ? (
                    q.answers.map((a) => (
                      <div key={a.id} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 mb-3">{a.text}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markHelpful(q.id, a.id)}
                          className="text-gray-600 hover:bg-gray-100"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({a.helpful})
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No answers yet. Be the first to help!</p>
                    </div>
                  )}
                </div>

                {/* Add Answer */}
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Textarea
                      value={aText[q.id] || ""}
                      onChange={(e) => setAText({ ...aText, [q.id]: e.target.value })}
                      placeholder="Share your knowledge and help fellow farmers..."
                      className="border-gray-200"
                      rows={3}
                    />
                    <Button
                      onClick={() => answer(q.id)}
                      size="sm"
                      disabled={!aText[q.id]?.trim()}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Post Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats - Same as retailer style */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600 mb-2">{qa.length}</p>
                <p className="text-sm text-blue-700">Total Questions</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {qa.reduce((sum, q) => sum + q.answers.length, 0)}
                </p>
                <p className="text-sm text-green-700">Total Answers</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {qa.reduce((sum, q) => sum + q.answers.reduce((aSum, a) => aSum + a.helpful, 0), 0)}
                </p>
                <p className="text-sm text-purple-700">Helpful Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
