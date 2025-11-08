"use client";

import { useEffect } from "react";

type ProductMediaProps = {
  youtubeVideoId?: string;
  instagramPostUrl?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
};

export function ProductMedia({ youtubeVideoId, instagramPostUrl, sectionTitle, sectionSubtitle }: ProductMediaProps) {
  useEffect(() => {
    // Load Instagram embed script
    if (instagramPostUrl && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src = "//www.instagram.com/embed.js";

      // Check if script already exists
      const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
      if (!existingScript) {
        document.body.appendChild(script);
      } else {
        // If script exists and Instagram object is available, process embeds
        const instgrm = (window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm;
        if (instgrm) {
          instgrm.Embeds.process();
        }
      }

      return () => {
        // Cleanup is minimal since script might be used by other components
      };
    }
  }, [instagramPostUrl]);

  // Don't render anything if both props are empty
  if (!youtubeVideoId && !instagramPostUrl) {
    return null;
  }

  const showHeader = Boolean(sectionTitle || sectionSubtitle);

  return (
    <section className="section">
      <div className="container space-y-12">
        {/* Section Header */}
        {showHeader ? (
          <div className="text-center space-y-2">
            {sectionTitle ? <h2 className="heading-2">{sectionTitle}</h2> : null}
            {sectionSubtitle ? <p className="text-gray-600">{sectionSubtitle}</p> : null}
          </div>
        ) : null}

        <div className="space-y-12">
          {/* YouTube Video - Full width, prominent */}
          {youtubeVideoId && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF0000' }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <h3 className="text-xl font-semibold">YouTube</h3>
              </div>
              <div className="relative aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border-2 border-gray-200 bg-black shadow-xl">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="Product demonstration video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Instagram Post - Centered, reasonable width */}
          {instagramPostUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#E4405F' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <h3 className="text-xl font-semibold">Instagram</h3>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={instagramPostUrl}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px 0 rgba(0,0,0,0.1)",
                      margin: "0 auto",
                      maxWidth: "540px",
                      minWidth: "326px",
                      padding: 0,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
