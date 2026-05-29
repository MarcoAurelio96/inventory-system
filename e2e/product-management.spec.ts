import { test, expect } from "@playwright/test";

test.describe("Inventario de Carpintería Los Artesanos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
    await page.getByRole("button", { name: "Crear Producto" }).click();
    await page.locator('input[name="name"]').fill("Lasur para exterior 2,5 L");
    await page.getByRole("combobox").selectOption({ label: "Barnices y Tintes" });
    await page.locator('input[name="price"]').fill("24.9");
    await page.locator('input[name="stock"]').fill("8");
    await page.getByRole("button", { name: "Crear Producto" }).click();

    await expect(page.getByText("Lasur para exterior 2,5 L")).toBeVisible();
    await expect(page.getByText("$24.90")).toBeVisible();
  });

  test("filtrar por categoría muestra solo los productos de esa categoría", async ({ page }) => {
    await page.getByRole("button", { name: "Herrajes" }).click();

    const productCards = page.getByTestId("product-card");
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      await expect(productCards.nth(i).getByTestId("product-category")).toHaveText("Herrajes");
    }
  });

test("ajuste de stock: hacer clic en el botón + incrementa el stock en 2", async ({ page }) => {
  const card = page.getByTestId("product-card").first();
  await expect(card).toBeVisible({ timeout: 10000 });
  
  const stockDisplay = card.getByTestId("product-stock");
  const plusButton = card.getByRole("button", { name: "+" });
  
  const initialStock = parseInt((await stockDisplay.textContent()) || "0", 10);
  
  await plusButton.click({ force: true });
  await expect(stockDisplay).toHaveText(String(initialStock + 1), { timeout: 10000 });
  
  await plusButton.click({ force: true });
  await expect(stockDisplay).toHaveText(String(initialStock + 2), { timeout: 10000 });
});
});