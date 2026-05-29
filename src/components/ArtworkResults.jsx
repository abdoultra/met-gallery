import ArtworkCard from "./ArtworkCard";

function ArtworkResults({
  totalResults,
  artworks,
  favorites,
  onSelectArtwork,
  onToggleFavorite,
  onLoadMore,
  canLoadMore,
  isLoadingMore,
}) {
  if (totalResults <= 0) {
    return null;
  }

  return (
    <section>
      <h2>{totalResults} resultat(s)</h2>

      <div className="artworks-grid">
        {artworks
          .filter((artwork) => artwork.primaryImageSmall)
          .map((artwork) => {
            const isFavorite = favorites.some(
              (favorite) => favorite.objectID === artwork.objectID,
            );

            return (
              <ArtworkCard
                key={artwork.objectID}
                artwork={artwork}
                isFavorite={isFavorite}
                onSelectArtwork={onSelectArtwork}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
      </div>

      {canLoadMore && (
        <button
          type="button"
          className="load-more-button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "Chargement..." : "Afficher plus"}
        </button>
      )}
    </section>
  );
}

export default ArtworkResults;
