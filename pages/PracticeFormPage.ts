import { Locator, Page, expect } from "@playwright/test";
import {
  checkVisibility,
  clickElement,
  fillElement,
  getInputValidationState,
  verifyInputValue,
} from "../utils/globalMethods";

type Gender = "Male" | "Female" | "Other";
type Hobby = "Sports" | "Reading" | "Music";
type State = "NCR" | "Uttar Pradesh" | "Haryana" | "Rajasthan";
type City =
  | "Delhi"
  | "Gurgaon"
  | "Noida"
  | "Agra"
  | "Lucknow"
  | "Merrut"
  | "Karnal"
  | "Panipat"
  | "Jaipur"
  | "Jaiselmer";

export class PracticeFormPage {
 readonly page: Page;

  // Form locators
  readonly practiceForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsInput: Locator;
  readonly subjectsContainer: Locator;
  readonly uploadPictureInput: Locator;
  readonly currentAddressInput: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly submitButton: Locator;

  // Modal locators
  readonly submissionModal: Locator;
  readonly submissionModalCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form elements
    this.practiceForm = page.locator(".practice-form-wrapper");
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.getByPlaceholder("name@example.com");
    this.mobileNumberInput = page.getByPlaceholder("Mobile Number");
    this.dateOfBirthInput = page.locator("#dateOfBirthInput");
    this.subjectsInput = page.locator("#subjectsInput");
    this.subjectsContainer = page.locator("#subjectsContainer");
    this.uploadPictureInput = page.locator("#uploadPicture");
    this.currentAddressInput = page.getByPlaceholder("Current Address");
    this.stateDropdown = page.locator("#state");
    this.cityDropdown = page.locator("#city");
    this.submitButton = page.locator("#submit");

    // Modal elements
    this.submissionModal = page.locator(".modal-dialog");
    this.submissionModalCloseButton = page.locator("#closeLargeModal");
  }

  async goto(): Promise<void> {
    await this.page.goto("https://demoqa.com/automation-practice-form");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyFormIsVisible(): Promise<void> {
    await checkVisibility(this.practiceForm, "Practice form");
  }

  // Personal details
  async fillFirstName(firstName: string): Promise<void> {
    await fillElement(this.firstNameInput, firstName, "First name");
    await verifyInputValue(this.firstNameInput, firstName, "First name");
  }

  async fillLastName(lastName: string): Promise<void> {
    await fillElement(this.lastNameInput, lastName, "Last name");
    await verifyInputValue(this.lastNameInput, lastName, "Last name");
  }

  async fillEmail(email: string): Promise<void> {
    await fillElement(this.emailInput, email, "Email");
    await verifyInputValue(this.emailInput, email, "Email");
  }

  async fillMobileNumber(mobileNumber: string): Promise<void> {
    await fillElement(this.mobileNumberInput, mobileNumber, "Mobile number");
    await verifyInputValue(this.mobileNumberInput, mobileNumber, "Mobile number");
  }

  async fillPersonalDetails(
    firstName: string,
    lastName: string,
    email: string,
    mobile: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileNumberInput.fill(mobile);
  }

  async getEmailValidationState(): Promise<boolean> {
    return getInputValidationState(this.emailInput, "Email");
  }

  async getMobileNumberValidationState(): Promise<boolean> {
    return getInputValidationState(this.mobileNumberInput, "Mobile number");
  }

  // Gender selection
  async selectGender(gender: Gender): Promise<void> {
    await this.page.getByText(gender, { exact: true }).click();
    await expect(this.page.getByLabel(gender, { exact: true })).toBeChecked();
  }

  async expectGenderToBeChecked(gender: Gender): Promise<void> {
    await expect(this.page.getByLabel(gender, { exact: true })).toBeChecked();
  }

  async expectGenderToBeUnchecked(gender: Gender): Promise<void> {
    await expect(this.page.getByLabel(gender, { exact: true })).not.toBeChecked();
  }

  // Date of birth
  async fillDateOfBirth(date: Date): Promise<void> {
    const formattedDate = this.formatDate(date);
    await this.dateOfBirthInput.click({ clickCount: 3 });
    await this.page.keyboard.type(formattedDate);
    await this.page.keyboard.press("Escape");
    await expect(this.dateOfBirthInput).toHaveValue(formattedDate);
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // Subjects
  async fillSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      await this.subjectsInput.fill(subject);
      await this.page
        .locator(".subjects-auto-complete__option", { hasText: subject })
        .click();
      await expect(
        this.subjectsContainer.locator(".subjects-auto-complete__multi-value__label", {
          hasText: subject,
        })
      ).toBeVisible();
    }
  }

  // Hobbies
  async selectHobby(hobby: Hobby): Promise<void> {
    await this.page.getByText(hobby, { exact: true }).click();
    await expect(this.page.getByLabel(hobby)).toBeChecked();
  }

  // File upload
  async uploadPicture(filePath: string): Promise<void> {
    await this.uploadPictureInput.setInputFiles(filePath);
    await expect(this.uploadPictureInput).toHaveValue(/[^\\\/]+$/);
  }

  // Address
  async fillCurrentAddress(address: string): Promise<void> {
    await fillElement(this.currentAddressInput, address, "Current Address");
    await verifyInputValue(this.currentAddressInput, address, "Current Address");
  }

  // State & City dropdowns
  async selectState(state: State): Promise<void> {
    await this.stateDropdown.click();
    await this.page.getByText(state, { exact: true }).click();
    await expect(this.stateDropdown).toContainText(state);
  }

  async selectCity(city: City): Promise<void> {
    await this.cityDropdown.click();
    await this.page.getByText(city, { exact: true }).click();
    await expect(this.cityDropdown).toContainText(city);
  }

  async verifyCityDropdownIsDisabled(): Promise<void> {
    await expect(this.cityDropdown.locator("input")).toBeDisabled();
  }

  async verifyCityDropdownIsEnabled(): Promise<void> {
    await expect(this.cityDropdown.locator("input")).toBeEnabled();
  }

  // Form submission
  async clickSubmitButton(): Promise<void> {
    await clickElement(this.submitButton, "Submit button");
  }

  async verifySubmissionModalIsVisible(): Promise<void> {
    await checkVisibility(this.submissionModal, "Submission modal");
  }

  async closeSubmissionModal(): Promise<void> {
    await this.submissionModalCloseButton.scrollIntoViewIfNeeded();
    await this.submissionModalCloseButton.click({ force: true });
  }
}
