// Script to seed comprehensive database-driven content into RushDB
const fs = require("fs");
const path = require("path");

// Manually load .env variables if present
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

let isRushDBConnected, getSchemaCatalog, findRecords, createRecord, updateRecord;

const defaultSettings = {
  id: "site-settings",
  websiteName: "S4DS MITAOE",
  websiteTagline: "Think. Analyze. Innovate.",
  websiteDescription:
    "Society for Data Science Student Chapter at MIT Academy of Engineering, Alandi, Pune. Nurturing innovation, machine learning mastery, and data science leadership.",
  logoUrl: "/images/logo.png",
  logoMediaId: null,
  contactEmail: process.env.NEXT_PUBLIC_CHAPTER_EMAIL || "s4ds.datascience@mitaoe.ac.in",
  contactPhone: "+91 98765 43210",
  contactAddress: "MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune, Maharashtra 412105",
  contactCoordinates: "Alandi (D), Pune - 412105",
  socialLinks: {
    linkedin: "https://linkedin.com",
    github: "https://github.com/kunal285/S4DS",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    discord: "https://discord.com",
    website: "https://mitaoe.ac.in",
  },
  footerText:
    "Society for Data Science Student Chapter at MIT Academy of Engineering, Alandi, Pune. Nurturing innovation, machine learning mastery, and data science leadership.",
  copyrightText: "© 2026 S4DS MITAOE Student Chapter. All rights reserved.",

  homepage: {
    heroHeadline: "Something Extraordinary Is Brewing.",
    heroTagline: "Think. Analyze. Innovate.",
    heroDescription:
      "We're building a digital home for curious minds, data enthusiasts and future innovators. Our new website is currently under development. Stay connected with S4DS MITAOE.",
    heroBadgeText: "Official Launch Countdown",
    roadmapHeading: "Upcoming Chapter Highlights",
    roadmapSubheading:
      "Here is a sneak peek at what is arriving with the official S4DS MITAOE complete web platform.",
    previewCards: [
      {
        title: "Workshops & Hackathons",
        tag: "Coming Soon",
        desc: "Hands-on masterclasses in Generative AI, PyTorch, BigQuery, and full-stack data apps.",
        href: "/events",
        iconName: "Database",
      },
      {
        title: "Executive Team & Faculty",
        tag: "Coming Soon",
        desc: "Meet our student core team, faculty mentors, and advisory board driving chapter initiatives.",
        href: "/team",
        iconName: "Users",
      },
      {
        title: "Annual Event Gallery",
        tag: "Coming Soon",
        desc: "Curated high-resolution archives of campus exhibitions, speaker sessions, and project showcases.",
        href: "/gallery",
        iconName: "Layers",
      },
      {
        title: "Chapter Membership Hub",
        tag: "Coming Soon",
        desc: "Exclusive member benefits, discount passes, community discord, and technical certification track.",
        href: "/membership",
        iconName: "Sparkles",
      },
    ],
  },

  about: {
    headline: "Pioneering Data Science & Artificial Intelligence Excellence",
    story:
      "The Society for Data Science (S4DS) Student Chapter at MIT Academy of Engineering was founded to bridge the gap between academic theory and real-world data science, machine learning, and artificial intelligence applications. We cultivate a collaborative ecosystem of student developers, researchers, and tech pioneers.",
    mission:
      "To empower students with deep theoretical understanding and production-grade hands-on engineering skills in data science, artificial intelligence, and cutting-edge software engineering.",
    vision:
      "To be a premier student-led hub producing world-class data scientists, researchers, and innovators who solve impactful real-world challenges.",
    facultyCoordinator: "Prof. Aparna Kulkarni",
    facultyDepartment: "Department of Computer Engineering (Data Science)",
    facultyCollege: "MIT Academy of Engineering, Pune",
    facultyBio:
      "Assistant Professor in Computer Science & Engineering (Data Science) guiding the S4DS student chapter and driving academic innovation.",
    stats: [
      { label: "Active Members", value: "250+" },
      { label: "Workshops & Seminars", value: "35+" },
      { label: "Hackathons & Challenges", value: "12+" },
      { label: "Projects Incubated", value: "40+" },
    ],
  },

  technex: {
    title: "TECHNEX 2K26 – THE PROJECT EXPO",
    tagline: "National Flagship Project Exhibition & Competition",
    description:
      "The premier annual flagship Project Expo and Competition organized by the Society for Data Science (S4DS) Student Chapter, MITAOE. Showcase breakthrough innovations across AI/ML, Web3, IoT, Cloud, and Software Engineering.",
    date: "2026-11-21",
    time: "09:00 AM - 05:00 PM IST",
    venue: "MIT Academy of Engineering Campus & Central Auditorium, Alandi, Pune",
    mode: "Offline / In-Person",
    posterUrl:
      "https://cflqsjjkekfrnjjbhuja.supabase.co/storage/v1/object/public/s4ds-media/events/posters/1794862447532_TECHNEX_2K26_Project_Expo_Poster__2_.png",
    posterMediaId: "media-1794862449757-g1b7",
    minTeamSize: 1,
    maxTeamSize: 4,
    registrationOpen: true,
    registrationDeadline: "2026-11-20T23:59:59",
    whatsappUrl: "https://chat.whatsapp.com/KFYW22NYGasBag1RZjnKJl",
    whatsappEnabled: true,
    paymentInstructions:
      "1. Scan the official S4DS UPI QR code below using any UPI app (GPay, PhonePe, Paytm).\n2. Enter the exact registration fee shown for your membership category.\n3. Note down the 12-digit UPI Transaction ID / UTR.\n4. Take a clear screenshot of the completed payment and upload it below.",
    activePaymentQrId: "media-1794863268432-zvv7",
    activePaymentQrUrl:
      "https://cflqsjjkekfrnjjbhuja.supabase.co/storage/v1/object/public/s4ds-media/payment/qr-codes/1794863268060_s4ds-official-technex-qr.png",
    membershipTiers: [
      { id: "s4ds", name: "S4DS Member", fee: 49, description: "Active S4DS Chapter Member (PRN required)" },
      { id: "non-s4ds", name: "Non-S4DS Member", fee: 99, description: "Student from MITAOE or other recognized colleges" },
    ],
    domains: [
      "Artificial Intelligence & ML",
      "Data Science & Predictive Analytics",
      "Web3 & Decentralized Apps",
      "IoT, Robotics & Embedded Systems",
      "Cloud Architecture & DevOps",
      "Open Track: Interdisciplinary Innovation",
    ],
  },

  announcement: {
    enabled: true,
    text: "🚀 Registrations are LIVE for TECHNEX 2K26 – National Project Expo!",
    link: "/technex-2k26",
  },

  activePaymentQrId: "media-1794863268432-zvv7",
  activeBannerId: null,
  technexWhatsappUrl: "https://chat.whatsapp.com/KFYW22NYGasBag1RZjnKJl",
  technexWhatsappEnabled: true,

  launchMode: true,
  pageAvailability: {
    home: true,
    technex: true,
    contact: true,
    about: false,
    events: false,
    team: false,
    gallery: false,
    projects: false,
    membership: false,
  },
};

