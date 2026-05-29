function SearchForm({ searchTerm, onSearchTermChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Rechercher une oeuvre d'art..."
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
      />
      <button type="submit">Rechercher</button>
    </form>
  );
}

export default SearchForm;
