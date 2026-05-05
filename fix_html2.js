const fs = require('fs');
const path = require('path');
const baseDir = path.resolve('c:/Users/Admin/Documents/Project/Project nila jerico');
const files = [path.join(baseDir, 'index.html'), path.join(baseDir, 'public', 'index.html')];

const bestSellersBlock = `    <h2>⭐ Best Sellers</h2>
    <div class="scroll horizontal-scroll" id="bestSellers">
        <div class="card product-card women" data-name="Luxury Gold">
            <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=300&q=80" alt="Luxury Gold" onclick="openModal(this.src, this.alt)">
            <p>Luxury Gold <br>₱499</p>
            <button onclick="addToCart('Luxury Gold',499,'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=300&q=80')">Add to Cart</button>
        </div>
        <div class="card product-card women" data-name="Sweet Candy">
            <img src="https://fimgs.net/mdimg/perfume-thumbs/375x500.110992.jpg" alt="Sweet Candy" onclick="openModal(this.src, this.alt)">
            <p>Sweet Candy <br>₱299</p>
            <button onclick="addToCart('Sweet Candy',299,'https://fimgs.net/mdimg/perfume-thumbs/375x500.110992.jpg')">Add to Cart</button>
        </div>
        <div class="card product-card women" data-name="Elegant Rose">
            <img src="https://th.bing.com/th/id/OIP.Y9OPnLy_Uwb9F1n3rxjgTAAAAA?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="Elegant Rose" onclick="openModal(this.src, this.alt)">
            <p>Elegant Rose <br>₱399</p>
            <button onclick="addToCart('Elegant Rose',399,'https://th.bing.com/th/id/OIP.Y9OPnLy_Uwb9F1n3rxjgTAAAAA?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')">Add to Cart</button>
        </div>
        <div class="card product-card men" data-name="Strong Edge">
            <img src="https://down-ph.img.susercontent.com/file/cafa3848ce86ab82a783cc934c5df16b" alt="Strong Edge" onclick="openModal(this.src, this.alt)">
            <p>Strong Edge <br>₱399</p>
            <button onclick="addToCart('Strong Edge',399,'https://down-ph.img.susercontent.com/file/cafa3848ce86ab82a783cc934c5df16b')">Add to Cart</button>
        </div>
        <div class="card product-card men" data-name="Horizon">
            <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRL1fVcnX2KcVq9L-M_R_9enQ8Snw7e1UgQCInWml_QfXXfkRFpAD17gnTMaDBJiWFkFSmZb8kavXxqxV_f5-zQY3DJImtyTIu_ldJHhk21N2WPZK4zDHvKfOY" alt="Horizon" onclick="openModal(this.src, this.alt)">
            <p>Horizon <br>₱399</p>
            <button onclick="addToCart('Horizon',399,'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRL1fVcnX2KcVq9L-M_R_9enQ8Snw7e1UgQCInWml_QfXXfkRFpAD17gnTMaDBJiWFkFSmZb8kavXxqxV_f5-zQY3DJImtyTIu_ldJHhk21N2WPZK4zDHvKfOY')">Add to Cart</button>
        </div>
        <div class="card product-card women" data-name="Berry Lush">
            <img src="https://tse1.explicit.bing.net/th/id/OIP.RRm4lYyvxY4P496dEG1jSQHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Berry Lush" onclick="openModal(this.src, this.alt)">
            <p>Berry Lush <br>₱399</p>
            <button onclick="addToCart('Berry Lush',399,'https://tse1.explicit.bing.net/th/id/OIP.RRm4lYyvxY4P496dEG1jSQHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3')">Add to Cart</button>
        </div>
        <div class="card product-card women" data-name="Forest Dew">
            <img src="https://cdn.myikas.com/images/b9192411-6edc-405e-807f-d066f017a250/ebdd20e3-04da-4402-9fa2-fccf75628500/3840/img-9594-copy.webp" alt="Forest Dew" onclick="openModal(this.src, this.alt)">
            <p>Forest Dew <br>₱399</p>
            <button onclick="addToCart('Forest Dew',399,'https://cdn.myikas.com/images/b9192411-6edc-405e-807f-d066f017a250/ebdd20e3-04da-4402-9fa2-fccf75628500/3840/img-9594-copy.webp')">Add to Cart</button>
        </div>
        <div class="card product-card women" data-name="Whispering Rose">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGlrwAcWLwp8VNrbfq2CRdDPbHs-ZjHOb1lQ&s" alt="Whispering Rose" onclick="openModal(this.src, this.alt)">
            <p>Whispering Rose <br>₱399</p>
            <button onclick="addToCart('Whispering Rose',299,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGlrwAcWLwp8VNrbfq2CRdDPbHs-ZjHOb1lQ&s')">Add to Cart</button>
        </div>
    </div>`;

