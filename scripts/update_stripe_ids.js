const Database = require('better-sqlite3')
const db = new Database('dev.db')

const updates = {
  'free': '',
  'starter': 'price_1TdWzPCdPqX3RcPPwuivTMuw',
  'pro': 'price_1TdWzQCdPqX3RcPPrUTjg9YE',
  'pro-max': 'price_1TdWzRCdPqX3RcPPQ223a4wE',
  'free-monthly': '',
  'pro-monthly': 'price_1TdWzSCdPqX3RcPPZoc5pomx',
  'pro-max-monthly': 'price_1TdWzTCdPqX3RcPPo2nd19QM'
}

const stmt = db.prepare("UPDATE Plan SET stripePriceId = ? WHERE slug = ?")
for (const [slug, id] of Object.entries(updates)) {
  const result = stmt.run(id, slug)
  console.log(`  ${slug}: ${id || '(empty)'} (${result.changes} row(s))`)
}

const verify = db.prepare("SELECT name, slug, stripePriceId FROM Plan").all()
console.log('\nCurrent state:')
console.log(JSON.stringify(verify, null, 2))

db.close()
