import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInTitle, setSearchInTitle] = useState(false);
  const [searchInTags, setSearchInTags] = useState(false);
  const [searchArtistOrCulture, setSearchArtistOrCulture] = useState(false);
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [onlyOnView, setOnlyOnView] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [medium, setMedium] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [objectIds, setObjectIds] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("met-favorites");

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch(
          "https://collectionapi.metmuseum.org/public/collection/v1/departments",
        );

        if (!response.ok) {
          throw new Error("Impossible de charger les departements");
        }

        const data = await response.json();

        setDepartments(data.departments || []);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchDepartments();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    if (searchTerm.trim() === "") {
      return;
    }

    if (
      (dateBegin.trim() !== "" && dateEnd.trim() === "") ||
      (dateBegin.trim() === "" && dateEnd.trim() !== "")
    ) {
      setError("Indique une date de debut et une date de fin.");
      return;
    }

    setIsLoading(true);
    setError("");
    setObjectIds([]);
    setArtworks([]);
    setSelectedArtwork(null);
    setTotalResults(0);

    try {
      const params = new URLSearchParams();

      params.set("hasImages", "true");
      params.set("q", searchTerm);

      if (searchInTitle) {
        params.set("title", "true");
      }

      if (searchInTags) {
        params.set("tags", "true");
      }

      if (searchArtistOrCulture) {
        params.set("artistOrCulture", "true");
      }

      if (onlyHighlights) {
        params.set("isHighlight", "true");
      }

      if (onlyOnView) {
        params.set("isOnView", "true");
      }

      if (selectedDepartment !== "") {
        params.set("departmentId", selectedDepartment);
      }

      if (medium.trim() !== "") {
        params.set("medium", medium.trim());
      }

      if (geoLocation.trim() !== "") {
        params.set("geoLocation", geoLocation.trim());
      }

      if (dateBegin.trim() !== "" && dateEnd.trim() !== "") {
        params.set("dateBegin", dateBegin.trim());
        params.set("dateEnd", dateEnd.trim());
      }

      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?${params.toString()}`,
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

    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter(
        (favorite) => favorite.objectID !== artwork.objectID,
      );
    } else {
      updatedFavorites = [...favorites, artwork];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("met-favorites", JSON.stringify(updatedFavorites));
  }

  function resetFilters() {
    setSearchInTitle(false);
    setSearchInTags(false);
    setSearchArtistOrCulture(false);
    setOnlyHighlights(false);
    setOnlyOnView(false);
    setSelectedDepartment("");
    setMedium("");
    setGeoLocation("");
    setDateBegin("");
    setDateEnd("");
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

      <section className="filters">
        <h2>Filtres</h2>

        <div className="filters-grid">
          <label>
            Departement
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option value="">Tous les departements</option>

              {departments.map((department) => (
                <option
                  key={department.departmentId}
                  value={department.departmentId}
                >
                  {department.displayName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Medium / type
            <input
              type="text"
              placeholder="Paintings, Ceramics, Textiles..."
              value={medium}
              onChange={(event) => setMedium(event.target.value)}
            />
          </label>

          <label>
            Lieu
            <input
              type="text"
              placeholder="France, Paris, China..."
              value={geoLocation}
              onChange={(event) => setGeoLocation(event.target.value)}
            />
          </label>

          <label>
            Date debut
            <input
              type="number"
              placeholder="1700"
              value={dateBegin}
              onChange={(event) => setDateBegin(event.target.value)}
            />
          </label>

          <label>
            Date fin
            <input
              type="number"
              placeholder="1800"
              value={dateEnd}
              onChange={(event) => setDateEnd(event.target.value)}
            />
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={searchInTitle}
              onChange={(event) => setSearchInTitle(event.target.checked)}
            />
            Chercher dans le titre
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={searchInTags}
              onChange={(event) => setSearchInTags(event.target.checked)}
            />
            Chercher dans les tags
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={searchArtistOrCulture}
              onChange={(event) =>
                setSearchArtistOrCulture(event.target.checked)
              }
            />
            Artiste ou culture
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyHighlights}
              onChange={(event) => setOnlyHighlights(event.target.checked)}
            />
            Oeuvres importantes
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyOnView}
              onChange={(event) => setOnlyOnView(event.target.checked)}
            />
            Exposees au musee
          </label>
        </div>

        <button type="button" onClick={resetFilters}>
          Reinitialiser les filtres
        </button>
      </section>

      <section>
        <h2>Favoris</h2>

        {favorites.length === 0 ? (
          <p>Aucun favori pour le moment.</p>
        ) : (
          <ul>
            {favorites.map((favorite) => (
              <li key={favorite.objectID}>
                {favorite.title}
                <button
                  type="button"
                  onClick={() => setSelectedArtwork(favorite)}
                >
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
              <strong>Departement :</strong>{" "}
              {selectedArtwork.department || "Departement inconnu"}
            </p>
            <p>
              <strong>Culture :</strong>{" "}
              {selectedArtwork.culture || "Non renseigne"}
            </p>
            <p>
              <strong>Technique :</strong>{" "}
              {selectedArtwork.medium || "Non renseigne"}
            </p>
          </div>
        </section>
      )}

      {isLoading && <p>Chargement...</p>}

      {error && <p>{error}</p>}

      {!isLoading && totalResults > 0 && (
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
        <p>Aucun resultat pour le moment.</p>
      )}
    </main>
  );
}

export default App;
