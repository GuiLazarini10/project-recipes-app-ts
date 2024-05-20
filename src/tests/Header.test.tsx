import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

const searchTOP = 'search-top-btn';
const profileTOP = 'profile-top-btn';

describe('Testa o componente Header', () => {
  it('Testa se os itens estão na tela Refeições', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const profileIconElement = getByTestId(profileTOP);
    expect(profileIconElement).toBeInTheDocument();

    expect(profileIconElement).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(profileIconElement).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Meals/i })).toBeInTheDocument();
  });

  it('Testar se o barra busca não aparece', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );

    const searchBtn = getByTestId(searchTOP);

    fireEvent.click(searchBtn);
    const searchInput = await screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    fireEvent.click(searchBtn);
    await waitFor(() => {
      expect(searchInput).not.toBeInTheDocument();
    });
  });

  it('testa se o ícone profile redireciona para página de perfil', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );
    const profileBtn = getByTestId('profile-top-btn');

    fireEvent.click(profileBtn);
    const { pathname } = window.location;
    expect(pathname).toBe('/');
  });
});
