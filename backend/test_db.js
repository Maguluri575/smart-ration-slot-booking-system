const db = require('./database');
const bcrypt = require('bcryptjs');

async function runTests() {
  console.log("=== Starting Automated Database Verification Tests ===");

  try {
    // 1. Initialize DB and seed
    console.log("Testing db.initDb()...");
    await db.initDb();
    console.log("✔ Database schema initialized and seed data inserted successfully.");

    // 2. Test User Fetch
    console.log("Testing user retrieval...");
    const user = await db.getUserByUsername('RATION999');
    if (!user) throw new Error("Seed user RATION999 not found.");
    console.log("✔ Seed user fetched successfully:", user.username);

    // 3. Test Password Comparison
    console.log("Testing password authentication...");
    const match = bcrypt.compareSync('password', user.password_hash);
    if (!match) throw new Error("Seed password mismatch.");
    console.log("✔ Password comparison successfully verified.");

    // 4. Test Beneficiary Profile Fetch
    console.log("Testing beneficiary profile retrieval...");
    const profile = await db.getBeneficiaryProfileByUserId(user.id);
    if (!profile || profile.name !== 'Ramesh Kumar') {
      throw new Error("Beneficiary profile mismatch or not found.");
    }
    console.log("✔ Beneficiary profile fetched successfully:", profile.name, `(${profile.card_type})`);
    console.log("  Assigned Shop:", profile.shop_name);

    // 5. Test Stock retrieval
    console.log("Testing shop stock retrieval...");
    const stock = await db.getShopStock(profile.ration_shop_id);
    if (stock.length === 0) throw new Error("Stock levels empty.");
    console.log("✔ Shop stock levels retrieved successfully. Items count:", stock.length);
    stock.forEach(item => {
      console.log(`  - ${item.commodity_name}: Remaining = ${item.remaining_quantity} ${item.unit}`);
    });

    console.log("=== All Database Tests PASSED successfully! ===");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test verification failed with error:", err.message);
    process.exit(1);
  }
}

runTests();
