// AppSheet API integration service
// This service handles the connection between the web app and AppSheet

export interface AppSheetConfig {
  appId: string;
  accessKey: string;
  baseUrl: string;
}

export class AppSheetService {
  private config: AppSheetConfig;

  constructor(config: AppSheetConfig) {
    this.config = config;
  }

  // Get data from AppSheet table
  async getData(tableName: string, selector?: string): Promise<any[]> {
    try {
      const url = `${this.config.baseUrl}/apps/${this.config.appId}/tables/${tableName}/Action`;
      
      const payload = {
        Action: 'Find',
        Properties: {
          Locale: 'pt-BR',
          Location: '0.000000,0.000000',
          Timezone: 'America/Sao_Paulo',
          UserSettings: {
            Option: 'AllowOtherValues'
          }
        },
        Rows: selector ? [{ Selector: selector }] : []
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'ApplicationAccessKey': this.config.accessKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AppSheet API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.Rows || [];
    } catch (error) {
      console.error('Error fetching data from AppSheet:', error);
      throw error;
    }
  }

  // Add data to AppSheet table
  async addData(tableName: string, rowData: any): Promise<any> {
    try {
      const url = `${this.config.baseUrl}/apps/${this.config.appId}/tables/${tableName}/Action`;
      
      const payload = {
        Action: 'Add',
        Properties: {
          Locale: 'pt-BR',
          Location: '0.000000,0.000000',
          Timezone: 'America/Sao_Paulo'
        },
        Rows: [rowData]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'ApplicationAccessKey': this.config.accessKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AppSheet API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.Rows?.[0];
    } catch (error) {
      console.error('Error adding data to AppSheet:', error);
      throw error;
    }
  }

  // Update data in AppSheet table
  async updateData(tableName: string, rowData: any): Promise<any> {
    try {
      const url = `${this.config.baseUrl}/apps/${this.config.appId}/tables/${tableName}/Action`;
      
      const payload = {
        Action: 'Edit',
        Properties: {
          Locale: 'pt-BR',
          Location: '0.000000,0.000000',
          Timezone: 'America/Sao_Paulo'
        },
        Rows: [rowData]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'ApplicationAccessKey': this.config.accessKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AppSheet API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.Rows?.[0];
    } catch (error) {
      console.error('Error updating data in AppSheet:', error);
      throw error;
    }
  }

  // Delete data from AppSheet table
  async deleteData(tableName: string, rowKey: string): Promise<void> {
    try {
      const url = `${this.config.baseUrl}/apps/${this.config.appId}/tables/${tableName}/Action`;
      
      const payload = {
        Action: 'Delete',
        Properties: {
          Locale: 'pt-BR',
          Location: '0.000000,0.000000',
          Timezone: 'America/Sao_Paulo'
        },
        Rows: [{ Key: rowKey }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'ApplicationAccessKey': this.config.accessKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AppSheet API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting data from AppSheet:', error);
      throw error;
    }
  }
}

// Helper function to create AppSheet service instance
export function createAppSheetService(): AppSheetService {
  const config: AppSheetConfig = {
    appId: process.env.APPSHEET_APP_ID || '',
    accessKey: process.env.APPSHEET_ACCESS_KEY || '',
    baseUrl: 'https://api.appsheet.com/api/v2'
  };

  return new AppSheetService(config);
}