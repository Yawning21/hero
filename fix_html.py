import re
from pathlib import Path

base_dir = Path(r'c:/Users/Admin/Documents/Project/Project nila jerico')
files = [base_dir / 'index.html', base_dir / 'public' / 'index.html']

best_sellers_block = '''    <h2>⭐ Best Sellers</h2>
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
    </div>'''

remove_css_block = re.compile(
    r"\s*\.category-buttons\{[\s\S]*?\.profile-card\{[\s\S]*?\n\}\s*\n\s*/\* ==== MOBILE UI FIX \(SHOPEE STYLE\) ==== \*/",
    re.MULTILINE,
)

for path in files:
    print('Processing', path)
    text = path.read_text(encoding='utf-8')
    # Remove duplicate desktop theme override block if present.
    new_text, count = remove_css_block.subn('/* duplicate desktop CSS block removed */\n    /* ==== MOBILE UI FIX (SHOPEE STYLE) ==== */', text)
    text = new_text
    if count:
        print('Removed duplicate CSS block in', path)

    # Add staggered product card transform in general CSS if missing.
    if '#products .card:nth-child(even) {' not in text:
        insert_point = text.find('#products .card{')
        if insert_point != -1:
            # insert after existing #products .card block closing brace
            match = re.search(r'(#products\.card\{[^}]*\})', text[insert_point:])
            if match:
                insert_pos = insert_point + match.end()
                insertion = '\n    #products .card:nth-child(even){\n        transform: translateY(20px);\n    }\n    #products .card{\n        transition: transform 0.25s ease;\n    }\n'
                text = text[:insert_pos] + insertion + text[insert_pos:]
                print('Inserted staggered product transform CSS in', path)

    # Replace the best sellers section with a cleaned set.
    best_re = re.compile(r'<h2>⭐ Best Sellers</h2>[\s\S]*?<br><br>\s*<h2>🛍 All Products</h2>', re.MULTILINE)
    text, n = best_re.subn(best_sellers_block + '\n    <br><br>\n\n    <h2>🛍 All Products</h2>', text)
    if n:
        print('Replaced Best Sellers block in', path)
    else:
        print('Best Sellers block not found in', path)

    # Fix addToCart buttons within the product sections.
    section_re = re.compile(r'(<div class="scroll (?:horizontal-scroll" id="bestSellers"|"id="products"">))(.*?)(?=<br><br>\s*<h2>|</body>)', re.DOTALL)
    def fix_section(match):
        section = match.group(1) + match.group(2)
        lines = section.splitlines()
        current_img = None
        fixed_lines = []
        for line in lines:
            img_match = re.search(r'<img[^>]+src="([^"]+)"', line)
            if img_match:
                current_img = img_match.group(1)
            button_match = re.search(r'onclick="addToCart\(\s*\'([^\']+)\'\s*,\s*([0-9]+)\s*\)"', line)
            if button_match and current_img:
                name = button_match.group(1)
                price = button_match.group(2)
                new_onclick = f'onclick="addToCart(\'{name}\',{price},\'{current_img}\')"'
                line = re.sub(r'onclick="addToCart\(\s*\'[^\']+\'\s*,\s*[0-9]+\s*\)"', new_onclick, line)
            fixed_lines.append(line)
        return '\n'.join(fixed_lines)

    text = section_re.sub(lambda m: m.group(1) + fix_section(m), text)

    path.write_text(text, encoding='utf-8')
    print('Updated', path)
