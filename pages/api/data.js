export default function handler(req, res) {
    // Example data to be returned
    const data = {
      message: 'Hello from the API',
      timestamp: new Date().toISOString(),
    };
  
    // Return the data as JSON
    res.status(200).json(data);
  }