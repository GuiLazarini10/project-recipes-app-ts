const mockFetch = (url: string | string[]) => {
  if (url.includes('meals')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        meals: [
          {
            idMeal: '52977',
            strMeal: 'Corba',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
            strCategory: 'Side',
            strArea: 'Turkish',
            strInstructions: 'Detailed cooking instructions...',
            strTags: 'Soup',
            strYoutube: 'https://www.youtube.com/watch?v=VVnZd8A84z4',
          },
        ],
      }),
    });
  } if (url.includes('drinks')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        drinks: [
          {
            idDrink: '17222',
            strDrink: 'A1',
            strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg',
            strCategory: 'Cocktail',
            strAlcoholic: 'Alcoholic',
            strGlass: 'Cocktail glass',
            strInstructions:
            'Pour all ingredients into a cocktail shake',
          },
        ],
      }),
    });
  }
};

export default mockFetch;
