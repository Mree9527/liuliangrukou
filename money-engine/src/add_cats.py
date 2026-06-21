with open('src/content/product-db-v2.js', 'r') as f:
    original = f.read()

insert_pos = original.find('\n};\n', original.find('export const PRODUCTS'))
if insert_pos == -1:
    print('ERROR: not found'); import sys; sys.exit(1)

new_cats = '''  // BEAUTY & SELF CARE
  beauty: {
    category: 'Beauty',
    keywords: ['best skincare products 2026', 'hair dryer review'],
    items: [
      { id:'B09X54MF28', name:'Dyson Supersonic Hair Dryer Refurbished', price:'$339', rating:4.7, reviews:'20K+', tier:'premium', description:'Professional hair dryer with intelligent heat control.', pros:['Fastest drying time','No heat damage to hair','Quiet operation'], cons:['Premium price for hair dryer','Heavy in hand'] },
      { id:'B08G15L2Q3', name:'CeraVe Moisturizing Cream 19oz', price:'$16.48', rating:4.7, reviews:'1M+', tier:'budget', description:'Dermatologist recommended for all skin types.', pros:['19oz lasts months','Dermatologist recommended','Fragrance-free formula'], cons:['Thick texture takes time to absorb','No scent']}
    ]
  },
'''

new_content = original[:insert_pos] + '\n' + new_cats + original[insert_pos:]

with open('src/content/product-db-v2.js', 'w') as f:
    f.write(new_content)
print('Done - wrote file with added category')
