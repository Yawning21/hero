const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "database.json");

app.use(cors());
app.use(express.json());

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/icons', express.static(path.join(__dirname, 'public', 'icons')));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const defaultData = { users: [], cart: [] };
            fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        return { users: [], cart: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        console.log("✅ DB saved");
    } catch (error) {
        console.error("Error writing DB:", error);
    }
}

function getNextId(array) {
    return array.length ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const db = readDB();
    
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email already exists!" });
    }
    
    const newUser = { 
        id: getNextId(db.users), 
        name, 
        email, 
        password 
    };
    
    db.users.push(newUser);
    writeDB(db);
    const { password: pw, ...safeUser } = newUser;
    res.json(safeUser);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    
    const user = db.users.find(u => u.email === email);
    if (user) {
        if (user.password === password) {
            const { password, ...safeUser } = user;
            res.json(safeUser);
        } else {
            res.status(401).json({ message: "Incorrect Password" });
        }
    } else {
        res.status(401).json({ message: "Invalid credentials!" });
    }
});

app.post("/add-to-cart", (req, res) => {
    const { user_id, product_name, price, quantity, image } = req.body;
    const db = readDB();
    
    const userId = parseInt(user_id);
    let item = db.cart.find(item => item.user_id === userId && item.product_name === product_name);
    
    if (item) {
        item.quantity = parseInt(quantity) || 1;
    } else {
        item = {
            id: getNextId(db.cart),
            user_id: userId,
            product_name,
            price: Number(price),
            quantity: parseInt(quantity) || 1,
            image: image || ''
        };
        db.cart.push(item);
    }
    
    writeDB(db);
    res.json({ message: `${product_name} added to cart!`, item });
});

app.get("/cart/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const db = readDB();
    const userCart = db.cart.filter(item => item.user_id === userId);
    res.json(userCart);
});

app.delete("/cart/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const db = readDB();
    db.cart = db.cart.filter(item => item.user_id !== userId);
    writeDB(db);
    console.log(`🗑️ Cleared cart for user ${userId}`);
    res.json({ message: "Cart cleared!" });
});

app.delete("/cart/item/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const db = readDB();
    const itemIndex = db.cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: "Cart item not found." });
    }
    db.cart.splice(itemIndex, 1);
    writeDB(db);
    res.json({ message: "Cart item removed." });
});

app.get(/^\/(?!api\/).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📁 DB: ${DB_FILE}`);
});
