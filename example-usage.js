/**
 * Complete Example: Authenticating and Updating a Process
 *
 * This example demonstrates the full workflow for:
 * 1. Getting a Bearer token
 * 2. Getting a RequestVerificationToken
 * 3. Fetching a process
 * 4. Making updates to the process
 * 5. Encapsulating and sending the update
 */

const encapsulateProcessJson = require('./encapsulateProcessJson');

// Configuration
const BASE_URL = 'https://demo.promapp.com';
const TENANT_ID = '93555a16ceb24f139a6e8a40618d3f8b';
const TENANT_URL = `${BASE_URL}/${TENANT_ID}`;
const USERNAME = 'your-username@example.com';
const PASSWORD = 'your-password';
const PROCESS_ID = 'd4d28c92-9e48-44aa-a146-ee51403be621';

/**
 * Step 1: Get Bearer Token
 */
async function getBearerToken(username, password) {
  const params = new URLSearchParams({
    grant_type: 'password',
    username: username,
    password: password,
    duration: '60000'
  });

  const response = await fetch(`${TENANT_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    throw new Error(`Failed to get bearer token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Step 2: Get RequestVerificationToken
 * Note: This extracts the token from the HTML response
 */
async function getRequestVerificationToken(cookies) {
  const response = await fetch(`${TENANT_URL}/Login.aspx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: new URLSearchParams({
      ImpersonationEnabled: 'False',
      IsSingleSignOnEnabled: 'False',
      Login: 'Login',
      Password: PASSWORD,
      ResetPasswordEnabled: 'True',
      ReturnUrl: '',
      UserName: USERNAME
    })
  });

  const html = await response.text();

  // Extract the __RequestVerificationToken from the HTML
  const tokenMatch = html.match(/name="__RequestVerificationToken".*?value="([^"]+)"/);

  if (!tokenMatch) {
    throw new Error('Could not find RequestVerificationToken in response');
  }

  return tokenMatch[1];
}

/**
 * Step 3: Get Process Definition
 */
async function getProcess(processId, bearerToken) {
  const response = await fetch(`${TENANT_URL}/Api/v1/Processes/${processId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get process: ${response.statusText}`);
  }

  const data = await response.json();
  return data.processJson;
}

/**
 * Step 4: Update Process
 */
async function updateProcess(processId, processJson, changeDescription, bearerToken, verificationToken) {
  // Use the encapsulation function
  const updatePayload = encapsulateProcessJson(processJson, changeDescription);

  const response = await fetch(`${TENANT_URL}/Api/v1/Processes/${processId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      '__RequestVerificationToken': verificationToken,
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest'
    },
    body: JSON.stringify(updatePayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update process: ${response.statusText}\n${errorText}`);
  }

  return await response.json();
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('Step 1: Getting Bearer Token...');
    const bearerToken = await getBearerToken(USERNAME, PASSWORD);
    console.log('✓ Bearer token obtained');

    console.log('\nStep 2: Getting RequestVerificationToken...');
    const verificationToken = await getRequestVerificationToken(''); // Add cookies if needed
    console.log('✓ Verification token obtained');

    console.log('\nStep 3: Fetching process...');
    const processJson = await getProcess(PROCESS_ID, bearerToken);
    console.log(`✓ Process fetched: ${processJson.Name}`);

    console.log('\nStep 4: Making updates to process...');
    // Make your updates here
    processJson.Name = 'Updated Process Name';
    processJson.Objective = 'Updated objective description';
    console.log('✓ Updates applied to process JSON');

    console.log('\nStep 5: Sending update to API...');
    const result = await updateProcess(
      PROCESS_ID,
      processJson,
      'Updated process name and objective via API',
      bearerToken,
      verificationToken
    );
    console.log('✓ Process updated successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  getBearerToken,
  getRequestVerificationToken,
  getProcess,
  updateProcess
};
