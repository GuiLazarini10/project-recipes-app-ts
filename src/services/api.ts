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
