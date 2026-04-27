import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from './pages/automation-exercise.page';
import { smartClick, smartExpectVisible, smartFill, smartSelect } from './helpers/smart-locators';
import { createUniqueUser } from './utils/test-data';

test.describe('Testes com apoio de IA - Automation Exercise', () => {
  test('@ai Deve cadastrar usuario com seletores resilientes inspirados em auto-healing', async ({ page }) => {
    const user = createUniqueUser();

    await page.goto('/login');

    await smartFill(page, 'campo nome do cadastro', user.name, [
      currentPage => currentPage.locator('[data-qa="signup-name"]'),
      currentPage => currentPage.getByPlaceholder('Name'),
      currentPage => currentPage.locator('input[name="name"]').nth(1),
    ]);

    await smartFill(page, 'campo email do cadastro', user.email, [
      currentPage => currentPage.locator('[data-qa="signup-email"]'),
      currentPage => currentPage.locator('form[action="/signup"] input[name="email"]'),
      currentPage => currentPage.getByPlaceholder('Email Address').nth(1),
    ]);

    await smartClick(page, 'botao signup', [
      currentPage => currentPage.getByRole('button', { name: /signup/i }),
      currentPage => currentPage.locator('[data-qa="signup-button"]'),
      currentPage => currentPage.locator('button[data-qa="signup-button"], button').filter({ hasText: 'Signup' }),
    ]);

    await smartClick(page, 'titulo do formulario', [
      currentPage => currentPage.locator('#id_gender1'),
      currentPage => currentPage.locator('input[value="Mr"]'),
    ]);

    await smartFill(page, 'senha', user.password, [
      currentPage => currentPage.locator('[data-qa="password"]'),
      currentPage => currentPage.locator('#password'),
      currentPage => currentPage.locator('input[name="password"]'),
    ]);

    await smartSelect(page, 'dia', '10', [
      currentPage => currentPage.locator('[data-qa="days"]'),
      currentPage => currentPage.locator('#days'),
    ]);

    await smartSelect(page, 'mes', '5', [
      currentPage => currentPage.locator('[data-qa="months"]'),
      currentPage => currentPage.locator('#months'),
    ]);

    await smartSelect(page, 'ano', '1999', [
      currentPage => currentPage.locator('[data-qa="years"]'),
      currentPage => currentPage.locator('#years'),
    ]);

    await smartFill(page, 'primeiro nome', user.firstName, [
      currentPage => currentPage.locator('[data-qa="first_name"]'),
      currentPage => currentPage.locator('#first_name'),
    ]);

    await smartFill(page, 'sobrenome', user.lastName, [
      currentPage => currentPage.locator('[data-qa="last_name"]'),
      currentPage => currentPage.locator('#last_name'),
    ]);

    await smartFill(page, 'empresa', user.company, [
      currentPage => currentPage.locator('[data-qa="company"]'),
      currentPage => currentPage.locator('#company'),
    ]);

    await smartFill(page, 'endereco', user.address, [
      currentPage => currentPage.locator('[data-qa="address"]'),
      currentPage => currentPage.locator('#address1'),
    ]);

    await smartSelect(page, 'pais', user.country, [
      currentPage => currentPage.locator('[data-qa="country"]'),
      currentPage => currentPage.locator('#country'),
    ]);

    await smartFill(page, 'estado', user.state, [
      currentPage => currentPage.locator('[data-qa="state"]'),
      currentPage => currentPage.locator('#state'),
    ]);

    await smartFill(page, 'cidade', user.city, [
      currentPage => currentPage.locator('[data-qa="city"]'),
      currentPage => currentPage.locator('#city'),
    ]);

    await smartFill(page, 'cep', user.zipcode, [
      currentPage => currentPage.locator('[data-qa="zipcode"]'),
      currentPage => currentPage.locator('#zipcode'),
    ]);

    await smartFill(page, 'celular', user.mobileNumber, [
      currentPage => currentPage.locator('[data-qa="mobile_number"]'),
      currentPage => currentPage.locator('#mobile_number'),
    ]);

    await smartClick(page, 'botao create account', [
      currentPage => currentPage.locator('[data-qa="create-account"]'),
      currentPage => currentPage.getByRole('button', { name: /create account/i }),
    ]);

    await smartExpectVisible(page, 'mensagem de conta criada', [
      currentPage => currentPage.getByText('Account Created!'),
      currentPage => currentPage.locator('b').filter({ hasText: 'Account Created!' }),
    ]);

    await smartClick(page, 'continuar', [
      currentPage => currentPage.getByRole('link', { name: /continue/i }),
      currentPage => currentPage.locator('a[data-qa="continue-button"]'),
    ]);

    await smartExpectVisible(page, 'usuario logado', [
      currentPage => currentPage.getByText(`Logged in as ${user.name}`),
      currentPage => currentPage.locator('li').filter({ hasText: `Logged in as ${user.name}` }),
    ]);

    await smartClick(page, 'excluir conta', [
      currentPage => currentPage.getByRole('link', { name: /delete account/i }),
      currentPage => currentPage.locator('a[href="/delete_account"]'),
    ]);

    await smartExpectVisible(page, 'mensagem de exclusao', [
      currentPage => currentPage.getByText('Account Deleted!'),
      currentPage => currentPage.locator('b').filter({ hasText: 'Account Deleted!' }),
    ]);
  });

  test('@ai Deve fazer login e navegar usando caminhos sugeridos por IA generativa', async ({ page }) => {
    const automationExercise = new AutomationExercisePage(page);
    const user = createUniqueUser();

    await automationExercise.openLogin();
    await automationExercise.signup(user);
    await automationExercise.completeAccountCreation(user);
    await smartClick(page, 'logout', [
      currentPage => currentPage.getByRole('link', { name: /logout/i }),
      currentPage => currentPage.locator('a[href="/logout"]'),
    ]);

    await automationExercise.openLogin();
    await smartFill(page, 'email de login', user.email, [
      currentPage => currentPage.locator('[data-qa="login-email"]'),
      currentPage => currentPage.locator('form[action="/login"] input[name="email"]'),
      currentPage => currentPage.getByPlaceholder('Email Address').first(),
    ]);

    await smartFill(page, 'senha de login', user.password, [
      currentPage => currentPage.locator('[data-qa="login-password"]'),
      currentPage => currentPage.locator('input[type="password"]').first(),
    ]);

    await smartClick(page, 'botao login', [
      currentPage => currentPage.getByRole('button', { name: /login/i }),
      currentPage => currentPage.locator('[data-qa="login-button"]'),
    ]);

    await smartExpectVisible(page, 'usuario autenticado', [
      currentPage => currentPage.getByText(`Logged in as ${user.name}`),
      currentPage => currentPage.locator('li').filter({ hasText: `Logged in as ${user.name}` }),
    ]);

    await smartClick(page, 'menu products', [
      currentPage => currentPage.getByRole('link', { name: /products/i }),
      currentPage => currentPage.locator('a[href="/products"]'),
    ]);
    if (page.url().includes('#google_vignette')) {
      await page.goto('/products');
    }

    await smartFill(page, 'busca de produto', 'Blue Top', [
      currentPage => currentPage.locator('#search_product'),
      currentPage => currentPage.getByPlaceholder('Search Product'),
      currentPage => currentPage.locator('input[name="search"]'),
    ]);

    await smartClick(page, 'botao de busca', [
      currentPage => currentPage.locator('#submit_search'),
      currentPage => currentPage.locator('button#submit_search'),
    ]);

    await smartExpectVisible(page, 'cabecalho searched products', [
      currentPage => currentPage.getByText('Searched Products'),
      currentPage => currentPage.getByRole('heading', { name: /searched products/i }),
    ]);

    await expect(page.locator('.productinfo').filter({ hasText: 'Blue Top' }).first()).toBeVisible();
    await automationExercise.deleteAccount();
  });
});
