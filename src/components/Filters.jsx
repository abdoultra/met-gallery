function Filters({
  departments,
  selectedDepartment,
  onSelectedDepartmentChange,
  medium,
  onMediumChange,
  geoLocation,
  onGeoLocationChange,
  dateBegin,
  onDateBeginChange,
  dateEnd,
  onDateEndChange,
  searchInTitle,
  onSearchInTitleChange,
  searchInTags,
  onSearchInTagsChange,
  searchArtistOrCulture,
  onSearchArtistOrCultureChange,
  onlyHighlights,
  onOnlyHighlightsChange,
  onlyOnView,
  onOnlyOnViewChange,
  onResetFilters,
}) {
  return (
    <section className="filters">
      <h2>Filtres</h2>

      <div className="filters-grid">
        <label>
          Departement
          <select
            value={selectedDepartment}
            onChange={(event) =>
              onSelectedDepartmentChange(event.target.value)
            }
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
            onChange={(event) => onMediumChange(event.target.value)}
          />
        </label>

        <label>
          Lieu
          <input
            type="text"
            placeholder="France, Paris, China..."
            value={geoLocation}
            onChange={(event) => onGeoLocationChange(event.target.value)}
          />
        </label>

        <label>
          Date debut
          <input
            type="number"
            placeholder="1700"
            value={dateBegin}
            onChange={(event) => onDateBeginChange(event.target.value)}
          />
        </label>

        <label>
          Date fin
          <input
            type="number"
            placeholder="1800"
            value={dateEnd}
            onChange={(event) => onDateEndChange(event.target.value)}
          />
        </label>
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchInTitle}
            onChange={(event) => onSearchInTitleChange(event.target.checked)}
          />
          Chercher dans le titre
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchInTags}
            onChange={(event) => onSearchInTagsChange(event.target.checked)}
          />
          Chercher dans les tags
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={searchArtistOrCulture}
            onChange={(event) =>
              onSearchArtistOrCultureChange(event.target.checked)
            }
          />
          Filtrer par artiste ou culture
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyHighlights}
            onChange={(event) => onOnlyHighlightsChange(event.target.checked)}
          />
          Oeuvres importantes
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyOnView}
            onChange={(event) => onOnlyOnViewChange(event.target.checked)}
          />
          Exposees au musee
        </label>
      </div>

      <button type="button" onClick={onResetFilters}>
        Reinitialiser les filtres
      </button>
    </section>
  );
}

export default Filters;
