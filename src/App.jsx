import { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [objectIds, setObjectIds] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
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
      {isLoading && <p>Chargement...</p>}

      {error && <p>{error}</p>}

      {!isLoading && totalResults > 0 && (
        <section>
          <h2>{totalResults} résultat(s)</h2>

          <div className="artworks-grid">
            {artworks
              .filter((artwork) => artwork.primaryImageSmall)
              .map((artwork) => (
                <article className="artwork-card" key={artwork.objectID} >
                  <img
                    src={artwork.primaryImageSmall}
                    alt={artwork.title}
                    className="artwork-image"
                  />

                  <div className="artwork-info">
                    <h3>{artwork.title}</h3>
                    <p>{artwork.artistDisplayName || "Artiste inconnu"}</p>
                    <p>{artwork.objectDate || "Date inconnue"}</p>
                  </div>
                </article>
              ))}
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
