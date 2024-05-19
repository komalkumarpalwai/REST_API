const express = require('express');
const app = express();
const fs=require('fs')
const users = require("./MOCK_DATA.json");
const { error } = require('console');

app.set("view engine", "ejs");
//rendiring with ejs
app.get("/api/users", (req, res) => {
    res.render('index', { users });
});
//rendering a dynamic user
app.get("/api/users/:id?", (req, res) => {
    const id = req.params.id ? Number(req.params.id) : null;
    let data = {};

    if (id !== null) {
        const dynamicUser = users.find((user) => user.id === id);
        if (dynamicUser) {
            data = { user: dynamicUser };
        } else {
            return res.status(404).send("User not found");
        }
    } else {
        data = { users };
    }

    res.render('user', data);
});

app.use(express.urlencoded({extended:true}))
// Route to return all users as JSON
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Route to render a list of users with their first names and IP addresses in HTML format
app.get("/users", (req, res) => {
    const html = `<ul>${users.map((user) => `<li>${user.first_name}</li><li>${user.ip_address}</li><br>`).join("")}</ul>`;
    res.send(html);
});

// Route to retrieve a user by their ID and return it as JSON
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const dynamicUser = users.find((user) => user.id === id);
    return res.json(dynamicUser);
});

// Route to retrieve a user by their first name and return it as JSON
app.get("/api/users/name/:name", (req, res) => {
    const name = req.params.name;
    const dynamicUser = users.find((user) => user.first_name === name);
    if (dynamicUser) {
        return res.json(dynamicUser);
    } else {
        return res.status(404).json({ message: "User not found" });
    }
});
//Route to retrieve a user by their ipaddress and return it as JSON
app.get("/api/users/ipadddress/:ipadddress", (req, res) => {
    const ipadddress = req.params.ipadddress;
    const dynamicUser = users.find((user) => user.ip_address === ipadddress);
    if (dynamicUser) {
        return res.json(dynamicUser);
    } else {
        return res.status(404).json({ message: "User not found" });
    }
});

// Route to check the server
app.get("/", (req, res) => {
    res.send("hello");
});

// Listen on port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
//creating a route
app.route("/api/users")
    .get( (req, res) => {
        const id = Number(req.params.id);
        const dynamicUser = users.find((user) => user.id === id);
        return res.json(dynamicUser);
    })
    .post((req,res)=>{
        const body=req.body;
        console.log("body",body)
        users.push({...body, id: users.length+1})
        fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,res)=>{
            return res.json({status:"success",id:users.length})
        })
       
    })
    .patch((req,res)=>{

        return res.json({status:"pending"})
    })
    // deleting the user
    app.delete("/api/users/:id", (req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "User not found" });
        }
        users.splice(index, 1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.json({ status: "success", message: "User deleted successfully" });
        });
    });
    

console.log("the end")