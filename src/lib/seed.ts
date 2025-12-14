// prisma/seed.ts

import { faker } from "@faker-js/faker";
import { prisma } from "./prisma";
import { OrderStatus, Role } from "../generated/prisma/enums";

// Initialize the Prisma Client

// --- Configuration ---
const NUM_USERS = 10;
const NUM_PRODUCTS = 30;
// We need hundreds of orders to simulate pagination
const NUM_ORDERS = 350;
const ITEMS_PER_ORDER_MIN = 1;
const ITEMS_PER_ORDER_MAX = 5;
const START_DATE_DAYS_AGO = 60; // Create orders over the last 60 days

// --- Helper Functions ---

/**
 * Calculates a date within the last N days for simulating order creation time.
 * @param daysAgo Max number of days back to go.
 * @returns A Date object.
 */
const getDateWithinRange = (daysAgo: number): Date => {
  return faker.date.recent({ days: daysAgo });
};

/**
 * Generates a price in the smallest currency unit (Int).
 * Example: $5.99 -> 599.
 * @returns An integer representing the price.
 */
const generatePriceInSmallestUnit = (
  minDollars: number,
  maxDollars: number
): number => {
  // Generate a price in cents
  const minCents = minDollars * 100;
  const maxCents = maxDollars * 100;
  return faker.number.int({ min: minCents, max: maxCents });
};

// --- Main Seeding Logic ---

async function main() {
  console.log("--- Starting Database Seeder ---");

  // 1. CLEAR EXISTING DATA (Optional but recommended for fresh seeding)
  await prisma.orderItems.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.cartItems.deleteMany();
  await prisma.carts.deleteMany();
  await prisma.products.deleteMany();
  await prisma.users.deleteMany();
  console.log("✅ Cleared existing data.");

  // 2. CREATE USERS
  const userPromises = [];
  userPromises.push(
    prisma.users.create({
      data: {
        name: "Admin User",
        pin: "1234",
        role: Role.ADMIN,
      },
    })
  );
  for (let i = 0; i < NUM_USERS; i++) {
    userPromises.push(
      prisma.users.create({
        data: {
          name: faker.person.fullName(),
          pin: faker.string.numeric({ length: 4, exclude: ["1234"] }),
          role: Role.CASHIER,
        },
      })
    );
  }
  const users = await Promise.all(userPromises);
  const cashierIds = users
    .filter((u) => u.role === Role.CASHIER)
    .map((u) => u.id);
  console.log(`✅ Created ${users.length} users.`);

  // 3. CREATE PRODUCTS
  const productsPromises = [];
  const categories = [
    "Beverages",
    "Snacks",
    "Desserts",
    "Hot Meals",
    "Apparel",
  ];
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    productsPromises.push(
      prisma.products.create({
        data: {
          name: faker.commerce.productName(),
          category: faker.helpers.arrayElement(categories),
          // Price stored as Int (e.g., between $2.50 and $50.00)
          price: generatePriceInSmallestUnit(2.5, 50),
          stock: faker.number.int({ min: 50, max: 500 }),
          sale: faker.number.int({ min: 0, max: 100 }),
          isActive: true,
        },
      })
    );
  }
  const products = await Promise.all(productsPromises);
  console.log(`✅ Created ${products.length} products.`);

  // 4. CREATE ORDERS
  const orderPromises = [];
  for (let i = 0; i < NUM_ORDERS; i++) {
    const randomCashierId = faker.helpers.arrayElement(cashierIds);
    const orderDate = getDateWithinRange(START_DATE_DAYS_AGO);

    let totalAmount = 0;
    const orderItemsData = [];

    // Ensure unique products in one order
    const numItems = faker.number.int({
      min: ITEMS_PER_ORDER_MIN,
      max: ITEMS_PER_ORDER_MAX,
    });
    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: numItems,
    });

    for (const product of selectedProducts) {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = product.price; // Price is already an integer (in smallest unit)
      const itemTotal = quantity * unitPrice; // Simple integer multiplication
      totalAmount += itemTotal;

      orderItemsData.push({
        quantity: quantity,
        unitPrice: unitPrice,
        productId: product.id,
      });
    }

    // Determine payment details
    // Payment cash should be an integer amount that is equal to or greater than totalAmount
    // Simulate rounding up to the nearest dollar (100 smallest units)
    const paymentCash = Math.ceil(totalAmount / 100) * 100;
    const paymentChange = paymentCash - totalAmount;

    // Ensure change is non-negative
    const finalPaymentChange = paymentChange >= 0 ? paymentChange : 0;

    const status = faker.helpers.arrayElement([
      OrderStatus.COMPLETED,
      OrderStatus.VOID,
      OrderStatus.COMPLETED,
    ]);

    orderPromises.push(
      prisma.orders.create({
        data: {
          userId: randomCashierId,
          totalAmount: totalAmount,
          paymentCash: paymentCash,
          paymentChange: finalPaymentChange,
          status: status,
          createdAt: orderDate,
          items: {
            create: orderItemsData,
          },
        },
      })
    );
  }

  await Promise.all(orderPromises);
  console.log(
    `✅ Created ${NUM_ORDERS} orders across ${START_DATE_DAYS_AGO} days.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
