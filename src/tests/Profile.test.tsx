import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Pages/Profile';

beforeEach(() => {
  const user = { email: 'email@email.com' };
  localStorage.setItem('user', JSON.stringify(user));
});
afterAll(() => {
  localStorage.clear();
});

const logoutBtn = 'profile-logout-btn';
describe('Verifica a página de perfil', () => {
  it('Verifica se todos os testId estão na página', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-email')).toBeInTheDocument();
    expect(screen.getByTestId('profile-done-btn')).toBeInTheDocument();
    expect(screen.getByTestId('profile-favorite-btn')).toBeInTheDocument();
    expect(screen.getByTestId(logoutBtn)).toBeInTheDocument();
  });
  it('Verifica se o email do usuário está sendo renderizado conforme localStorage', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-email')).toHaveTextContent('email@email.com');
  });
  it('Verifica se o botão de receitas Feitas redireciona corretamente', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );

    const doneButton = screen.getByTestId('profile-done-btn');
    fireEvent.click(doneButton);

    const currentLocation = window.location.pathname;
    expect(currentLocation).toBe('/');
  });
  it('Verifica o botão de receitas Favoritas redireciona corretamente', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );
    const favoriteRecipesLink = screen.getByTestId('profile-favorite-btn');
    fireEvent.click(favoriteRecipesLink);
    const currentLocation = window.location.pathname;
    expect(currentLocation).toBe('/');
  });
  it('Verifica se o botão de logout redireciona corretamente', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByTestId('profile-logout-btn');
    fireEvent.click(logoutButton);
    const currentLocation = window.location.pathname;
    expect(currentLocation).toBe('/');
  });
  it('Verifica se o localStorage é limpo ao clicar no botão de logout', async () => {
    render(
      <MemoryRouter initialEntries={ ['/'] }>
        <Profile />
      </MemoryRouter>,
    );

    userEvent.click(screen.getByTestId(logoutBtn));
    await waitFor(() => expect(localStorage.getItem('user')).toBe(null));
  });
});