const removeDupCss = /\r?\n\s*\}\r?\n\s*\.category-buttons\{[\s\S]*?\.profile-card\{[\s\S]*?\r?\n\s*\}\s*\r?\n\s*\/\* ==== MOBILE UI FIX \(SHOPEE STYLE\) ==== \*\//m;

function findSection(text, startMarker) {
    const start = text.indexOf(startMarker);
    if (start === -1) return null;
    let idx = start;
    let depth = 0;
    const lower = text.toLowerCase();
    const len = text.length;
    while (idx < len) {
        const open = lower.indexOf('<div', idx);
        const close = lower.indexOf('</div>', idx);
        if (open === -1 && close === -1) break;
        if (open !== -1 && open < close) {
            depth += 1;
            idx = open + 4;
        } else {
            depth -= 1;
            idx = close + 6;
            if (depth === 0) {
                return {start, end: idx};
            }
        }
    }
    return null;
}

function fixButtons(sectionText) {
    return sectionText.replace(/<div[^>]*class="card[^>]*>[\s\S]*?<\/div>/g, cardBlock => {
        const imgMatch = cardBlock.match(/<img[^>]+src="([^"]+)"/);
        const buttonMatch = cardBlock.match(/onclick="addToCart\(\s*'([^']+)'\s*,\s*([0-9]+)\s*\)"/);
        if (imgMatch && buttonMatch) {
            const safeImg = imgMatch[1].replace(/'/g, "\\'");
            return cardBlock.replace(/onclick="addToCart\(\s*'([^']+)'\s*,\s*([0-9]+)\s*\)"/, `onclick="addToCart('$1',$2,'${safeImg}')"`);
        }
        return cardBlock;
    });
}

for (const filePath of files) {
    console.log('Processing', filePath);
    let text = fs.readFileSync(filePath, 'utf8');
    const original = text;

    const removed = text.replace(removeDupCss, '\n    /* ==== MOBILE UI FIX (SHOPEE STYLE) ==== */');
    if (removed !== text) {
        console.log('Removed duplicate desktop CSS block');
        text = removed;
    }

    if (!text.includes('#products .card:nth-child(even)')) {
        const insertAfter = text.indexOf('.card:hover{');
        if (insertAfter !== -1) {
            const endBlock = text.indexOf('}', insertAfter);
            if (endBlock !== -1) {
                const insertion = '\n    #products .card {\n        transition: transform 0.25s ease;\n    }\n    #products .card:nth-child(even) {\n        transform: translateY(20px);\n    }\n';
                text = text.slice(0, endBlock + 1) + insertion + text.slice(endBlock + 1);
                console.log('Inserted staggered product transform CSS');
            }
        }
    }

    const bestRe = /<h2>⭐ Best Sellers<\/h2>[\s\S]*?<br><br>\s*<h2>🛍 All Products<\/h2>/m;
    if (bestRe.test(text)) {
        text = text.replace(bestRe, `${bestSellersBlock}\n    <br><br>\n\n    <h2>🛍 All Products</h2>`);
        console.log('Replaced Best Sellers block');
    }

    const bestSection = findSection(text, '<div class="scroll horizontal-scroll" id="bestSellers">');
    if (bestSection) {
        const sectionText = text.slice(bestSection.start, bestSection.end);
        const fixed = fixButtons(sectionText);
        text = text.slice(0, bestSection.start) + fixed + text.slice(bestSection.end);
        console.log('Fixed Best Sellers buttons');
    }
    const productsSection = findSection(text, '<div class="scroll" id="products">');
    if (productsSection) {
        const sectionText = text.slice(productsSection.start, productsSection.end);
        const fixed = fixButtons(sectionText);
        text = text.slice(0, productsSection.start) + fixed + text.slice(productsSection.end);
        console.log('Fixed Products buttons');
    }

    if (text !== original) {
        fs.writeFileSync(filePath, text, 'utf8');
        console.log('Updated', filePath);
    } else {
        console.log('No changes for', filePath);
    }
}
