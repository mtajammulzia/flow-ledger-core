import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  // ======================
  // TENANTS
  // ======================
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Karachi General Traders',
      slug: 'karachi-general-traders',
      email: 'info@kgt.com',
      phone: '+92-300-1111111',
      address: 'Saddar Market',
      city: 'Karachi',
      country: 'Pakistan',
      settings: {
        currency: 'PKR',
        invoicePrefix: 'KGT',
      },
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Al Noor Supplies',
      slug: 'al-noor-supplies',
      email: 'contact@alnoor.com',
      phone: '+92-321-2222222',
      address: 'Industrial Area',
      city: 'Lahore',
      country: 'Pakistan',
      settings: {
        currency: 'PKR',
        invoicePrefix: 'ANS',
      },
    },
  });

  // ======================
  // USERS
  // ======================
  const hashedPassword = await hashPassword('password123');

  await prisma.user.create({
    data: {
      name: 'Ahmed Ali',
      email: 'ahmed@kgt.com',
      tenantId: tenant1.id,
      role: 'ADMIN',
      credentials: {
        create: { password: hashedPassword },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Usman Khan',
      email: 'usman@alnoor.com',
      tenantId: tenant2.id,
      role: 'ADMIN',
      credentials: {
        create: { password: hashedPassword },
      },
    },
  });

  // ======================
  // CUSTOMERS (Tenant 1)
  // ======================
  const c1 = await prisma.customer.create({
    data: {
      name: 'Shah Enterprises',
      phone: '+92-333-1000001',
      address: 'Tower Market Karachi',
      tenantId: tenant1.id,
    },
  });

  await prisma.customer.create({
    data: {
      name: 'City Hardware Store',
      phone: '+92-333-1000002',
      address: 'Gulshan-e-Iqbal',
      tenantId: tenant1.id,
    },
  });

  // ======================
  // SUPPLIERS (Tenant 1)
  // ======================
  const s1 = await prisma.supplier.create({
    data: {
      name: 'Metro Steel Suppliers',
      phone: '+92-300-9000001',
      tags: ['steel', 'hardware'],
      tenantId: tenant1.id,
    },
  });

  const s2 = await prisma.supplier.create({
    data: {
      name: 'Electro Wholesale',
      phone: '+92-300-9000002',
      tags: ['electrical'],
      tenantId: tenant1.id,
    },
  });

  // ======================
  // ITEMS (Tenant 1)
  // ======================
  const item1 = await prisma.item.create({
    data: {
      name: 'Mild Steel Rod',
      description: 'Construction grade steel rod',
      tenantId: tenant1.id,
    },
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'Copper Wire 2mm',
      description: 'Electrical copper wiring',
      tenantId: tenant1.id,
    },
  });

  // ======================
  // DOCUMENT (Quotation)
  // ======================
  const quotation = await prisma.document.create({
    data: {
      tenantId: tenant1.id,
      type: 'QUOTATION',
      number: 1001,
      customerId: c1.id,
      status: 'FINALIZED',
      issueDate: new Date(),

      subtotal: 1500,
      totalAmount: 1500,

      tenantSnapshot: {
        create: {
          name: tenant1.name,
          email: tenant1.email,
          phone: tenant1.phone,
          address: tenant1.address,
          city: tenant1.city,
          country: tenant1.country,
        },
      },

      items: {
        create: [
          {
            itemId: item1.id,
            description: 'Mild Steel Rod',
            quantity: 10,
            unitPrice: 100,
            totalPrice: 1000,
            supplierId: s1.id,
          },
          {
            itemId: item2.id,
            description: 'Copper Wire 2mm',
            quantity: 5,
            unitPrice: 100,
            totalPrice: 500,
            supplierId: s2.id,
          },
        ],
      },
    },
  });

  // ======================
  // DOCUMENT (Invoice derived from quotation)
  // ======================
  await prisma.document.create({
    data: {
      tenantId: tenant1.id,
      type: 'INVOICE',
      number: 2001,
      customerId: c1.id,
      status: 'FINALIZED',
      issueDate: new Date(),

      subtotal: 1000,
      totalAmount: 1000,

      parentId: quotation.id,

      tenantSnapshot: {
        create: {
          name: tenant1.name,
          email: tenant1.email,
          phone: tenant1.phone,
          address: tenant1.address,
          city: tenant1.city,
          country: tenant1.country,
        },
      },

      items: {
        create: [
          {
            itemId: item1.id,
            description: 'Mild Steel Rod',
            quantity: 10,
            unitPrice: 100,
            totalPrice: 1000,
            supplierId: s1.id,
          },
          // NOTE: Copper Wire dropped intentionally
        ],
      },
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
