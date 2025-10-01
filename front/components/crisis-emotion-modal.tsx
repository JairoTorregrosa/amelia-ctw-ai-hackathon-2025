'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, TrendingUp, Heart, MessageCircle } from 'lucide-react';

interface CrisisEvent {
  id: string;
  time: string;
  date: string;
  intensity: number;
  duration: number;
  triggers: string[];
  symptoms: string[];
  copingStrategies: string[];
  notes: string;
  location: string;
  beforeMood: number;
  afterMood: number;
}

interface EmotionEvent {
  id: string;
  emotion: string;
  intensity: number;
  duration: number;
  triggers: string[];
  physicalSensations: string[];
  thoughts: string[];
  behaviors: string[];
  context: string;
  timestamp: string;
  color: string;
}

interface CrisisEmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'crisis' | 'emotion';
  data: CrisisEvent | EmotionEvent | null;
}

export function CrisisEmotionModal({ isOpen, onClose, type, data }: CrisisEmotionModalProps) {
  if (!data) return null;

  const isCrisis = type === 'crisis';
  const crisisData = isCrisis ? (data as CrisisEvent) : null;
  const emotionData = !isCrisis ? (data as EmotionEvent) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCrisis ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Detalles del evento de crisis
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" style={{ color: emotionData?.color }} />
                Detalles de la emoción {emotionData?.emotion}
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
                  <div className="text-muted-foreground text-sm">Hora</div>
                  <div className="font-medium">
                    {isCrisis
                      ? `${crisisData?.date} a las ${crisisData?.time}`
                      : emotionData?.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Intensidad</div>
                  <div className="font-medium">
                    {isCrisis ? `${crisisData?.intensity}/10` : `${emotionData?.intensity}/10`}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Duración</div>
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="h-4 w-4" />
                    {isCrisis
                      ? `${crisisData?.duration} minutos`
                      : `${emotionData?.duration} minutos`}
                  </div>
                </div>
                {isCrisis && (
                  <div>
                    <div className="text-muted-foreground text-sm">Lugar</div>
                    <div className="font-medium">{crisisData?.location}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Triggers */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-muted-foreground mb-2 text-sm">Disparadores</div>
              <div className="flex flex-wrap gap-2">
                {(isCrisis ? crisisData?.triggers : emotionData?.triggers)?.map(
                  (trigger, index) => (
                    <Badge key={index} variant="secondary">
                      {trigger}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crisis-specific content */}
          {isCrisis && crisisData && (
            <>
              {/* Symptoms */}
              <Card>
                <CardContent className="pt-4">
                    <div className="text-muted-foreground mb-2 text-sm">Síntomas</div>
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
                    <div className="text-muted-foreground mb-2 text-sm">Estrategias de afrontamiento utilizadas</div>
                  <div className="flex flex-wrap gap-2">
                    {crisisData.copingStrategies.map((strategy, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-green-500 text-green-700"
                      >
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mood Change */}
              <Card>
                <CardContent className="pt-4">
                    <div className="text-muted-foreground mb-2 text-sm">Cambio en el estado de ánimo</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-muted-foreground text-xs">Antes</div>
                      <div className="text-lg font-bold text-red-600">
                        {crisisData.beforeMood}/10
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div className="text-center">
                        <div className="text-muted-foreground text-xs">Después</div>
                      <div className="text-lg font-bold text-green-600">
                        {crisisData.afterMood}/10
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="pt-4">
                    <div className="text-muted-foreground mb-2 flex items-center gap-1 text-sm">
                    <MessageCircle className="h-4 w-4" />
                      Notas clínicas
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
                    <div className="text-muted-foreground mb-2 text-sm">Sensaciones físicas</div>
                  <div className="flex flex-wrap gap-2">
                    {emotionData.physicalSensations.map((sensation, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        style={{ borderColor: emotionData.color }}
                      >
                        {sensation}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Thoughts */}
              <Card>
                <CardContent className="pt-4">
                    <div className="text-muted-foreground mb-2 text-sm">Pensamientos</div>
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
                    <div className="text-muted-foreground mb-2 text-sm">Conductas</div>
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
                    <div className="text-muted-foreground mb-2 text-sm">Contexto</div>
                  <p className="text-sm">{emotionData.context}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
