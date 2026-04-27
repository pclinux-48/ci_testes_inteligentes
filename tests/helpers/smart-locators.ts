import { expect, type Locator, type Page } from '@playwright/test';

type LocatorFactory = (page: Page) => Locator;

async function resolveVisibleLocator(
  page: Page,
  description: string,
  candidates: LocatorFactory[],
): Promise<Locator> {
  for (const candidate of candidates) {
    const locator = candidate(page).first();

    try {
      if (await locator.isVisible({ timeout: 1500 })) {
        return locator;
      }
    } catch {
      // Try the next fallback locator.
    }
  }

  throw new Error(`Nao foi possivel localizar "${description}" com os fallbacks definidos.`);
}

export async function smartFill(
  page: Page,
  description: string,
  value: string,
  candidates: LocatorFactory[],
): Promise<void> {
  const locator = await resolveVisibleLocator(page, description, candidates);
  await locator.fill(value);
}

export async function smartClick(
  page: Page,
  description: string,
  candidates: LocatorFactory[],
): Promise<void> {
  const locator = await resolveVisibleLocator(page, description, candidates);
  await locator.click();
}

export async function smartSelect(
  page: Page,
  description: string,
  value: string,
  candidates: LocatorFactory[],
): Promise<void> {
  const locator = await resolveVisibleLocator(page, description, candidates);
  await locator.selectOption(value);
}

export async function smartExpectVisible(
  page: Page,
  description: string,
  candidates: LocatorFactory[],
): Promise<void> {
  const locator = await resolveVisibleLocator(page, description, candidates);
  await expect(locator).toBeVisible();
}
