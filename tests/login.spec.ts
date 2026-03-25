import { test, expect } from '@playwright/test';
import { LoginPage } from 'pages/login';
import { InventoryPage } from 'pages/inventory';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate('/');
  });

  test('should display login form with all elements', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.page.locator('.login_credentials')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(loginPage.appLogo).toContainText('Swag Labs');
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should show error with empty username', async () => {
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('should show error with empty password', async () => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginButton.click();
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('should show error for locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('should clear error when user clicks login button again after error', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    await expect(loginPage.errorMessage).toBeVisible();
    
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.isOnInventoryPage()).toBeTruthy();
  });

  test('should logout and return to login page', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    
    await loginPage.burgerMenuButton.click();
    await loginPage.logoutLink.click();
    
    await expect(loginPage.page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
