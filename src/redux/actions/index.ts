export const NEW_DRINK = 'NEW_DRINK';
export const NEW_MEAL = 'NEW_MEAL';
export const NEW_ISDRINK = 'NEW_ISDRINK';

export const addDrinkAction = (drink: object) => ({
  type: NEW_DRINK,
  payload: drink,
});

export const addMealAction = (meal: object) => ({
  type: NEW_MEAL,
  payload: meal,
});

export const addIsdrinkAction = (isDrink: boolean) => ({
  type: NEW_ISDRINK,
  payload: isDrink,
});
