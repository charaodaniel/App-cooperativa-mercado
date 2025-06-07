// Google Sheets API integration service
// This service handles the connection between the app and Google Sheets

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  range: string;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  // Read data from Google Sheets
  async readData(range?: string): Promise<any[]> {
    try {
      const targetRange = range || this.config.range;
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${targetRange}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.values) {
        // Convert array of arrays to array of objects
        const headers = data.values[0];
        return data.values.slice(1).map((row: any[]) => {
          const obj: any = {};
          headers.forEach((header: string, index: number) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      throw error;
    }
  }

  // Write data to Google Sheets (requires OAuth or service account)
  async writeData(range: string, values: any[][]): Promise<void> {
    try {
      // Note: This requires authentication beyond API key
      // You'll need to implement OAuth2 or use a service account
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}` // Implement this method
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error('Failed to write to Google Sheets');
      }
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      throw error;
    }
  }

  // Append data to Google Sheets
  async appendData(range: string, values: any[][]): Promise<void> {
    try {
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}:append?valueInputOption=RAW`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}` // Implement this method
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error('Failed to append to Google Sheets');
      }
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }

  private getAccessToken(): string {
    // This should return a valid OAuth2 access token
    // You'll need to implement OAuth2 flow or use a service account
    return process.env.GOOGLE_ACCESS_TOKEN || '';
  }
}

// Helper function to create Google Sheets service instance
export function createGoogleSheetsService(): GoogleSheetsService {
  const config: GoogleSheetsConfig = {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
    apiKey: process.env.GOOGLE_API_KEY || '',
    range: 'Sheet1!A1:Z1000'
  };

  return new GoogleSheetsService(config);
}