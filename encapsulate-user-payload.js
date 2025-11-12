/**
 * Script to encapsulate the user's provided process JSON payload
 *
 * This demonstrates using the encapsulateProcessJson function with
 * the actual payload provided by the user.
 */

const encapsulateProcessJson = require('./encapsulateProcessJson');
const fs = require('fs');

console.log('='.repeat(80));
console.log('ENCAPSULATING USER PROVIDED PROCESS JSON');
console.log('='.repeat(80));

// Load the user's payload
console.log('\n1. Loading user-payload.json...');
const fullPayload = JSON.parse(fs.readFileSync('./user-payload.json', 'utf8'));

// Extract just the processJson (this is what we need for the PUT request)
console.log('\n2. Extracting processJson from GET response...');
const processJson = fullPayload.processJson;

console.log(`   ✓ Process Name: "${processJson.Name}"`);
console.log(`   ✓ Process ID: ${processJson.Id}`);
console.log(`   ✓ UniqueId: ${processJson.UniqueId}`);
console.log(`   ✓ State: ${processJson.State} (StateId: ${processJson.StateId})`);
console.log(`   ✓ Version: ${processJson.Version}`);
console.log(`   ✓ Objective: "${processJson.Objective}"`);
console.log(`   ✓ Owner: ${processJson.Owner}`);
console.log(`   ✓ Expert: ${processJson.Expert}`);
console.log(`   ✓ Group: ${processJson.Group}`);
console.log(`   ✓ Activities: ${processJson.ProcessProcedures.Activity.length}`);

// Encapsulate for PUT request
console.log('\n3. Encapsulating processJson for PUT request...');
const changeDescription = "Updated process objective and activities";
const encapsulatedPayload = encapsulateProcessJson(processJson, changeDescription);

console.log(`   ✓ ProcessJson stringified: ${encapsulatedPayload.ProcessJson.length} characters`);
console.log(`   ✓ ChangeDescription: "${encapsulatedPayload.ChangeDescription}"`);
console.log(`   ✓ DoSubmitForApproval: ${encapsulatedPayload.DoSubmitForApproval}`);
console.log(`   ✓ DoPublish: ${encapsulatedPayload.DoPublish}`);
console.log(`   ✓ SuppressChangeNotification: ${encapsulatedPayload.SuppressChangeNotification}`);

// Save the encapsulated payload to a file
console.log('\n4. Saving encapsulated payload...');
const outputFile = './user-payload-encapsulated.json';
fs.writeFileSync(outputFile, JSON.stringify(encapsulatedPayload, null, 2));
console.log(`   ✓ Saved to: ${outputFile}`);

// Show structure overview
console.log('\n5. Encapsulated Payload Structure:');
console.log(JSON.stringify({
  ProcessJson: `<stringified JSON - ${encapsulatedPayload.ProcessJson.length} chars>`,
  ChangeDescription: encapsulatedPayload.ChangeDescription,
  DoSubmitForApproval: encapsulatedPayload.DoSubmitForApproval,
  DoPublish: encapsulatedPayload.DoPublish,
  SuppressChangeNotification: encapsulatedPayload.SuppressChangeNotification,
  SharedActivityCollectionEditModel: encapsulatedPayload.SharedActivityCollectionEditModel,
  VariantConnectionChangeStates: encapsulatedPayload.VariantConnectionChangeStates
}, null, 2));

// Show a preview of the stringified ProcessJson
console.log('\n6. Preview of stringified ProcessJson (first 300 chars):');
console.log('   ' + encapsulatedPayload.ProcessJson.substring(0, 300) + '...');

console.log('\n' + '='.repeat(80));
console.log('READY FOR PUT REQUEST!');
console.log('='.repeat(80));

console.log(`
Usage:
  The encapsulated payload is now ready to be sent in a PUT request:

  curl --location --request PUT 'https://demo.promapp.com/tenant/Api/v1/Processes/${processJson.UniqueId}' \\
    --header 'Authorization: Bearer <your-bearer-token>' \\
    --header '__RequestVerificationToken: <your-verification-token>' \\
    --header 'Content-Type: application/json' \\
    --header 'x-requested-with: XMLHttpRequest' \\
    --data '@${outputFile}'
`);

console.log('Or in JavaScript/Node.js:');
console.log(`
  const response = await fetch('https://demo.promapp.com/tenant/Api/v1/Processes/${processJson.UniqueId}', {
    method: 'PUT',
    headers: {
      'Authorization': \`Bearer \${bearerToken}\`,
      '__RequestVerificationToken': verificationToken,
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest'
    },
    body: JSON.stringify(encapsulatedPayload)
  });
`);
