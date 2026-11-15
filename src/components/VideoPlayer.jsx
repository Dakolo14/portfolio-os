import { getYouTubeId, youTubeEmbedUrl } from "../lib/media";


export default function VideoPlayer({ file }) {
  if (!file) {
    return <div className="media-viewer media-viewer--empty">Video not found.</div>;
  }

  const ytId = getYouTubeId(file.youtube || file.src);

  return (
    <div className="media-viewer media-viewer--video">
      <div className="media-viewer__stage">
        {ytId ? (
          <iframe
            className="media-viewer__video"
            src={youTubeEmbedUrl(ytId)}
            title={file.caption || file.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            className="media-viewer__video"
            src={file.src}
            poster={file.poster}
            controls
            playsInline
            preload="metadata"
          >
            Your browser can't play this video.
          </video>
        )}
      </div>
      {(file.caption || file.name) && (
        <div className="media-viewer__bar">
          <span className="media-viewer__name">{file.caption || file.name}</span>
        </div>
      )}
    </div>
  );
}
