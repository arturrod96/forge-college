interface Props {
  videoUrl: string;
}

export function VideoLesson({ videoUrl }: Props) {
  // Basic validation for YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = new RegExp("^(?:https?:\\/\\/)?(?:www\\.)?(?:m\\.)?(?:youtube\\.com|youtu\\.be)\\/^(?:watch\\?v=|embed\\/|v\\/|)([^&?%]{11})");
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) {
    return <div className="text-red-500">Invalid YouTube video URL provided.</div>;
  }

  return (
    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        title="YouTube video player"
      ></iframe>
    </div>
  );
}
