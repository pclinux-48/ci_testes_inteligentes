import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from './pages/automation-exercise.page';
import { createUniqueUser } from './utils/test-data';

test.describe('Testes manuais - Automation Exercise', () => {
  test('@manual Deve cadastrar um novo usuario, validar login e excluir a conta', async ({ page }) => {
    const automationExercise = new AutomationExercisePage(page);
    const user = createUniqueUser();

    await automationExercise.openLogin();
    await automationExercise.signup(user);
    await expect(page).toHaveURL(/signup/);
    await automationExercise.completeAccountCreation(user);
    await automationExercise.assertLoggedUser(user.name);
    await automationExercise.deleteAccount();
  });

  test('@manual Deve navegar para produtos, pesquisar item e abrir os detalhes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /products/i }).click();
    if (page.url().includes('#google_vignette')) {
      await page.goto('/products');
    }
    await expect(page).toHaveURL(/products/);
    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();

    await page.locator('#search_product').fill('Blue Top');
    await page.locator('#submit_search').click();

    await expect(page.getByText('Searched Products')).toBeVisible();
    await expect(page.locator('.productinfo').filter({ hasText: 'Blue Top' }).first()).toBeVisible();

    await page.locator('a[href="/product_details/1"]').first().click();
    await expect(page).toHaveURL(/product_details/);
    await expect(page.getByText('Blue Top')).toBeVisible();
  });
});
