# Process JSON Encapsulation for Nintex Process Manager API

This repository contains utilities for working with the Nintex Process Manager API, specifically for encapsulating Process JSON payloads for PUT update requests.

## Overview

The Nintex Process Manager API requires a specific structure when updating processes:
- **GET requests** return process data with `processJson` as a nested object
- **PUT requests** require `processJson` to be stringified and wrapped in additional metadata

This utility handles that transformation automatically.

## API Workflow

### Authentication Flow

1. **Bearer Token** - OAuth2 password grant
   - Endpoint: `POST /oauth2/token`
   - Returns: JWT bearer token for API requests

2. **RequestVerificationToken** - CSRF token
   - Endpoint: `POST /Login.aspx`
   - Returns: HTML page with embedded token (used in PUT request header)

### Process Update Flow

3. **GET Process** - Retrieve current process definition
   - Endpoint: `GET /Api/v1/Processes/{processId}`
   - Returns: Process data with `processJson` object

4. **PUT Process** - Update process with changes
   - Endpoint: `PUT /Api/v1/Processes/{processId}`
   - Requires: Encapsulated process JSON with metadata

## Files

- **`encapsulateProcessJson.js`** - Core function for encapsulating process JSON
- **`example-usage.js`** - Complete example showing authentication and update workflow
- **`ExampleAuthTokenRequest`** - Example Bearer token request
- **`ExampleAuthTokenResponse`** - Example Bearer token response
- **`ExampleRequestVerificationToken`** - Example verification token request
- **`ExampleRequestVerificationResponse`** - Example verification token response (HTML)
- **`ExampleGetProcessRequest`** - Example GET process request
- **`ExampleGetProcessResponse`** - Example GET process response
- **`ExampleUpdateProcessRequest`** - Example PUT update request

## Usage

### Basic Function Usage

```javascript
const encapsulateProcessJson = require('./encapsulateProcessJson');

// Get process from API
const response = await fetch('https://demo.promapp.com/tenant/Api/v1/Processes/process-id', {
  headers: { 'Authorization': `Bearer ${bearerToken}` }
});
const { processJson } = await response.json();

// Make your updates
processJson.Name = "Updated Process Name";
processJson.Objective = "Updated objective";

// Encapsulate for PUT request
const updatePayload = encapsulateProcessJson(
  processJson,
  "Updated process name and objective"
);

// Send PUT request
await fetch('https://demo.promapp.com/tenant/Api/v1/Processes/process-id', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    '__RequestVerificationToken': verificationToken,
    'Content-Type': 'application/json',
    'x-requested-with': 'XMLHttpRequest'
  },
  body: JSON.stringify(updatePayload)
});
```

### Complete Workflow Example

See `example-usage.js` for a full working example that includes:
- Obtaining Bearer token
- Getting RequestVerificationToken
- Fetching a process
- Making updates
- Encapsulating and sending the update

```javascript
node example-usage.js
```

## Function Reference

### `encapsulateProcessJson(processJson, changeDescription)`

Encapsulates a process JSON object for the PUT API request.

**Parameters:**
- `processJson` (Object) - The process JSON object from GET response
- `changeDescription` (String) - Description of changes being made (default: "")

**Returns:**
- (Object) - Encapsulated request body with structure:
  ```javascript
  {
    ProcessJson: "<stringified process JSON>",
    ChangeDescription: "Description of changes",
    DoSubmitForApproval: false,
    DoPublish: false,
    SuppressChangeNotification: false,
    SharedActivityCollectionEditModel: {
      ActivitiesToDelete: [],
      ActivitiesToShare: [],
      ActivitiesToUnlink: []
    },
    VariantConnectionChangeStates: []
  }
  ```

**Throws:**
- Error if `processJson` is not a valid object
- Error if `changeDescription` is not a string

## PUT Request Structure

The encapsulated payload structure is:

```json
{
  "ProcessJson": "<stringified JSON>",
  "ChangeDescription": "Description of the update",
  "DoSubmitForApproval": false,
  "DoPublish": false,
  "SuppressChangeNotification": false,
  "SharedActivityCollectionEditModel": {
    "ActivitiesToDelete": [],
    "ActivitiesToShare": [],
    "ActivitiesToUnlink": []
  },
  "VariantConnectionChangeStates": []
}
```

### Key Points:

- **ProcessJson** must be a stringified version of the process object (not the raw object)
- **ChangeDescription** is the update comment that appears in the audit log
- **DoSubmitForApproval** and **DoPublish** control workflow actions (kept as `false`)
- **SharedActivityCollectionEditModel** handles shared procedure updates (empty by default)

## Required Headers for PUT Request

```javascript
{
  'Authorization': 'Bearer <jwt-token>',
  '__RequestVerificationToken': '<csrf-token>',
  'Content-Type': 'application/json',
  'x-requested-with': 'XMLHttpRequest'
}
```

## Installation

No external dependencies required - uses native Node.js `fetch` API (Node.js 18+).

For older Node.js versions, install `node-fetch`:

```bash
npm install node-fetch
```

## Environment Variables

For production use, store credentials securely:

```bash
export NPM_BASE_URL="https://demo.promapp.com"
export NPM_TENANT_ID="your-tenant-id"
export NPM_USERNAME="your-username@example.com"
export NPM_PASSWORD="your-password"
```

## Error Handling

The function validates inputs and throws errors for:
- Invalid `processJson` (must be an object)
- Invalid `changeDescription` (must be a string)

API errors should be handled by checking HTTP response status codes.

## License

ISC

## Contributing

Pull requests welcome! Please ensure all changes include appropriate tests and documentation.
