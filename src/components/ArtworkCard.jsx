function ArtworkCard({ artwork, isFavorite, onSelectArtwork, onToggleFavorite }) {
  return (
    <article className="artwork-card">
      <img
        src={artwork.primaryImageSmall}
        alt={artwork.title}
        className="artwork-image"
      />

      <div className="artwork-info">
        <h3>{artwork.title}</h3>
        <p>{artwork.artistDisplayName || "Artiste inconnu"}</p>
        <p>{artwork.objectDate || "Date inconnue"}</p>

        <button type="button" onClick={() => onSelectArtwork(artwork)}>
          Voir la fiche
        </button>

        <button type="button" onClick={() => onToggleFavorite(artwork)}>
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      </div>
    </article>
  );
}

export default ArtworkCard;
