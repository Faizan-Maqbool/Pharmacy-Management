"""
Medicine Inventory Web Application - Selenium Test Cases
Requirements: Chrome WebDriver, Selenium, pytest
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time


class TestMedicineInventory:
    
    @classmethod
    def setup_class(cls):
        """Setup Chrome driver with headless mode for AWS EC2 compatibility"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(10)
        cls.wait = WebDriverWait(cls.driver, 15)
        
        # Replace with your actual application URL
        cls.base_url = "http://localhost:3000"  # Update this URL
    
    @classmethod
    def teardown_class(cls):
        """Clean up after all tests"""
        cls.driver.quit()
    
    def test_01_page_loads_successfully(self):
        """Test Case 1: Verify the main page loads with all essential elements"""
        self.driver.get(self.base_url)
        
        # Check page title
        assert "Medicine" in self.driver.title or "Inventory" in self.driver.title
        
        # Verify main components are present
        product_form = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "productform"))
        )
        assert product_form.is_displayed()
        
        product_list = self.driver.find_element(By.CLASS_NAME, "productlist")
        assert product_list.is_displayed()
        
        cart = self.driver.find_element(By.CLASS_NAME, "cart")
        assert cart.is_displayed()
    
    def test_02_add_medicine_with_all_required_fields(self):
        """Test Case 2: Successfully add a new medicine with all required fields"""
        self.driver.get(self.base_url)
        
        # Fill required fields
        name_input = self.driver.find_element(By.NAME, "name")
        name_input.clear()
        name_input.send_keys("Paracetamol 500mg")
        
        price_input = self.driver.find_element(By.NAME, "price")
        price_input.clear()
        price_input.send_keys("50")
        
        stock_input = self.driver.find_element(By.NAME, "stock")
        stock_input.clear()
        stock_input.send_keys("100")
        
        expiry_input = self.driver.find_element(By.NAME, "expiry")
        expiry_input.clear()
        expiry_input.send_keys("12/2025")
        
        # Fill optional fields
        manufacturer_input = self.driver.find_element(By.NAME, "manufacturer")
        manufacturer_input.clear()
        manufacturer_input.send_keys("ABC Pharma")
        
        category_select = Select(self.driver.find_element(By.NAME, "category"))
        category_select.select_by_visible_text("Painkillers")
        
        # Submit form
        submit_button = self.driver.find_element(By.CLASS_NAME, "productform__submit")
        submit_button.click()
        
        # Verify medicine appears in product list
        time.sleep(2)  # Wait for form submission
        product_cards = self.driver.find_elements(By.CLASS_NAME, "productcard")
        
        # Check if the new medicine is added
        medicine_found = False
        for card in product_cards:
            if "Paracetamol 500mg" in card.text:
                medicine_found = True
                break
        
        assert medicine_found, "Medicine was not added to the product list"
    
    def test_03_form_validation_missing_required_fields(self):
        """Test Case 3: Verify form validation when required fields are missing"""
        self.driver.get(self.base_url)
        
        # Try to submit form without filling required fields
        submit_button = self.driver.find_element(By.CLASS_NAME, "productform__submit")
        submit_button.click()
        
        # Check for error message
        error_message = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "productform__error"))
        )
        
        assert error_message.is_displayed()
        assert "Please fill all required fields" in error_message.text
    
    def test_04_form_reset_functionality(self):
        """Test Case 4: Verify form reset button clears all fields"""
        self.driver.get(self.base_url)
        
        # Fill some fields
        name_input = self.driver.find_element(By.NAME, "name")
        name_input.send_keys("Test Medicine")
        
        price_input = self.driver.find_element(By.NAME, "price")
        price_input.send_keys("25")
        
        manufacturer_input = self.driver.find_element(By.NAME, "manufacturer")
        manufacturer_input.send_keys("Test Manufacturer")
        
        # Click reset button
        reset_button = self.driver.find_element(By.CLASS_NAME, "productform__reset")
        reset_button.click()
        
        # Verify all fields are cleared
        assert name_input.get_attribute("value") == ""
        assert price_input.get_attribute("value") == ""
        assert manufacturer_input.get_attribute("value") == ""
    
    def test_05_add_medicine_to_cart_default_quantity(self):
        """Test Case 5: Add medicine to cart with default quantity (1)"""
        self.driver.get(self.base_url)
        
        # First ensure there's at least one medicine in the list
        self._add_test_medicine()
        
        # Find and click "Add to Cart" button
        add_to_cart_buttons = self.driver.find_elements(By.CLASS_NAME, "productcard__add")
        if add_to_cart_buttons:
            add_to_cart_buttons[0].click()
            
            # Verify item appears in cart
            time.sleep(1)
            cart_items = self.driver.find_elements(By.CLASS_NAME, "cart__item")
            assert len(cart_items) > 0, "Medicine was not added to cart"
            
            # Verify quantity is 1
            cart_item_qty = cart_items[0].find_element(By.CLASS_NAME, "cart__item__qty")
            assert "× 1" in cart_item_qty.text
    
    def test_06_modify_quantity_before_adding_to_cart(self):
        """Test Case 6: Modify quantity using +/- buttons before adding to cart"""
        self.driver.get(self.base_url)
        
        # Ensure there's a medicine in the list
        self._add_test_medicine()
        
        # Find quantity controls
        plus_buttons = self.driver.find_elements(By.CLASS_NAME, "productcard__qty-btn")
        if len(plus_buttons) >= 2:
            # Click plus button twice (should make quantity 3)
            plus_buttons[1].click()  # Second button is usually the plus
            plus_buttons[1].click()
            
            # Verify quantity display
            qty_display = self.driver.find_element(By.CLASS_NAME, "productcard__qty-value")
            assert "3" in qty_display.text
            
            # Add to cart
            add_button = self.driver.find_element(By.CLASS_NAME, "productcard__add")
            add_button.click()
            
            # Verify cart shows correct quantity
            time.sleep(1)
            cart_item_qty = self.driver.find_element(By.CLASS_NAME, "cart__item__qty")
            assert "× 3" in cart_item_qty.text
    
    def test_07_cart_toggle_functionality(self):
        """Test Case 7: Test cart expand/collapse functionality"""
        self.driver.get(self.base_url)
        
        # Find cart header
        cart_header = self.driver.find_element(By.CLASS_NAME, "cart__header")
        
        # Initially cart should be open (based on default state)
        cart_body = self.driver.find_element(By.CLASS_NAME, "cart__body")
        assert cart_body.is_displayed()
        
        # Click to toggle (should close)
        cart_header.click()
        time.sleep(0.5)
        
        # Cart body should be hidden
        cart_bodies = self.driver.find_elements(By.CLASS_NAME, "cart__body")
        assert len(cart_bodies) == 0 or not cart_bodies[0].is_displayed()
        
        # Click again to toggle (should open)
        cart_header.click()
        time.sleep(0.5)
        
        cart_body = self.driver.find_element(By.CLASS_NAME, "cart__body")
        assert cart_body.is_displayed()
    
    def test_08_remove_item_from_cart(self):
        """Test Case 8: Remove item from cart using X button"""
        self.driver.get(self.base_url)
        
        # Add a medicine to cart first
        self._add_test_medicine()
        add_to_cart_button = self.driver.find_element(By.CLASS_NAME, "productcard__add")
        add_to_cart_button.click()
        
        time.sleep(1)
        
        # Verify item is in cart
        cart_items = self.driver.find_elements(By.CLASS_NAME, "cart__item")
        initial_count = len(cart_items)
        assert initial_count > 0
        
        # Remove item from cart
        remove_button = self.driver.find_element(By.CLASS_NAME, "cart__remove")
        remove_button.click()
        
        time.sleep(1)
        
        # Verify item is removed
        cart_items_after = self.driver.find_elements(By.CLASS_NAME, "cart__item")
        assert len(cart_items_after) == initial_count - 1
    
    def test_09_cart_total_calculation(self):
        """Test Case 9: Verify cart total calculation is correct"""
        self.driver.get(self.base_url)
        
        # Add multiple medicines with different quantities
        self._add_test_medicine("Medicine A", "100")
        self._add_test_medicine("Medicine B", "50")
        
        # Add first medicine (qty 1, price 100)
        add_buttons = self.driver.find_elements(By.CLASS_NAME, "productcard__add")
        add_buttons[0].click()
        
        time.sleep(1)
        
        # Add second medicine with quantity 2 (qty 2, price 50 each)
        if len(add_buttons) > 1:
            # Increase quantity to 2
            qty_plus_buttons = self.driver.find_elements(By.CLASS_NAME, "productcard__qty-btn")
            if len(qty_plus_buttons) >= 4:  # Each product has 2 buttons (- and +)
                qty_plus_buttons[3].click()  # Click + for second product
            
            add_buttons[1].click()
        
        time.sleep(2)
        
        # Check cart total (should be 100 + (50 * 2) = 200)
        total_elements = self.driver.find_elements(By.CLASS_NAME, "cart__summary__total")
        if total_elements:
            total_text = total_elements[0].text
            # Extract numeric value from "Rs. 200" format
            import re
            total_value = re.search(r'Rs\. (\d+)', total_text)
            if total_value:
                assert int(total_value.group(1)) == 200, f"Expected total 200, got {total_value.group(1)}"
    
    def test_10_low_stock_warning_display(self):
        """Test Case 10: Verify low stock warning appears for medicines with stock < 10"""
        self.driver.get(self.base_url)
        
        # Add medicine with low stock (< 10)
        name_input = self.driver.find_element(By.NAME, "name")
        name_input.clear()
        name_input.send_keys("Low Stock Medicine")
        
        price_input = self.driver.find_element(By.NAME, "price")
        price_input.clear()
        price_input.send_keys("75")
        
        stock_input = self.driver.find_element(By.NAME, "stock")
        stock_input.clear()
        stock_input.send_keys("5")  # Low stock
        
        expiry_input = self.driver.find_element(By.NAME, "expiry")
        expiry_input.clear()
        expiry_input.send_keys("06/2026")
        
        submit_button = self.driver.find_element(By.CLASS_NAME, "productform__submit")
        submit_button.click()
        
        time.sleep(2)
        
        # Check for low stock warning
        low_stock_cards = self.driver.find_elements(By.CLASS_NAME, "productcard--lowstock")
        assert len(low_stock_cards) > 0, "Low stock warning not displayed"
        
        low_stock_badge = self.driver.find_element(By.CLASS_NAME, "productcard__lowstock")
        assert low_stock_badge.is_displayed()
        assert "Low Stock" in low_stock_badge.text
    
    def _add_test_medicine(self, name="Test Medicine", price="30"):
        """Helper method to add a test medicine"""
        name_input = self.driver.find_element(By.NAME, "name")
        name_input.clear()
        name_input.send_keys(name)
        
        price_input = self.driver.find_element(By.NAME, "price")
        price_input.clear()
        price_input.send_keys(price)
        
        stock_input = self.driver.find_element(By.NAME, "stock")
        stock_input.clear()
        stock_input.send_keys("50")
        
        expiry_input = self.driver.find_element(By.NAME, "expiry")
        expiry_input.clear()
        expiry_input.send_keys("12/2025")
        
        submit_button = self.driver.find_element(By.CLASS_NAME, "productform__submit")
        submit_button.click()
        
        time.sleep(1)


# Additional configuration for pytest
if __name__ == "__main__":
    pytest.main([__file__, "-v"])


"""
Installation Requirements:
pip install selenium pytest

Chrome WebDriver Setup:
1. Download ChromeDriver from https://chromedriver.chromium.org/
2. Place chromedriver in your PATH or specify path in webdriver.Chrome()

Running Tests:
1. Start your web application on localhost:3000
2. Run: pytest test_medicine_inventory.py -v
3. For specific test: pytest test_medicine_inventory.py::TestMedicineInventory::test_01_page_loads_successfully -v

Jenkins Pipeline Integration:
- Use headless Chrome (already configured)
- Ensure ChromeDriver is installed on EC2 instance
- Add display setup: export DISPLAY=:99 (if needed)
- Install required Python packages in pipeline
"""