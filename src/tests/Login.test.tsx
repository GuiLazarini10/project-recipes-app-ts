import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Pages/Login';

const emailInputId = 'email-input';
const passwordInputId = 'password-input';
const submitButtonId = 'login-submit-btn';
const emailvalido = 'user@test.com';
const passwordvalido = '1234567';

describe('Login', () => {
  it('renderiza inputs de e-mail e senha e o botão enviar', () => {
    const { getByTestId } = render(<Login />, { wrapper: MemoryRouter });
    expect(getByTestId(emailInputId)).toBeInTheDocument();
    expect(getByTestId(passwordInputId)).toBeInTheDocument();
    expect(getByTestId(submitButtonId)).toBeInTheDocument();
  });

  it('ativar/desativa o botão enviar quando e-mail e senha válidos forem inseridos', async () => {
    const { getByTestId } = render(<Login />, { wrapper: MemoryRouter });
    const emailInput = getByTestId(emailInputId);
    const passwordInput = getByTestId(passwordInputId);
    const submitButton = getByTestId(submitButtonId);

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: emailvalido } });
    fireEvent.change(passwordInput, { target: { value: passwordvalido } });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it('salva o email do usuário no localStorage após acionar botao enviar', async () => {
    const { getByTestId } = render(<Login />, { wrapper: MemoryRouter });
    const emailInput = getByTestId(emailInputId);
    const passwordInput = getByTestId(passwordInputId);
    const submitButton = getByTestId(submitButtonId);

    fireEvent.change(emailInput, { target: { value: emailvalido } });
    fireEvent.change(passwordInput, { target: { value: passwordvalido } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(localStorage.getItem('user'))
      .toEqual(JSON.stringify({ email: emailvalido })));
  });
});
