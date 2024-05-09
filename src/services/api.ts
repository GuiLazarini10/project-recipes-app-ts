// services/api.ts

export const fetchById = async (type: string, id: string): Promise<any> => {
  const url = type === 'comidas' ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}` : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
  const results = await fetch(url)
    .then((r) => r.json());
  return (type === 'comidas' ? results.meals : results.drinks);
};
