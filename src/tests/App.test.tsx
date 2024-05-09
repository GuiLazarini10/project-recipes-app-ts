import React from 'react';
import { render, screen } from '@testing-library/react';
// import App from '../App';
import userEvent from '@testing-library/user-event';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('should render the footer with two icons for navigation', () => {
    render(<Footer />);
    const drinksButton = screen.getByTestId('drinks-bottom-btn');
    const mealsButton = screen.getByTestId('meals-bottom-btn');

    // Verifica se os botões existem
    expect(drinksButton).toBeInTheDocument();
    expect(mealsButton).toBeInTheDocument();

    // Verifica se as imagens são exibidas corretamente
    expect(drinksButton).toHaveAttribute('src', expect.stringContaining('drinkIcon'));
    expect(mealsButton).toHaveAttribute('src', expect.stringContaining('mealIcon'));

    // Verifica os atributos alt para acessibilidade
    expect(drinksButton).toHaveAttribute('alt', 'Drinks');
    expect(mealsButton).toHaveAttribute('alt', 'Meals');
  });

  it('should ensure the footer is fixed to the bottom of the viewport', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveStyle('position: fixed');
    expect(footer).toHaveStyle('bottom: 0');
  });

  it('should navigate to drinks page on click', () => {
    render(<Footer />);
    const drinksButton = screen.getByTestId('drinks-bottom-btn');
    userEvent.click(drinksButton);
  });

  it('should navigate to meals page on click', () => {
    render(<Footer />);
    const mealsButton = screen.getByTestId('meals-bottom-btn');
    userEvent.click(mealsButton);
  });

});
