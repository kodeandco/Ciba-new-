// utils/googleSheetsService.js
const { google } = require("googleapis");

// Initialize Google Sheets API client
function getGoogleSheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  return google.sheets({
    version: "v4",
    auth,
  });
}

// Create a new spreadsheet for incubation applications
async function createIncubationSpreadsheet() {
  try {
    const sheets = getGoogleSheetsClient();

    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `CIBA Incubation Applications - ${new Date().toISOString().split('T')[0]}`,
        },
        sheets: [
          {
            properties: {
              title: "Applications",
              gridProperties: {
                frozenRowCount: 1,
              },
            },
          },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    // Add headers
    const headers = [
      "Application ID",
      "Startup Name",
      "Founder Name",
      "Co-Founders",
      "Email",
      "Phone",
      "Website",
      "Industry",
      "Stage",
      "Team Size",
      "Funding Raised",
      "Monthly Revenue",
      "Description",
      "Status",
      "Has Pitch Deck",
      "Pitch Deck Filename",
      "Application Date",
      "Notes",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Applications!A1:R1",
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.4,
                    blue: 0.8,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    fontSize: 11,
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 18,
              },
            },
          },
        ],
      },
    });

    console.log(`✅ Spreadsheet created: ${spreadsheet.data.spreadsheetUrl}`);
    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl: spreadsheet.data.spreadsheetUrl,
    };
  } catch (error) {
    console.error("Error creating spreadsheet:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Add a single application to the spreadsheet
async function addApplicationToSheet(spreadsheetId, application) {
  try {
    const sheets = getGoogleSheetsClient();

    const row = [
      application._id.toString(),
      application.startupName,
      application.founderName,
      application.coFounders || "",
      application.email,
      application.phone,
      application.website,
      application.industry,
      application.stage,
      application.teamSize,
      application.fundingRaised,
      application.revenue,
      application.description,
      application.status,
      application.pitchDeck ? "Yes" : "No",
      application.pitchDeck?.filename || "",
      new Date(application.createdAt).toLocaleString(),
      application.notes || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Applications!A:R",
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });

    console.log(`✅ Application added to sheet: ${application.startupName}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding application to sheet:", error);
    return { success: false, error: error.message };
  }
}

// Update an existing application in the spreadsheet
async function updateApplicationInSheet(spreadsheetId, application) {
  try {
    const sheets = getGoogleSheetsClient();

    // Find the row with this application ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Applications!A:A",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(
      (row) => row[0] === application._id.toString()
    );

    if (rowIndex === -1) {
      // Application not found, add it instead
      return await addApplicationToSheet(spreadsheetId, application);
    }

    // Update the row (rowIndex + 1 because sheets are 1-indexed)
    const row = [
      application._id.toString(),
      application.startupName,
      application.founderName,
      application.coFounders || "",
      application.email,
      application.phone,
      application.website,
      application.industry,
      application.stage,
      application.teamSize,
      application.fundingRaised,
      application.revenue,
      application.description,
      application.status,
      application.pitchDeck ? "Yes" : "No",
      application.pitchDeck?.filename || "",
      new Date(application.createdAt).toLocaleString(),
      application.notes || "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Applications!A${rowIndex + 1}:R${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });

    console.log(`✅ Application updated in sheet: ${application.startupName}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating application in sheet:", error);
    return { success: false, error: error.message };
  }
}

// Sync all applications to a spreadsheet
async function syncAllApplicationsToSheet(spreadsheetId, applications) {
  try {
    const sheets = getGoogleSheetsClient();

    // Prepare all rows
    const rows = applications.map((app) => [
      app._id.toString(),
      app.startupName,
      app.founderName,
      app.coFounders || "",
      app.email,
      app.phone,
      app.website,
      app.industry,
      app.stage,
      app.teamSize,
      app.fundingRaised,
      app.revenue,
      app.description,
      app.status,
      app.pitchDeck ? "Yes" : "No",
      app.pitchDeck?.filename || "",
      new Date(app.createdAt).toLocaleString(),
      app.notes || "",
    ]);

    // Clear existing data (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Applications!A2:R",
    });

    // Add all rows
    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Applications!A2:R",
        valueInputOption: "RAW",
        requestBody: {
          values: rows,
        },
      });
    }

    console.log(`✅ Synced ${applications.length} applications to sheet`);
    return { success: true, count: applications.length };
  } catch (error) {
    console.error("Error syncing applications to sheet:", error);
    return { success: false, error: error.message };
  }
}

// Get spreadsheet URL
async function getSpreadsheetUrl(spreadsheetId) {
  try {
    const sheets = getGoogleSheetsClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    return response.data.spreadsheetUrl;
  } catch (error) {
    console.error("Error getting spreadsheet URL:", error);
    return null;
  }
}

module.exports = {
  getGoogleSheetsClient,
  createIncubationSpreadsheet,
  addApplicationToSheet,
  updateApplicationInSheet,
  syncAllApplicationsToSheet,
  getSpreadsheetUrl,
};