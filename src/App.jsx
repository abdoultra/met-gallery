import { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [objectIds, setObjectIds] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      return;
    }

    setIsLoading(true);
    setError("");
    setObjectIds([]);
    setArtworks([]);
    setSelectedArtwork(null);
    setTotalResults(0);

    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(searchTerm)}`,
      );

      if (!response.ok) {
        throw new Error("Erreur pendant la recherche");
      }

      const data = await response.json();

      setTotalResults(data.total);
      setObjectIds(data.objectIDs || []);
      const firstIds = (data.objectIDs || []).slice(0, 10);

      const artworksResponses = await Promise.all(
        firstIds.map((id) =>
          fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
          ),
        ),
      );

      const artworksData = await Promise.all(
        artworksResponses.map((response) => response.json()),
      );

      setArtworks(artworksData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleFavorite(artwork) {
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite.objectID === artwork.objectID,
    );

    if (isAlreadyFavorite) {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite.objectID !== artwork.objectID,
      );

      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, artwork]);
    }
  }

  return (
    <main>
      <h1>MET Art Explorer</h1>
      <p>
        Recherche des oeuvres dans la collection du Metropolitan Museum of Art.
      </p>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher une oeuvre d'art..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>
      <section>
  <h2>Favoris</h2>

  {favorites.length === 0 ? (
    <p>Aucun favori pour le moment.</p>
  ) : (
    <ul>
      {favorites.map((favorite) => (
        <li key={favorite.objectID}>
          {favorite.title}
          <button type="button" onClick={() => setSelectedArtwork(favorite)}>
            Voir
          </button>
          <button type="button" onClick={() => toggleFavorite(favorite)}>
            Retirer
          </button>
        </li>
      ))}
    </ul>
  )}
</section>
      {isLoading && <p>Chargement...</p>}

      {error && <p>{error}</p>}

      {!isLoading && totalResults > 0 && (
        <section>
          <h2>{totalResults} résultat(s)</h2>
          {selectedArtwork && (
            <section className="artwork-detail">
              <button type="button" onClick={() => setSelectedArtwork(null)}>
                Fermer
              </button>

              <img
                src={selectedArtwork.primaryImageSmall}
                alt={selectedArtwork.title}
                className="detail-image"
              />

              <div>
                <h2>{selectedArtwork.title}</h2>
                <p>
                  <strong>Artiste :</strong>{" "}
                  {selectedArtwork.artistDisplayName || "Artiste inconnu"}
                </p>
                <p>
                  <strong>Date :</strong>{" "}
                  {selectedArtwork.objectDate || "Date inconnue"}
                </p>
                <p>
                  <strong>Département :</strong>{" "}
                  {selectedArtwork.department || "Département inconnu"}
                </p>
                <p>
                  <strong>Culture :</strong>{" "}
                  {selectedArtwork.culture || "Non renseigné"}
                </p>
                <p>
                  <strong>Technique :</strong>{" "}
                  {selectedArtwork.medium || "Non renseigné"}
                </p>
              </div>
            </section>
          )}

          <div className="artworks-grid">
            {artworks
              .filter((artwork) => artwork.primaryImageSmall)
              .map((artwork) => {
                const isFavorite = favorites.some(
                  (favorite) => favorite.objectID === artwork.objectID,
                );

                return (
                  <article className="artwork-card" key={artwork.objectID}>
                    <img
                      src={artwork.primaryImageSmall}
                      alt={artwork.title}
                      className="artwork-image"
                    />

                    <div className="artwork-info">
                      <h3>{artwork.title}</h3>
                      <p>{artwork.artistDisplayName || "Artiste inconnu"}</p>
                      <p>{artwork.objectDate || "Date inconnue"}</p>

                      <button
                        type="button"
                        onClick={() => setSelectedArtwork(artwork)}
                      >
                        Voir la fiche
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(artwork)}
                      >
                        {isFavorite
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"}
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      {!isLoading && totalResults === 0 && objectIds.length === 0 && (
        <p>Aucun résultat pour le moment.</p>
      )}
    </main>
  );
}

export default App;
