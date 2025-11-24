// Utility function to format numbers as Indian currency
function formatCurrency(num) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
}

// Function to dynamically update slider display values and trigger EMI calculation
function updateSliderValue(slider, displayId, type) {
    const value = slider.value;
    const display = document.getElementById(displayId);

    if (type === 'money') {
        display.textContent = formatCurrency(value);
    } else if (type === 'years') {
        display.textContent = `${value} Years`;
    } else if (type === 'percent') {
        display.textContent = `${parseFloat(value).toFixed(1)} %`;
    }
    // Recalculate EMI immediately when sliders/units change
    calculateEMI();
}

// Function to calculate and display the EMI
function calculateEMI() {
    // Get selected unit type price (base price in Rupees)
    const unitPrice = parseFloat(document.querySelector('input[name="emiUnitType"]:checked')?.value || 24000000);

    // Get slider values
    const advancePayment = parseFloat(document.getElementById('advance-payment-slider')?.value || 600000);
    const annualRate = parseFloat(document.getElementById('interest-rate-slider')?.value || 7.0);
    const durationYears = parseFloat(document.getElementById('duration-slider')?.value || 25);

    // Calculation variables
    const principalLoanAmount = unitPrice - advancePayment; // P
    const monthlyInterestRate = (annualRate / 100) / 12; // r
    const numberOfMonths = durationYears * 12; // n

    let emi = 0;
    
    if (principalLoanAmount > 0 && monthlyInterestRate > 0 && numberOfMonths > 0) {
        // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
        const powerFactor = Math.pow((1 + monthlyInterestRate), numberOfMonths);
        // Fallback for near-zero interest/term (unlikely with given ranges)
        if (powerFactor > 1.000001) {
            emi = principalLoanAmount * monthlyInterestRate * powerFactor / (powerFactor - 1);
        } else {
            emi = principalLoanAmount / numberOfMonths;
        }
    } else if (principalLoanAmount <= 0) {
        // Advance payment covers the full price or is equal to it
        emi = 0;
    }

    const emiAmountElement = document.getElementById('emi-amount');
    const emiResultBox = document.getElementById('emi-result');

    if (emiAmountElement) {
        emiAmountElement.textContent = formatCurrency(emi);
        emiResultBox.classList.remove('hidden');
    }
    console.log(`EMI Calculated: ${formatCurrency(emi)} for Loan: ${formatCurrency(principalLoanAmount)}`);
}


// Function to handle form submission for the registration forms
function handleRegistration(event) {
    event.preventDefault(); // Stop the default form submission

    // Determine which form triggered the event (EMI or Offers Registration)
    const formId = event.target.id;
    
    // Get data from the form
    const nameInput = document.getElementById('offers-reg-name');
    const mobileInput = document.getElementById('offers-reg-mobile');
    const name = nameInput ? nameInput.value : 'Guest';
    const mobile = mobileInput ? mobileInput.value : '';
    const selectedUnitElement = document.querySelector('input[name="offersUnitType"]:checked');
    const selectedUnit = selectedUnitElement ? selectedUnitElement.value : 'Unknown';
    const messageBox = document.getElementById('registration-message');

    // Simple validation
    if (mobile.length !== 10) {
        messageBox.className = 'mt-4 p-3 rounded-lg text-center font-medium bg-red-100 text-red-700 block';
        messageBox.textContent = 'Please enter a valid 10-digit mobile number.';
        messageBox.classList.remove('hidden');
        return;
    }

    // Simulate sending data (replace with actual API call)
    console.log(`Registration Data from ${formId}: Name=${name}, Mobile=${mobile}, Unit=${selectedUnit}`);

    // Display success message
    messageBox.className = 'mt-4 p-3 rounded-lg text-center font-medium bg-green-100 text-green-700 block';
    messageBox.textContent = `Thank you, ${name}! Your request has been registered. We will contact you soon.`;
    messageBox.classList.remove('hidden');

    // Clear the form fields
    event.target.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000);
}

// Combined Initialization Function
function initializePage() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Set up initial slider displays and EMI calculation
    const advanceSlider = document.getElementById('advance-payment-slider');
    const durationSlider = document.getElementById('duration-slider');
    const interestSlider = document.getElementById('interest-rate-slider');

    if (advanceSlider) updateSliderValue(advanceSlider, 'advance-payment-value', 'money');
    if (durationSlider) updateSliderValue(durationSlider, 'duration-value', 'years');
    if (interestSlider) updateSliderValue(interestSlider, 'interest-rate-value', 'percent');
    
    // Initial EMI calculation (will run via the calls above if sliders are present)
    if (advanceSlider) calculateEMI();

    // Attach form handler to the offers registration form
    const registrationForm = document.getElementById('offers-registration-form');
    if (registrationForm) {
        registrationForm.onsubmit = handleRegistration;
    }
}

// Initialize the page once all content is loaded
window.onload = initializePage;