
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Play } from 'lucide-react';
import { validateVideoUrl, generateVideoThumbnail, EXAMPLE_URLS } from '@/utils/videoValidation';

interface VideoUrlValidatorProps {
  url: string;
  onValidationChange: (isValid: boolean, platform?: string) => void;
}

const VideoUrlValidator: React.FC<VideoUrlValidatorProps> = ({ 
  url, 
  onValidationChange 
}) => {
  const [validation, setValidation] = useState(() => validateVideoUrl(url));
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    const result = validateVideoUrl(url);
    setValidation(result);
    onValidationChange(result.isValid, result.platform);
    
    if (result.isValid) {
      setThumbnailUrl(generateVideoThumbnail(url));
    }
  }, [url, onValidationChange]);

  if (!url) {
    return (
      <div className="mt-2 p-3 bg-muted rounded-md">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Digite uma URL de vídeo para validar</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Exemplos de URLs válidas:</p>
          <div className="space-y-1">
            <p><strong>YouTube:</strong> {EXAMPLE_URLS.youtube[0]}</p>
            <p><strong>Vimeo:</strong> {EXAMPLE_URLS.vimeo[0]}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {validation.isValid ? (
        <div className="space-y-3">
          {/* Status de Validação */}
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              URL válida - {validation.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
            </span>
            {validation.videoId && (
              <span className="text-xs text-muted-foreground">
                ID: {validation.videoId}
              </span>
            )}
          </div>

          {/* Preview da Thumbnail */}
          {thumbnailUrl && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
              <div className="relative">
                <img
                  src={thumbnailUrl}
                  alt="Preview do vídeo"
                  className="w-20 h-12 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Preview da Thumbnail
                </p>
                <p className="text-xs text-muted-foreground">
                  Thumbnail gerada automaticamente para {validation.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">URL inválida</span>
          </div>
          {validation.error && (
            <p className="text-xs text-destructive/80 mt-1">
              {validation.error}
            </p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Formatos aceitos:</p>
            <div className="space-y-1">
              <p><strong>YouTube:</strong> youtube.com/watch?v=ID, youtu.be/ID</p>
              <p><strong>Vimeo:</strong> vimeo.com/ID</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUrlValidator;
