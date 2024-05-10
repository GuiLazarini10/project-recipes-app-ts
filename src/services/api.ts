export const fetchById = async (type: string, id: string): Promise<any> => {
  // Define a baseUrl com base no tipo de receita (comida ou bebida)
  const baseUrl = type === 'meals' ? 'https://www.themealdb.com/api/json/v1/1' : 'https://www.thecocktaildb.com/api/json/v1/1';
  // Endpoint da requisição com o ID da receita
  const endpoint = `${baseUrl}/lookup.php?i=${id}`;

  try {
    // Requisição à API
    const response = await fetch(endpoint);
    // Converte para JSON
    const data = await response.json();
    // Retorna os detalhes da receita
    return type === 'meals' ? data.meals : data.drinks;
  } catch (error) {
    // Se houver erro na requisição
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to fetch recipe details');
  }
};

export const fetchRecommendation = async (isMeal: boolean): Promise<any> => {
  try {
    // Se o usuário estiver na página de comida, solicite uma recomendação de bebida
    if (isMeal) {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      return data; // Retorna a recomendação de bebida
    }
    // Se o usuário estiver na página de bebida, solicite uma recomendação de comida

    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    return data; // Retorna a recomendação de comida
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw new Error('Failed to fetch recommendation');
  }
};