const sampleProjects = [
  {
    id: "proj-1",
    title: "NeuroScan: Brain Tumor MRI Segmentation & 3D Visualization",
    domain: "Artificial Intelligence & ML",
    category: "AI / Healthcare",
    description:
      "Deep residual U-Net architecture paired with 3D volumetric reconstruction for automated gliomas segmentation and clinical volume quantification.",
    techStack: ["PyTorch", "MONAI", "FastAPI", "React", "Three.js"],
    authors: ["Harsh Holkar", "Sameet Pisal", "Ishwari Khebade"],
    githubUrl: "https://github.com/kunal285/neuroscan-mri",
    liveUrl: "https://neuroscan.mitaoe.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "AgriPulse: Satellite Multispectral Crop Health & Yield Predictor",
    domain: "Data Science & Predictive Analytics",
    category: "Data Science / Agriculture",
    description:
      "Time-series transformer model processing Sentinel-2 satellite imagery to compute NDVI and forecast agricultural yield with 94.2% accuracy.",
    techStack: ["TensorFlow", "Google Earth Engine", "Python", "Streamlit"],
    authors: ["Prathmesh Patil", "Vivek Jogdande"],
    githubUrl: "https://github.com/kunal285/agripulse",
    liveUrl: "https://agripulse.mitaoe.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "ChainAudit: Automated Solidity Smart Contract Vulnerability Scanner",
    domain: "Web3 & Decentralized Apps",
    category: "Blockchain / Security",
    description:
      "Static analysis and symbolic execution engine detecting reentrancy, integer overflows, and access control flaws in EVM smart contracts.",
    techStack: ["Rust", "Solidity", "Next.js", "Web3.js"],
    authors: ["Kunal Gavit", "Sameet Pisal"],
    githubUrl: "https://github.com/kunal285/chainaudit",
    liveUrl: "https://chainaudit.mitaoe.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "AeroVision: Edge-AI Drone Navigation & Obstacle Avoidance",
    domain: "IoT, Robotics & Embedded Systems",
    category: "Robotics / Edge AI",
    description:
      "Real-time stereo-depth computer vision inference running on NVIDIA Jetson Orin Nano for autonomous quadcopter navigation in GPS-denied environments.",
    techStack: ["YOLOv8", "NVIDIA Jetson", "ROS2", "OpenCV", "C++"],
    authors: ["Himani Bhurkunde", "Shravani Thaware"],
    githubUrl: "https://github.com/kunal285/aerovision",
    liveUrl: "https://aerovision.mitaoe.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

const sampleGallery = [
  {
    id: "gal-1",
    title: "TECHNEX 2025 Grand Inauguration & Keynote",
    category: "Flagship Events",
    description:
      "Opening ceremony of TECHNEX with keynote address by industry leaders on Enterprise Generative AI.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    date: "2025-10-15",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-2",
    title: "AI/ML Hands-on Bootcamp & Hack Lab",
    category: "Workshops",
    description:
      "Over 120 students building and deploying PyTorch neural networks during our 2-day hands-on bootcamp.",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    date: "2025-08-22",
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-3",
    title: "MITAOE Annual Project Exhibition Pavilion",
    category: "Exhibitions",
    description:
      "Student engineering teams presenting hardware and software prototypes to industry judges.",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    date: "2025-11-10",
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-4",
    title: "S4DS Chapter Induction & Welcome Ceremony",
    category: "Community",
    description:
      "Welcoming 150+ incoming data science enthusiasts into the S4DS MITAOE family.",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    date: "2025-07-30",
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-5",
    title: "Cloud & Big Data Infrastructure Seminar",
    category: "Workshops",
    description:
      "Exploring Google BigQuery, Dataproc, and modern data warehouses with visiting cloud architects.",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    date: "2025-09-18",
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-6",
    title: "TECHNEX Grand Finale & Awards Ceremony",
    category: "Flagship Events",
    description:
      "Honoring top student innovators with cash awards and technical mentorship certificates.",
    imageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    date: "2025-10-16",
    order: 6,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  const rushdb = await import("../src/lib/rushdb.js");
  isRushDBConnected = rushdb.isRushDBConnected;
  getSchemaCatalog = rushdb.getSchemaCatalog;
  findRecords = rushdb.findRecords;
  createRecord = rushdb.createRecord;
  updateRecord = rushdb.updateRecord;

  console.log("Checking RushDB connection...");
  const connected = await isRushDBConnected();
  if (!connected) {
    console.error("RushDB is not reachable. Check environment variables.");
    process.exit(1);
  }
  console.log("RushDB Connected!");

  // 1. Seed or Update SETTING
  console.log("\n1. Syncing Centralized Website Settings...");
  const existingSettings = await findRecords("SETTING", { limit: 1 });
  if (existingSettings && existingSettings.length > 0) {
    const current = existingSettings[0];
    const merged = { ...defaultSettings, ...current };
    // Ensure nested objects are merged
    merged.homepage = { ...defaultSettings.homepage, ...(current.homepage || {}) };
    merged.about = { ...defaultSettings.about, ...(current.about || {}) };
    merged.technex = { ...defaultSettings.technex, ...(current.technex || {}) };
    merged.socialLinks = { ...defaultSettings.socialLinks, ...(current.socialLinks || {}) };
    merged.announcement = { ...defaultSettings.announcement, ...(current.announcement || {}) };
    merged.pageAvailability = { ...defaultSettings.pageAvailability, ...(current.pageAvailability || {}) };
    merged.activePaymentQrId = defaultSettings.activePaymentQrId;
    merged.technexWhatsappUrl = defaultSettings.technexWhatsappUrl;

    await updateRecord("SETTING", current.id, merged);
    console.log("Updated SETTING record successfully:", current.id);
  } else {
    const created = await createRecord("SETTING", defaultSettings);
    console.log("Created SETTING record:", created.id);
  }

  // 2. Seed Projects if empty
  console.log("\n2. Checking PROJECTS...");
  const existingProjects = await findRecords("PROJECT");
  if (!existingProjects || existingProjects.length === 0) {
    console.log(`Seeding ${sampleProjects.length} projects...`);
    for (const p of sampleProjects) {
      await createRecord("PROJECT", p);
    }
    console.log("Projects seeded successfully.");
  } else {
    console.log(`Found ${existingProjects.length} existing projects.`);
  }

  // 3. Seed Gallery if empty
  console.log("\n3. Checking GALLERY...");
  const existingGallery = await findRecords("GALLERY_ITEM");
  if (!existingGallery || existingGallery.length === 0) {
    console.log(`Seeding ${sampleGallery.length} gallery items...`);
    for (const g of sampleGallery) {
      await createRecord("GALLERY_ITEM", g);
    }
    console.log("Gallery seeded successfully.");
  } else {
    console.log(`Found ${existingGallery.length} existing gallery items.`);
  }

  // 4. Update Media Items active flags
  console.log("\n4. Checking MEDIA_ITEM records...");
  const mediaItems = await findRecords("MEDIA_ITEM");
  for (const m of mediaItems) {
    if (m.category === "payment-qr") {
      await updateRecord("MEDIA_ITEM", m.id, { isActive: true });
      console.log(`Marked Payment QR (${m.id}) as active.`);
    } else if (m.category === "event-poster") {
      await updateRecord("MEDIA_ITEM", m.id, { isActive: true });
      console.log(`Marked Event Poster (${m.id}) as active.`);
    }
  }

  console.log("\nAll Database Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
