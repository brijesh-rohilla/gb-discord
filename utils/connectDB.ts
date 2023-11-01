const DataStore = require('nedb');

// Hold connectionref globally
(global as any).connectionRef = {};

export default async function connectDB() {
  try {
    if (!Object.keys((global as any).connectionRef).length) {
      const db = new DataStore({ timestampData: true });
      (global as any).connectionRef = db;
      console.log('database connected !!');
    }

    return (global as any).connectionRef;
  } catch (error) {
    return error;
  }
}
