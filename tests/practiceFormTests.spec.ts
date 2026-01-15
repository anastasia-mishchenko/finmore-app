import {test, expect} from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { practiceFormTerms } from '../test-data/practiceFormTerms';

test.describe('Practice Form Tests', ()=>{

test.beforeEach(async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.goto();
        await practiceFormPage.verifyFormIsVisible();
    });

    test('Fill first name', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillFirstName(practiceFormTerms.firstName);
        await expect(practiceFormPage.firstNameInput).toHaveValue(practiceFormTerms.firstName);
    });

    test('Fill last name', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillLastName(practiceFormTerms.lastName);
        await expect(practiceFormPage.lastNameInput).toHaveValue(practiceFormTerms.lastName);
    });

    test('Email validation - invalid email format', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillEmail(practiceFormTerms.invalidEmail);
        await practiceFormPage.clickSubmitButton();
        const isValid = await practiceFormPage.getEmailValidationState();
        expect(isValid).toBeFalsy();
    });
    
    test('Email validation - valid email format', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillEmail(practiceFormTerms.email);
        await practiceFormPage.clickSubmitButton();
        const isValid = await practiceFormPage.getEmailValidationState();
        expect(isValid).toBeTruthy();
    });

    test('Selecting one gender automatically deselects previous choice', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.selectGender('Male');
        await practiceFormPage.expectGenderToBeChecked('Male');
        await practiceFormPage.selectGender('Female');
        await practiceFormPage.expectGenderToBeChecked('Female');
        await practiceFormPage.expectGenderToBeUnchecked('Male');
        await practiceFormPage.selectGender('Other');
        await practiceFormPage.expectGenderToBeChecked('Other');
        await practiceFormPage.expectGenderToBeUnchecked('Female');  
    })

    test ('Mobile number validation - invalid mobile number', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillMobileNumber(practiceFormTerms.invalidMobileNumber);
        await practiceFormPage.clickSubmitButton();
        const isValid = await practiceFormPage.getMobileNumberValidationState();
        expect(isValid).toBeFalsy();
    });

    test ('Mobile number validation - valid mobile number', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillMobileNumber(practiceFormTerms.mobileNumber);
        await practiceFormPage.clickSubmitButton();
        const isValid = await practiceFormPage.getMobileNumberValidationState();
        expect(isValid).toBeTruthy();
    });

    test('Submit form with valid data and verify submission modal', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.fillPersonalDetails(
            practiceFormTerms.firstName,
            practiceFormTerms.lastName,
            practiceFormTerms.email,
            practiceFormTerms.mobileNumber
        );
        await practiceFormPage.selectGender('Male');
        await practiceFormPage.fillDateOfBirth(new Date('1990-05-15'));
        await practiceFormPage.fillSubjects(['Maths', 'English', 'Computer Science']);
        await practiceFormPage.selectHobby('Sports');
        await practiceFormPage.uploadPicture('test-data/images/test-image.jpg');
        await practiceFormPage.fillCurrentAddress(practiceFormTerms.address);
        await practiceFormPage.selectState('NCR');
        await practiceFormPage.selectCity('Delhi');
        await practiceFormPage.clickSubmitButton();
        await practiceFormPage.verifySubmissionModalIsVisible();
        await practiceFormPage.closeSubmissionModal();
        await expect(practiceFormPage.submissionModal).toContainText('Thanks for submitting the form');
        await expect(practiceFormPage.submissionModal).toContainText('John Doe');
    });

    test('Verify city dropdown is disabled when state is not selected', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.verifyCityDropdownIsDisabled();
    });

    test('Verify city dropdown is enabled when state is selected', async ({page})=>{
        const practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.selectState('NCR');
        await practiceFormPage.verifyCityDropdownIsEnabled();
        await practiceFormPage.selectCity('Delhi');
        await expect(practiceFormPage.cityDropdown).toContainText('Delhi');
    });


});