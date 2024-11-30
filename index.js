const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs')

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Define a route
app.get("/", function (req, res) {
    fs.readdir(`./files` , function(err,files){
        res.render("index" , {files:files}); // Renders the "index.ejs" file from the "views" folder & sending data in the name of files to ejs    
    }) // to read files folder
});

app.get("/files/:filesname", function (req, res) {
    fs.readFile(`./files/${req.params.filesname}` , "utf-8" , function(err , filedata) {
        res.render("view" ,{filename : req.params.filesname , filedata : filedata})
    })
});

app.post("/create", function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description , function(err){
        res.redirect("/")
    })
});

// delete
app.post("/delete", function (req, res) {
    const filename = req.body.filename; // Get the filename from the form
    const filePath = path.join(__dirname, "files", filename); // Construct the file path

    // Delete the file using fs.unlink
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("Failed to delete the file.");
        }
        console.log(`File deleted: ${filePath}`);
        res.redirect("/"); // Redirect back to the homepage after deletion
    });
});




// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
