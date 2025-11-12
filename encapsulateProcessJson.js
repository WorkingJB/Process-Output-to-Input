/**
 * Encapsulates a Process JSON object for the Nintex Process Manager PUT API request
 *
 * This function takes the process JSON from a GET request response and wraps it
 * in the required structure for making a PUT update request to the API.
 *
 * @param {Object} processJson - The process JSON object from the GET /Api/v1/Processes/{id} response
 * @param {string} changeDescription - Description of the changes being made
 * @returns {Object} The encapsulated request body ready for the PUT request
 *
 * @example
 * // Get process data from API
 * const getResponse = await fetch('https://demo.promapp.com/tenant/Api/v1/Processes/process-id', {
 *   headers: { 'Authorization': `Bearer ${bearerToken}` }
 * });
 * const { processJson } = await getResponse.json();
 *
 * // Make updates to processJson
 * processJson.Name = "Updated Process Name";
 * processJson.Objective = "Updated objective";
 *
 * // Encapsulate for PUT request
 * const updatePayload = encapsulateProcessJson(processJson, "Updated process name and objective");
 *
 * // Send PUT request
 * await fetch('https://demo.promapp.com/tenant/Api/v1/Processes/process-id', {
 *   method: 'PUT',
 *   headers: {
 *     'Authorization': `Bearer ${bearerToken}`,
 *     '__RequestVerificationToken': verificationToken,
 *     'Content-Type': 'application/json',
 *     'x-requested-with': 'XMLHttpRequest'
 *   },
 *   body: JSON.stringify(updatePayload)
 * });
 */
function encapsulateProcessJson(processJson, changeDescription = "") {
  // Validate inputs
  if (!processJson || typeof processJson !== 'object') {
    throw new Error('processJson must be a valid object');
  }

  if (typeof changeDescription !== 'string') {
    throw new Error('changeDescription must be a string');
  }

  // Create the encapsulated structure required by the PUT API
  const encapsulatedPayload = {
    ProcessJson: JSON.stringify(processJson),
    ChangeDescription: changeDescription,
    DoSubmitForApproval: false,
    DoPublish: false,
    SuppressChangeNotification: false,
    SharedActivityCollectionEditModel: {
      ActivitiesToDelete: [],
      ActivitiesToShare: [],
      ActivitiesToUnlink: []
    },
    VariantConnectionChangeStates: []
  };

  return encapsulatedPayload;
}

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = encapsulateProcessJson;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
  exports.encapsulateProcessJson = encapsulateProcessJson;
}
