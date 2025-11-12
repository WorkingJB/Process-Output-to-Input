/**
 * Demo Script - Shows the encapsulation transformation
 *
 * This script demonstrates how the encapsulateProcessJson function
 * transforms the GET response into the PUT request format.
 */

const encapsulateProcessJson = require('./encapsulateProcessJson');
const fs = require('fs');

// Load the example GET response
const getResponseExample = JSON.parse(fs.readFileSync('./ExampleGetProcessResponse', 'utf8'));

console.log('='.repeat(80));
console.log('PROCESS JSON ENCAPSULATION DEMO');
console.log('='.repeat(80));

console.log('\n1. Original GET Response Structure:');
console.log('   - processJson: [Object with process data]');
console.log('   - processActions: [Object with permission flags]');
console.log('   - processWarnings: [Array]');
console.log('   - configuration: [Object with config settings]');
console.log('   - variationSetData: null');
console.log('   - etc...');

console.log('\n2. Extracting processJson for update:');
const processJson = getResponseExample.processJson;
console.log(`   Process Name: "${processJson.Name}"`);
console.log(`   Process ID: ${processJson.Id}`);
console.log(`   Process UniqueId: ${processJson.UniqueId}`);
console.log(`   Current State: ${processJson.State}`);
console.log(`   Owner: ${processJson.Owner}`);

console.log('\n3. Making updates to the process:');
// Make some example updates
processJson.Name = "Updated Process Name";
processJson.Objective = "Updated objective via API";
processJson.StateId = 1; // Set to Draft
console.log(`   ✓ Updated Name: "${processJson.Name}"`);
console.log(`   ✓ Updated Objective: "${processJson.Objective}"`);
console.log(`   ✓ Updated StateId: ${processJson.StateId}`);

console.log('\n4. Encapsulating for PUT request:');
const updatePayload = encapsulateProcessJson(
  processJson,
  "Updated process name and objective via API demo"
);

console.log('   ✓ ProcessJson: [Stringified - ' + updatePayload.ProcessJson.length + ' characters]');
console.log(`   ✓ ChangeDescription: "${updatePayload.ChangeDescription}"`);
console.log(`   ✓ DoSubmitForApproval: ${updatePayload.DoSubmitForApproval}`);
console.log(`   ✓ DoPublish: ${updatePayload.DoPublish}`);
console.log(`   ✓ SuppressChangeNotification: ${updatePayload.SuppressChangeNotification}`);
console.log('   ✓ SharedActivityCollectionEditModel: [Object with empty arrays]');
console.log('   ✓ VariantConnectionChangeStates: [Empty array]');

console.log('\n5. PUT Request Body Structure:');
console.log(JSON.stringify({
  ProcessJson: '<stringified JSON - ' + updatePayload.ProcessJson.length + ' chars>',
  ChangeDescription: updatePayload.ChangeDescription,
  DoSubmitForApproval: updatePayload.DoSubmitForApproval,
  DoPublish: updatePayload.DoPublish,
  SuppressChangeNotification: updatePayload.SuppressChangeNotification,
  SharedActivityCollectionEditModel: updatePayload.SharedActivityCollectionEditModel,
  VariantConnectionChangeStates: updatePayload.VariantConnectionChangeStates
}, null, 2));

console.log('\n6. Verification - ProcessJson is stringified:');
console.log('   Type of ProcessJson in GET response:', typeof getResponseExample.processJson);
console.log('   Type of ProcessJson in PUT payload:', typeof updatePayload.ProcessJson);
console.log('   ✓ Correctly transformed from object to string');

console.log('\n7. Sample of stringified ProcessJson (first 200 chars):');
console.log('   ' + updatePayload.ProcessJson.substring(0, 200) + '...');

console.log('\n' + '='.repeat(80));
console.log('DEMO COMPLETE - Ready to send PUT request!');
console.log('='.repeat(80));

// Optional: Write the full payload to a file for inspection
fs.writeFileSync(
  './demo-output-payload.json',
  JSON.stringify(updatePayload, null, 2)
);
console.log('\n✓ Full payload written to: demo-output-payload.json');
