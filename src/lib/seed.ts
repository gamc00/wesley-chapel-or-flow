import dbConnect from '@/lib/mongodb';
import { User, Provider, Surgeon, Room } from '@/models';
import { hashPassword } from '@/lib/auth';

interface SeedRoom {
  name: string;
  type: 'OR' | 'OB' | 'ENDO' | 'CATH' | 'MRI' | 'CT';
  isOpen: boolean;
}

const SEED_ROOMS: SeedRoom[] = [
  // OR Department: OR 1 → OR 14
  ...Array.from({ length: 14 }, (_, i) => ({
    name: `OR ${i + 1}`,
    type: 'OR' as const,
    isOpen: true
  })),
  // OB Department
  { name: 'C-Section', type: 'OB' as const, isOpen: true },
  { name: 'OB', type: 'OB' as const, isOpen: true },
  // ENDO Department: E1, E2, E3
  { name: 'E1', type: 'ENDO' as const, isOpen: true },
  { name: 'E2', type: 'ENDO' as const, isOpen: true },
  { name: 'E3', type: 'ENDO' as const, isOpen: true },
  // Cath Lab Department: CL1, CL2
  { name: 'CL1', type: 'CATH' as const, isOpen: true },
  { name: 'CL2', type: 'CATH' as const, isOpen: true },
  // Imaging Department: MRI 1, CT 1
  { name: 'MRI 1', type: 'MRI' as const, isOpen: true },
  { name: 'CT 1', type: 'CT' as const, isOpen: true }
];

const SEED_PROVIDERS = [
  {
    firstName: 'Michael',
    lastName: 'Chen',
    initials: 'MC',
    role: 'Anesthesiologist' as const,
    active: true,
    availableForRelief: false,
    pii: {
      phone: '+18135551001',
      employmentStatus: 'W2' as const
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    initials: 'SJ',
    role: 'CRNA' as const,
    active: true,
    availableForRelief: true,
    pii: {
      phone: '+18135551002',
      employmentStatus: 'W2' as const
    }
  },
  {
    firstName: 'David',
    lastName: 'Williams',
    initials: 'DW',
    role: 'CRNA' as const,
    active: true,
    availableForRelief: true,
    pii: {
      phone: '+18135551003',
      employmentStatus: 'W4' as const
    }
  },
  {
    firstName: 'Jennifer',
    lastName: 'Davis',
    initials: 'JD',
    role: 'AA' as const,
    active: true,
    availableForRelief: false,
    pii: {
      phone: '+18135551004',
      employmentStatus: 'W2' as const
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Miller',
    initials: 'RM',
    role: 'Anesthesiologist' as const,
    active: true,
    availableForRelief: false,
    pii: {
      phone: '+18135551005',
      employmentStatus: 'W2' as const
    }
  }
];

const SEED_SURGEONS = [
  {
    firstName: 'James',
    lastName: 'Thompson',
    specialty: 'Orthopedic Surgery',
    active: true
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    specialty: 'General Surgery',
    active: true
  },
  {
    firstName: 'Mark',
    lastName: 'Garcia',
    specialty: 'Cardiothoracic Surgery',
    active: true
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    specialty: 'OB/GYN',
    active: true
  },
  {
    firstName: 'Christopher',
    lastName: 'Lee',
    specialty: 'Gastroenterology',
    active: true
  }
];

export async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await dbConnect();

    console.log('Seeding rooms...');
    // Clear existing rooms and create new ones
    await Room.deleteMany({});
    await Room.insertMany(SEED_ROOMS);
    console.log(`Created ${SEED_ROOMS.length} rooms`);

    console.log('Seeding providers...');
    // Clear existing providers and create new ones
    await Provider.deleteMany({});
    const createdProviders = await Provider.insertMany(SEED_PROVIDERS);
    console.log(`Created ${createdProviders.length} providers`);

    console.log('Seeding surgeons...');
    // Clear existing surgeons and create new ones
    await Surgeon.deleteMany({});
    const createdSurgeons = await Surgeon.insertMany(SEED_SURGEONS);
    console.log(`Created ${createdSurgeons.length} surgeons`);

    console.log('Creating admin user...');
    // Create admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@wesleychapel.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword);
      
      await User.create({
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'Admin',
        status: 'Active'
      });
      
      console.log(`Created admin user: ${adminEmail}`);
      console.log(`Admin password: ${adminPassword}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Rooms: ${SEED_ROOMS.length}`);
    console.log(`- Providers: ${SEED_PROVIDERS.length}`);
    console.log(`- Surgeons: ${SEED_SURGEONS.length}`);
    console.log(`- Admin User: ${adminEmail}`);

    return {
      success: true,
      rooms: SEED_ROOMS.length,
      providers: createdProviders.length,
      surgeons: createdSurgeons.length,
      admin: adminEmail
    };

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}