export const fetchById = async (type: string, id: string): Promise<any> => {
  const baseUrl = type === 'meals' ? 'https://www.themealdb.com/api/json/v1/1' : 'https://www.thecocktaildb.com/api/json/v1/1';
  const endpoint = `${baseUrl}/lookup.php?i=${id}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return type === 'meals' ? data.meals : data.drinks;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to fetch recipe details');
  }
};

export const fetchRecommendation = async (isMeal: boolean): Promise<any> => {
  const endpoint = isMeal
    ? 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
    : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return isMeal ? data.drinks : data.meals;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw new Error('Failed to fetch recommendation');
  }
};
