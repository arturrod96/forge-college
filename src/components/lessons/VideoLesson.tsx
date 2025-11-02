import { useState } from 'react';

interface Props {
  videoUrl: string;
}

export function VideoLesson({ videoUrl }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Função robusta para extrair ID do vídeo de múltiplos formatos de URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;

    // Trim whitespace
    url = url.trim();

    // Regex patterns para diferentes formatos de URL do YouTube
    const patterns = [
      // youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      // youtu.be/VIDEO_ID
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      // youtube.com/embed/VIDEO_ID
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // m.youtube.com/watch?v=VIDEO_ID
      /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Função para gerar URL de embed com parâmetros otimizados
  const getYouTubeEmbedUrl = (videoId: string): string => {
    const params = new URLSearchParams({
      // Parâmetros baseados na documentação YouTube Player Parameters
      rel: '0',                    // Não mostrar vídeos relacionados ao final
      modestbranding: '1',         // Branding mínimo do YouTube
      controls: '1',               // Mostrar controles do player
      showinfo: '0',               // Não mostrar informações do vídeo (título, uploader)
      fs: '1',                      // Permitir botão de fullscreen
      cc_load_policy: '1',         // Carregar legendas por padrão
      hl: 'pt-BR',                 // Idioma da interface em português brasileiro
      autoplay: '0',                // Não iniciar autoplay
      disablekb: '0',              // Permitir controles de teclado
      enablejsapi: '1',            // Habilitar JavaScript API
      widget_referrer: window.location.origin, // Referrer para analytics
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
        <div className="text-red-600 font-medium mb-2">URL de vídeo inválida</div>
        <div className="text-red-500 text-sm text-center">
          Por favor, forneça uma URL válida do YouTube. Formatos suportados:
          <ul className="mt-2 text-xs space-y-1">
            <li>• youtube.com/watch?v=ID_DO_VIDEO</li>
            <li>• youtu.be/ID_DO_VIDEO</li>
            <li>• youtube.com/embed/ID_DO_VIDEO</li>
          </ul>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoId);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full">
      {/* Container com aspect ratio responsivo */}
      <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Carregando vídeo...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
            <div className="text-center p-4">
              <div className="text-red-600 font-medium mb-2">Erro ao carregar vídeo</div>
              <div className="text-red-500 text-sm">
                Não foi possível carregar o vídeo. Verifique a URL e sua conexão.
              </div>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                  // Force reload by updating src
                  const iframe = document.querySelector('iframe[data-youtube-iframe]');
                  if (iframe) {
                    (iframe as HTMLIFrameElement).src = embedUrl;
                  }
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* YouTube iframe */}
        {!hasError && (
          <iframe
            data-youtube-iframe
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            title="YouTube video player"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="lazy"
          />
        )}
      </div>

      {/* Informações adicionais */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Player otimizado para experiência de aprendizado
      </div>
    </div>
  );
}
