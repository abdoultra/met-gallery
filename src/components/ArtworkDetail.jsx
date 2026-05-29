function ArtworkDetail({ artwork, onClose }) {
  if (!artwork) {
    return null;
  }

  return (
    <section className="artwork-detail">
      <button type="button" onClick={onClose}>
        Fermer
      </button>

      <img
        src={artwork.primaryImageSmall}
        alt={artwork.title}
        className="detail-image"
      />

      <div>
        <h2>{artwork.title}</h2>
        <p>
          <strong>Artiste :</strong>{" "}
          {artwork.artistDisplayName || "Artiste inconnu"}
        </p>
        <p>
          <strong>Date :</strong> {artwork.objectDate || "Date inconnue"}
        </p>
        <p>
          <strong>Departement :</strong>{" "}
          {artwork.department || "Departement inconnu"}
        </p>
        <p>
          <strong>Culture :</strong> {artwork.culture || "Non renseigne"}
        </p>
        <p>
          <strong>Technique :</strong> {artwork.medium || "Non renseigne"}
        </p>
      </div>
    </section>
  );
}

export default ArtworkDetail;
