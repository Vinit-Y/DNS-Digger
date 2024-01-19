// Import required modules
import express from "express"; // Express for web framework
import axios from "axios"; // Axios for making HTTP requests
import bodyParser from "body-parser"; // Body-parser for parsing request body

// Create an Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Enable URL-encoded body parsing
app.use(express.static('public')); // Serve static files from the 'public' directory

// Define a route for the home page
app.get("/", (req, res) => {
  res.render("index.ejs"); // Render the 'index.ejs' view
});

// Define a route for handling form submission and validation
app.post("/validate", async (req, res) => {
  try {
    const YOUR_INPUT = req.body.inputData; // Get input data from the request body
    let validationType;

    // Determine the validation type based on the input format
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(YOUR_INPUT)) {
      validationType = "whois";
    } else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(YOUR_INPUT)) {
      validationType = "email";
    } else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(YOUR_INPUT)) {
      validationType = "ip";
    } else if (/^[a-zA-Z0-9.-]+$/.test(YOUR_INPUT)) {
      validationType = "dns";
    } else {
      // If the input doesn't match any known format, render an error message
      res.render("index.ejs", { responseData: "Invalid input format" });
      return;
    }

    // Construct the API URL based on the validation type and input
    const apiUrl = `https://scraper.run/${validationType}?addr=${YOUR_INPUT}`;
    
    // Make a request to the external API
    const response = await axios.get(apiUrl);
    const result = JSON.stringify(response.data);

    // Render the 'index.ejs' view with the API response data
    res.render("index.ejs", { responseData: result });
  } catch (error) {
    // Handle errors, log to console, and render an error message
    console.log(error.message);
    res.render("index.ejs", { responseData: error.message });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
