"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, TrendingUp, Heart, MessageCircle } from "lucide-react"

interface CrisisEvent {
  id: string
  time: string
  date: string
  intensity: number
  duration: number
  triggers: string[]
  symptoms: string[]
  copingStrategies: string[]
  notes: string
  location: string
  beforeMood: number
  afterMood: number
}

interface EmotionEvent {
  id: string
  emotion: string
  intensity: number
  duration: number
  triggers: string[]
  physicalSensations: string[]
  thoughts: string[]
  behaviors: string[]
  context: string
  timestamp: string
  color: string
}

interface CrisisEmotionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "crisis" | "emotion"
  data: CrisisEvent | EmotionEvent | null
}

// Mock detailed data
const mockCrisisDetails: Record<string, CrisisEvent> = {
  "crisis-1": {
    id: "crisis-1",
    time: "09:30",
    date: "2025-07-20",
    intensity: 8,
    duration: 15,
    triggers: ["Work deadline", "Lack of sleep", "Conflict with colleague"],
    symptoms: ["Rapid heartbeat", "Sweating", "Difficulty breathing", "Trembling"],
    copingStrategies: ["Deep breathing", "Called support person", "Used grounding technique"],
    notes: "Patient experienced panic attack during morning meeting. Applied learned coping strategies effectively.",
    location: "Office conference room",
    beforeMood: 4,
    afterMood: 6,
  },
  "crisis-2": {
    id: "crisis-2",
    time: "14:20",
    date: "2025-07-21",
    intensity: 6,
    duration: 8,
    triggers: ["Unexpected phone call", "Financial concerns"],
    symptoms: ["Chest tightness", "Racing thoughts", "Nausea"],
    copingStrategies: ["Progressive muscle relaxation", "Mindfulness meditation"],
    notes: "Shorter episode, patient showed improved self-regulation skills.",
    location: "Home",
    beforeMood: 5,
    afterMood: 7,
  },
  "crisis-3": {
    id: "crisis-3",
    time: "19:45",
    date: "2025-07-22",
    intensity: 9,
    duration: 22,
    triggers: ["Social gathering", "Fear of judgment", "Crowded environment"],
    symptoms: ["Dizziness", "Hot flashes", "Feeling of unreality", "Urge to escape"],
    copingStrategies: ["Stepped outside", "Used breathing app", "Contacted therapist"],
    notes: "Most severe episode this week. Patient successfully used emergency coping plan.",
    location: "Restaurant",
    beforeMood: 3,
    afterMood: 5,
  },
}

const mockEmotionDetails: Record<string, EmotionEvent> = {
  "emotion-calm": {
    id: "emotion-calm",
    emotion: "Calm",
    intensity: 7,
    duration: 120,
    triggers: ["Morning meditation", "Good night's sleep", "Peaceful environment"],
    physicalSensations: ["Relaxed muscles", "Steady breathing", "Warm feeling"],
    thoughts: ["I feel at peace", "Everything is manageable", "I am safe"],
    behaviors: ["Slow movements", "Gentle speaking", "Mindful actions"],
    context: "After completing morning routine and meditation session",
    timestamp: "2025-07-20 08:00",
    color: "#A5E3D0",
  },
  "emotion-anxious": {
    id: "emotion-anxious",
    emotion: "Anxious",
    intensity: 6,
    duration: 45,
    triggers: ["Upcoming presentation", "Time pressure", "Performance concerns"],
    physicalSensations: ["Butterflies in stomach", "Tense shoulders", "Restlessness"],
    thoughts: ["What if I mess up?", "Everyone will judge me", "I'm not prepared enough"],
    behaviors: ["Pacing", "Checking notes repeatedly", "Avoiding eye contact"],
    context: "Before important work presentation",
    timestamp: "2025-07-21 13:30",
    color: "#6CAEDD",
  },
  "emotion-happy": {
    id: "emotion-happy",
    emotion: "Happy",
    intensity: 8,
    duration: 180,
    triggers: ["Achievement at work", "Positive feedback", "Social connection"],
    physicalSensations: ["Light feeling", "Smiling", "Energy boost"],
    thoughts: ["I did well", "People appreciate me", "Life is good"],
    behaviors: ["Animated talking", "Laughing", "Sharing good news"],
    context: "After receiving promotion news",
    timestamp: "2025-07-19 16:00",
    color: "#C7B7E8",
  },
}

export function CrisisEmotionModal({ isOpen, onClose, type, data }: CrisisEmotionModalProps) {
  if (!data) return null

  const isCrisis = type === "crisis"
  const crisisData = isCrisis ? (data as CrisisEvent) : null
  const emotionData = !isCrisis ? (data as EmotionEvent) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCrisis ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Crisis Event Details
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" style={{ color: emotionData?.color }} />
                {emotionData?.emotion} Emotion Details
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-medium">
                    {isCrisis ? `${crisisData?.date} at ${crisisData?.time}` : emotionData?.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Intensity</div>
                  <div className="font-medium">
                    {isCrisis ? `${crisisData?.intensity}/10` : `${emotionData?.intensity}/10`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {isCrisis ? `${crisisData?.duration} minutes` : `${emotionData?.duration} minutes`}
                  </div>
                </div>
                {isCrisis && (
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{crisisData?.location}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Triggers */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-2">Triggers</div>
              <div className="flex flex-wrap gap-2">
                {(isCrisis ? crisisData?.triggers : emotionData?.triggers)?.map((trigger, index) => (
                  <Badge key={index} variant="secondary">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crisis-specific content */}
          {isCrisis && crisisData && (
            <>
              {/* Symptoms */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Symptoms</div>
                  <div className="flex flex-wrap gap-2">
                    {crisisData.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="destructive">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Coping Strategies */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Coping Strategies Used</div>
                  <div className="flex flex-wrap gap-2">
                    {crisisData.copingStrategies.map((strategy, index) => (
                      <Badge key={index} variant="outline" className="border-green-500 text-green-700">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mood Change */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Mood Change</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Before</div>
                      <div className="text-lg font-bold text-red-600">{crisisData.beforeMood}/10</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">After</div>
                      <div className="text-lg font-bold text-green-600">{crisisData.afterMood}/10</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Clinical Notes
                  </div>
                  <p className="text-sm">{crisisData.notes}</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Emotion-specific content */}
          {!isCrisis && emotionData && (
            <>
              {/* Physical Sensations */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Physical Sensations</div>
                  <div className="flex flex-wrap gap-2">
                    {emotionData.physicalSensations.map((sensation, index) => (
                      <Badge key={index} variant="outline" style={{ borderColor: emotionData.color }}>
                        {sensation}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Thoughts */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Thoughts</div>
                  <ul className="space-y-1">
                    {emotionData.thoughts.map((thought, index) => (
                      <li key={index} className="text-sm italic">
                        "{thought}"
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Behaviors */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Behaviors</div>
                  <div className="flex flex-wrap gap-2">
                    {emotionData.behaviors.map((behavior, index) => (
                      <Badge key={index} variant="secondary">
                        {behavior}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Context */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Context</div>
                  <p className="text-sm">{emotionData.context}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get crisis details
export function getCrisisDetails(crisisIndex: number): CrisisEvent | null {
  const crisisId = `crisis-${crisisIndex + 1}`
  return mockCrisisDetails[crisisId] || null
}

// Helper function to get emotion details
export function getEmotionDetails(emotionName: string): EmotionEvent | null {
  const emotionId = `emotion-${emotionName.toLowerCase()}`
  return mockEmotionDetails[emotionId] || null
}
