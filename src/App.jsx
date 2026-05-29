import { useState, useEffect } from "react";
import "./App.css";
import ArtworkDetail from "./components/ArtworkDetail";
import ArtworkResults from "./components/ArtworkResults";
import FavoritesList from "./components/FavoritesList";
import Filters from "./components/Filters";
import SearchForm from "./components/SearchForm";

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

      const detailsLimit = searchArtistOrCulture ? 80 : 10;
      const firstIds = (data.objectIDs || []).slice(0, detailsLimit);

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

      if (searchArtistOrCulture) {
        const searchValue = searchTerm.toLowerCase();
        const filteredArtworks = artworksData.filter((artwork) => {
          const artist = artwork.artistDisplayName.toLowerCase();
          const culture = artwork.culture.toLowerCase();

          return artist.includes(searchValue) || culture.includes(searchValue);
        });

        setArtworks(filteredArtworks);
        setTotalResults(filteredArtworks.length);
      } else {
        setArtworks(artworksData);
      }
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

      <SearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmit={handleSearch}
      />

      <Filters
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={setSelectedDepartment}
        medium={medium}
        onMediumChange={setMedium}
        geoLocation={geoLocation}
        onGeoLocationChange={setGeoLocation}
        dateBegin={dateBegin}
        onDateBeginChange={setDateBegin}
        dateEnd={dateEnd}
        onDateEndChange={setDateEnd}
        searchInTitle={searchInTitle}
        onSearchInTitleChange={setSearchInTitle}
        searchInTags={searchInTags}
        onSearchInTagsChange={setSearchInTags}
        searchArtistOrCulture={searchArtistOrCulture}
        onSearchArtistOrCultureChange={setSearchArtistOrCulture}
        onlyHighlights={onlyHighlights}
        onOnlyHighlightsChange={setOnlyHighlights}
        onlyOnView={onlyOnView}
        onOnlyOnViewChange={setOnlyOnView}
        onResetFilters={resetFilters}
      />

      <FavoritesList
        favorites={favorites}
        onSelectArtwork={setSelectedArtwork}
        onToggleFavorite={toggleFavorite}
      />

      <ArtworkDetail
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />

      {isLoading && <p>Chargement...</p>}

      {error && <p>{error}</p>}

      {!isLoading && (
        <ArtworkResults
          totalResults={totalResults}
          artworks={artworks}
          favorites={favorites}
          onSelectArtwork={setSelectedArtwork}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {!isLoading && totalResults === 0 && objectIds.length === 0 && (
        <p>Aucun resultat pour le moment.</p>
      )}
    </main>
  );
}

export default App;
