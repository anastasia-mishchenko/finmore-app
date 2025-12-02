import { expect, Locator } from "@playwright/test";

export async function clickElement (locator : Locator, name : string) {
   try {
    console.log(`CLICK: ${name}`);
    await locator.click();
    console.log(`CLICK SUCCESS: ${name}`);
  } catch (error) {
    throw new Error(`CLICK FAILED: ${name}\n${error}`);
  }
}

export async function fillElement (locator : Locator, value : string, name : string){
try {
    console.log(`FILL: ${name} -> "${value}"`);
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
    const actual = await locator.inputValue();
    console.log(`FILL CHECK: ${name} VALUE = "${actual}"`);
  } catch (error) {
    throw new Error(`FILL FAILED: ${name}, VALUE="${value}"\n${error}`);
  }
}

export async function checkVisibility (locator : Locator, name : string){
try {
    console.log(`CHECK VISIBLE: ${name}`);
    await expect(locator).toBeVisible();
    console.log(`VISIBLE OK: ${name}`);
  } catch (error) {
    throw new Error(`NOT VISIBLE: ${name}\n${error}`);
  }

}

export async function verifyInputIsInvalid (locator : Locator, name : string) {
  try {
    console.log(`CHECK INVALID: ${name}`);
    const isValid = await locator.evaluate((el) => (el as any).validity.valid);
    expect(isValid).toBe(false);
    console.log(`INVALID OK: ${name}`);
  } catch (error) {
    throw new Error(`VALIDATION CHECK FAILED: ${name}\n${error}`);
  }
}

export async function verifyInputValidationMessage (locator : Locator, name : string) {
  try {
    console.log(`CHECK VALIDATION MESSAGE: ${name}`);
    const validationMessage = await locator.evaluate((el) => (el as any).validationMessage);
    expect(validationMessage).toBeTruthy();
    expect(validationMessage.length).toBeGreaterThan(0);
    console.log(`VALIDATION MESSAGE OK: ${name}`);
  } catch (error) {
    throw new Error(`VALIDATION MESSAGE CHECK FAILED: ${name}\n${error}`);
  }
}

export async function verifyInputValue (locator : Locator, value : string, name : string) {
  try {
    console.log(`CHECK INPUT VALUE: ${name}`);
    await expect(locator).toHaveValue(value);
    console.log(`INPUT VALUE OK: ${name}`);
  } catch (error) {
    throw new Error(`INPUT VALUE CHECK FAILED: ${name}\n${error}`);
  }
}

export async function verifyTextContent (locator : Locator, value : string, name : string) {
  try {
    console.log(`CHECK TEXT CONTENT: ${name}`);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText(value);
    console.log(`TEXT CONTENT OK: ${name}`);
  } catch (error) {
    throw new Error(`TEXT CONTENT CHECK FAILED: ${name}\n${error}`);
  }
}

  export async function selectOptionByValue (locator : Locator, value : string, name : string) {
    try {
      console.log(`SELECT OPTION: ${name}`);
      // Wait for select to be visible and enabled
      await expect(locator).toBeVisible();
      await expect(locator).toBeEnabled();
      
      // Wait for options to be loaded (more than just placeholder/default)
      await expect(async () => {
        const optionCount = await locator.locator('option').count();
        if (optionCount <= 1) {
          throw new Error('Options not loaded yet');
        }
      }).toPass({ timeout: 10000 });
      
      // Wait for the specific option to exist
      await expect(locator.locator(`option[value="${value}"]`)).toHaveCount(1, { timeout: 10000 });
      
      await locator.selectOption({ value: value });
      console.log(`OPTION SELECTED: ${name}`);
    } catch (error) {
      throw new Error(`SELECT OPTION FAILED: ${name}\n${error}`);
    }
  }



 

