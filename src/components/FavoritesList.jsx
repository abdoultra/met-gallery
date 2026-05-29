function FavoritesList({ favorites, onSelectArtwork, onToggleFavorite }) {
  return (
    <section>
      <h2>Favoris</h2>

      {favorites.length === 0 ? (
        <p>Aucun favori pour le moment.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.objectID}>
              {favorite.title}
              <button type="button" onClick={() => onSelectArtwork(favorite)}>
                Voir
              </button>
              <button type="button" onClick={() => onToggleFavorite(favorite)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoritesList;
