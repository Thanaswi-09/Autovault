import sqlite3

conn = sqlite3.connect('autovault.db')

# Add column if not exists
cols = [r[1] for r in conn.execute('PRAGMA table_info(vehicles)').fetchall()]
if 'image_url' not in cols:
    conn.execute('ALTER TABLE vehicles ADD COLUMN image_url TEXT')
    conn.commit()
    print('image_url column added')
else:
    print('image_url column already exists')

updates = [
    ('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg/960px-Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg', 'Toyota', 'Camry'),
    ('https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/worldnews/2016/4161028/01.jpg', 'Honda', 'CR-V'),
    ('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDVp63etJUYcd7lqkRbsyH8fiv5LUcG2vVDc126FieuN_FriDMvJvMGbk&s=10', 'Ford', 'Mustang'),
    ('https://ev-database.org/img/auto/Tesla_Model_3_Standard_2026/Tesla_Model_3_Standard_2026-01.jpg', 'Tesla', 'Model 3'),
    ('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU6FBQQ3Jd5t6CgQbYHv_wrSF3Q9VZhDzsj2hU6Uyn5J4u1BVAbM_1Wtia&s=10', 'BMW', 'X5'),
]

for url, make, model in updates:
    conn.execute('UPDATE vehicles SET image_url=? WHERE make=? AND model=?', (url, make, model))

conn.commit()

for r in conn.execute('SELECT id, make, model, image_url FROM vehicles').fetchall():
    print(r[0], r[1], r[2], r[3][:60] if r[3] else 'NULL')

conn.close()
