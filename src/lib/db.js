import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  isRushDBConnected,
  getSchemaCatalog,
  findRecords,
  findRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  bootstrapRushDBSchema,
  getRushDBClient,
} from "./rushdb.js";

export { isRushDBConnected, getSchemaCatalog, getRushDBClient };

// File storage path for persistent fallback
const DATA_DIR = path.join(process.cwd(), "src", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Default initial seed data
const getInitialSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminEmail = process.env.ADMIN_EMAIL || "s4ds.datascience@mitaoe.ac.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@S4DSMITAOE";
  const adminName = process.env.ADMIN_NAME || "S4DS MITAOE Administrator";
  const adminPasswordHash = bcrypt.hashSync(adminPassword, salt);

  return {
    admins: [
      {
        id: "admin-1",
        email: adminEmail,
        name: adminName,
        passwordHash: adminPasswordHash,
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ],
    events: [
      {
        id: "event-technex-2026",
        title: "TECHNEX 2K26 - National Project Expo",
        category: "Competition",
        date: "2026-11-28",
        time: "09:00 AM - 05:00 PM IST",
        venue: "MIT Academy of Engineering Campus & Central Auditorium, Alandi, Pune",
        description:
          "The premier annual flagship Project Expo and Competition organized by the Society for Data Science (S4DS) Student Chapter, MITAOE. Showcase breakthrough innovations across AI/ML, Web3, IoT, Cloud, and Software Engineering.",
        posterUrl: "/images/technex-poster.png",
        registrationDeadline: "2026-11-25",
        prizePool: "₹50,000+",
        status: "Upcoming",
        isFeatured: true,
        createdAt: "2026-11-01T10:00:00.000Z",
      },
    ],
    team: [
      {
        id: "team-1",
        name: "Prof. Aparna Kulkarni",
        role: "Faculty Coordinator",
        domain: "Faculty Mentorship",
        year: "Faculty, Dept of CSE (Data Science)",
        bio: "Assistant Professor in Computer Science & Engineering (Data Science) guiding the S4DS student chapter and driving academic innovation.",
        avatarUrl: "/images/team/aparna-kulkarni.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 1,
      },
      {
        id: "team-2",
        name: "Harsh Holkar",
        role: "President",
        domain: "Core Leadership",
        year: "B.Tech CSE (Data Science)",
        bio: "Leading strategic chapter vision, TECHNEX 2K26 coordination, and industry-academic alliances.",
        avatarUrl: "/images/team/harsh-holkar.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 2,
      },
      {
        id: "team-3",
        name: "Prathmesh Patil",
        role: "General Secretary",
        domain: "Core Leadership",
        year: "B.Tech CSE (Data Science)",
        bio: "Managing executive operations, chapter communication, and inter-collegiate event logistics.",
        avatarUrl: "/images/team/prathmesh-patil.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 3,
      },
      {
        id: "team-4",
        name: "Mansi Munde",
        role: "Secretary",
        domain: "Core Leadership",
        year: "B.Tech CSE (Data Science)",
        bio: "Overseeing administrative proceedings, chapter documentation, and membership facilitation.",
        avatarUrl: "/images/team/mansi-munde.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 4,
      },
      {
        id: "team-5",
        name: "Vivek Jogdande",
        role: "Treasurer",
        domain: "Core Leadership",
        year: "B.Tech CSE (Data Science)",
        bio: "Managing chapter finance, budget allocations for TECHNEX 2K26, sponsorships, and fiscal compliance.",
        avatarUrl: "/images/team/vivek-jogdande.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 5,
      },
      {
        id: "team-6",
        name: "Sameet Pisal",
        role: "Technical Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Directing technical bootcamps, code challenges, hackathons, and software architecture for chapter systems.",
        avatarUrl: "/images/team/sameet-pisal.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 6,
      },
      {
        id: "team-7",
        name: "Samiksha Sing",
        role: "Design Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Crafting brand identity, UI/UX aesthetics, promotional media, and visual design for S4DS and TECHNEX.",
        avatarUrl: "/images/team/samiksha-sing.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 7,
      },
      {
        id: "team-8",
        name: "Sneha Tidke",
        role: "Event Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Spearheading event planning, guest lecture hosting, venue scheduling, and on-ground logistics execution.",
        avatarUrl: "/images/team/sneha-tidke.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 8,
      },
      {
        id: "team-9",
        name: "Himani Bhurkunde",
        role: "Marketing Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Managing corporate outreach, student engagement drives, and campaign promotions across engineering colleges.",
        avatarUrl: "/images/team/himani-bhurkunde.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 9,
      },
      {
        id: "team-10",
        name: "Shravani Thaware",
        role: "Cultural Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Organizing community celebrations, icebreaker sessions, and chapter engagement initiatives.",
        avatarUrl: "/images/team/shravani-thaware.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 10,
      },
      {
        id: "team-11",
        name: "Kunal Gavit",
        role: "Social Media Head",
        domain: "Domain Heads",
        year: "B.Tech CSE (Data Science)",
        bio: "Leading digital presence, community content creation, online branding, and live event coverage.",
        avatarUrl: "/images/team/kunal-gavit.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com/kunal285",
        order: 11,
      },
      {
        id: "team-12",
        name: "Ishwari Khebade",
        role: "Technical Co-Head",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Coordinating workshop problem statements, technical reviews, and hands-on coding labs.",
        avatarUrl: "/images/team/ishwari-khebade.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        order: 12,
      },
      {
        id: "team-13",
        name: "Ishart Mulani",
        role: "Cultural Co-Head",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Supporting student engagement programs, ceremonies, and collaborative community activities.",
        avatarUrl: "/images/team/ishart-mulani.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 13,
      },
      {
        id: "team-14",
        name: "Khushi Dandekar",
        role: "Social Media Coordinator",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Coordinating social feeds, reel updates, and real-time interactive audience engagement.",
        avatarUrl: "/images/team/khushi-dandekar.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 14,
      },
      {
        id: "team-15",
        name: "Naina Saini",
        role: "Design Coordinator",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Designing badges, social media assets, posters, and presentation decks for chapter programs.",
        avatarUrl: "/images/team/naina-saini.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 15,
      },
      {
        id: "team-16",
        name: "Prapti Rudrawar",
        role: "Student Coordinator",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Facilitating member queries, helpdesk coordination, and registration desk logistics.",
        avatarUrl: "/images/team/prapti-rudrawar.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 16,
      },
      {
        id: "team-17",
        name: "Aayush Mandalkar",
        role: "Student Coordinator",
        domain: "Co-Heads & Coordinators",
        year: "B.Tech CSE (Data Science)",
        bio: "Assisting with participant check-in, booth assignments, and on-site event operations.",
        avatarUrl: "/images/team/aayush-mandalkar.jpg",
        linkedinUrl: "https://linkedin.com",
        githubUrl: "",
        order: 17,
      },
    ],
    projects: [],
    gallery: [],
    memberships: [],
    technexRegistrations: [],
    mediaItems: [],
    settings: {
      activePaymentQrId: null,
      activeBannerId: null,
    },
  };
};

// Initialize file database
function getFileDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, returning fallback seed:", err);
    return getInitialSeedData();
  }
}

function saveFileDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}

/**
 * Initialize RushDB if reachable by syncing seed catalog data.
 */
export async function initRushDB() {
  try {
    if (await isRushDBConnected()) {
      const seed = getFileDb();
      await bootstrapRushDBSchema(seed);
      return true;
    }
  } catch (err) {
    console.warn("RushDB initialization notice:", err.message);
  }
  return false;
}

// ─────────────────────────────────────────────
// EVENTS CRUD (RushDB Primary + Fallback)
// ─────────────────────────────────────────────
export async function getEvents({ category, search, status } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("EVENT")) {
        const where = {};
        if (category && category !== "All") where.category = category;
        if (status && status !== "All") where.status = status;
        let list = await findRecords("EVENT", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (e) => e.title?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s)
          );
        }
        return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getEvents fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.events || [];

  if (category && category !== "All") {
    list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== "All") {
    list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((e) => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
  }
  return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

export async function getEventById(id) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("EVENT")) {
        const item = await findRecordById("EVENT", id);
        if (item) return item;
      }
    }
  } catch (err) {
    console.warn("RushDB getEventById fallback:", err.message);
  }

  const db = getFileDb();
  return (db.events || []).find((e) => e.id === id) || null;
}

export async function createEvent(data) {
  const newEvent = {
    id: `event-${Date.now()}`,
    title: data.title || "Untitled Event",
    category: data.category || "General",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time || "10:00 AM",
    venue: data.venue || "MITAOE Campus",
    description: data.description || "",
    posterUrl: data.posterUrl || "/images/technex-poster.png",
    registrationDeadline: data.registrationDeadline || "",
    prizePool: data.prizePool || "",
    status: data.status || "Upcoming",
    isFeatured: Boolean(data.isFeatured),
    createdAt: new Date().toISOString(),
  };

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("EVENT", newEvent);
    }
  } catch (err) {
    console.warn("RushDB createEvent fallback:", err.message);
  }

  const db = getFileDb();
  db.events = [newEvent, ...(db.events || [])];
  saveFileDb(db);
  return newEvent;
}

export async function updateEvent(id, updates) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("EVENT", id, updates);
    }
  } catch (err) {
    console.warn("RushDB updateEvent fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.events || []).findIndex((e) => e.id === id);
  if (index === -1) return null;

  db.events[index] = {
    ...db.events[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.events[index];
}

export async function deleteEvent(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("EVENT", id);
    }
  } catch (err) {
    console.warn("RushDB deleteEvent fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.events || []).length;
  db.events = (db.events || []).filter((e) => e.id !== id);
  saveFileDb(db);
  return db.events.length < initialLen;
}

// ─────────────────────────────────────────────
// TEAM CRUD (RushDB Primary + Fallback)
// ─────────────────────────────────────────────
export async function getTeam({ domain, search } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TEAM_MEMBER")) {
        const where = {};
        if (domain && domain !== "All") where.domain = domain;
        let list = await findRecords("TEAM_MEMBER", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter((m) => m.name?.toLowerCase().includes(s) || m.role?.toLowerCase().includes(s));
        }
        return list.sort((a, b) => (a.order || 99) - (b.order || 99));
      }
    }
  } catch (err) {
    console.warn("RushDB getTeam fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.team || [];

  if (domain && domain !== "All") {
    list = list.filter((m) => m.domain.toLowerCase() === domain.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((m) => m.name.toLowerCase().includes(s) || m.role.toLowerCase().includes(s));
  }
  return list.sort((a, b) => (a.order || 99) - (b.order || 99));
}

export const getTeamMembers = getTeam;

export async function getTeamMemberById(id) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TEAM_MEMBER")) {
        const item = await findRecordById("TEAM_MEMBER", id);
        if (item) return item;
      }
    }
  } catch (err) {
    console.warn("RushDB getTeamMemberById fallback:", err.message);
  }

  const db = getFileDb();
  return (db.team || []).find((m) => m.id === id) || null;
}

export async function createTeamMember(data) {
  const db = getFileDb();
  const newMember = {
    id: `team-${Date.now()}`,
    name: data.name,
    role: data.role,
    domain: data.domain || "General",
    year: data.year || "Student",
    bio: data.bio || "",
    avatarUrl: data.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
    linkedinUrl: data.linkedinUrl || "",
    githubUrl: data.githubUrl || "",
    order: Number(data.order) || (db.team ? db.team.length + 1 : 1),
    createdAt: new Date().toISOString(),
  };

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("TEAM_MEMBER", newMember);
    }
  } catch (err) {
    console.warn("RushDB createTeamMember fallback:", err.message);
  }

  db.team = [...(db.team || []), newMember];
  saveFileDb(db);
  return newMember;
}

export async function updateTeamMember(id, updates) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("TEAM_MEMBER", id, updates);
    }
  } catch (err) {
    console.warn("RushDB updateTeamMember fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.team || []).findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.team[index] = {
    ...db.team[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.team[index];
}

export async function deleteTeamMember(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("TEAM_MEMBER", id);
    }
  } catch (err) {
    console.warn("RushDB deleteTeamMember fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.team || []).length;
  db.team = (db.team || []).filter((m) => m.id !== id);
  saveFileDb(db);
  return db.team.length < initialLen;
}

// ─────────────────────────────────────────────
// PROJECTS CRUD (RushDB Primary + Fallback)
// ─────────────────────────────────────────────
export async function getProjects({ domain, search, featuredOnly } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("PROJECT")) {
        const where = {};
        if (featuredOnly) where.isFeatured = true;
        let list = await findRecords("PROJECT", { where });
        if (domain && domain !== "All") {
          list = list.filter((p) => p.domain?.toLowerCase().includes(domain.toLowerCase()));
        }
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (p) =>
              p.title?.toLowerCase().includes(s) ||
              p.description?.toLowerCase().includes(s) ||
              (Array.isArray(p.technologies) && p.technologies.some((t) => t.toLowerCase().includes(s)))
          );
        }
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getProjects fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.projects || [];

  if (featuredOnly) {
    list = list.filter((p) => p.isFeatured);
  }
  if (domain && domain !== "All") {
    list = list.filter((p) => p.domain.toLowerCase().includes(domain.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (Array.isArray(p.technologies) && p.technologies.some((t) => t.toLowerCase().includes(s)))
    );
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getProjectById(id) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("PROJECT")) {
        const item = await findRecordById("PROJECT", id);
        if (item) return item;
      }
    }
  } catch (err) {
    console.warn("RushDB getProjectById fallback:", err.message);
  }

  const db = getFileDb();
  return (db.projects || []).find((p) => p.id === id) || null;
}

export async function createProject(data) {
  const technologies = Array.isArray(data.technologies)
    ? data.technologies
    : typeof data.technologies === "string"
    ? data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const newProject = {
    id: `proj-${Date.now()}`,
    title: data.title,
    domain: data.domain || "AI & Software",
    description: data.description || "",
    technologies,
    teamMembers: data.teamMembers || "",
    repoUrl: data.repoUrl || "",
    liveUrl: data.liveUrl || "",
    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=60",
    isFeatured: Boolean(data.isFeatured),
    createdAt: new Date().toISOString(),
  };

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("PROJECT", newProject);
    }
  } catch (err) {
    console.warn("RushDB createProject fallback:", err.message);
  }

  const db = getFileDb();
  db.projects = [newProject, ...(db.projects || [])];
  saveFileDb(db);
  return newProject;
}

export async function updateProject(id, updates) {
  if (updates.technologies && typeof updates.technologies === "string") {
    updates.technologies = updates.technologies.split(",").map((t) => t.trim()).filter(Boolean);
  }

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("PROJECT", id, updates);
    }
  } catch (err) {
    console.warn("RushDB updateProject fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.projects || []).findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.projects[index] = {
    ...db.projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.projects[index];
}

export async function deleteProject(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("PROJECT", id);
    }
  } catch (err) {
    console.warn("RushDB deleteProject fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.projects || []).length;
  db.projects = (db.projects || []).filter((p) => p.id !== id);
  saveFileDb(db);
  return db.projects.length < initialLen;
}

// ─────────────────────────────────────────────
// GALLERY CRUD (RushDB Primary + Fallback)
// ─────────────────────────────────────────────
export async function getGallery({ category, search } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("GALLERY_ITEM")) {
        const where = {};
        if (category && category !== "All") where.category = category;
        let list = await findRecords("GALLERY_ITEM", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter((g) => g.title?.toLowerCase().includes(s) || g.caption?.toLowerCase().includes(s));
        }
        return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getGallery fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.gallery || [];

  if (category && category !== "All") {
    list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((g) => g.title.toLowerCase().includes(s) || g.caption.toLowerCase().includes(s));
  }
  return list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

export const getGalleryItems = getGallery;

export async function getGalleryById(id) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("GALLERY_ITEM")) {
        const item = await findRecordById("GALLERY_ITEM", id);
        if (item) return item;
      }
    }
  } catch (err) {
    console.warn("RushDB getGalleryById fallback:", err.message);
  }

  const db = getFileDb();
  return (db.gallery || []).find((g) => g.id === id) || null;
}

export async function createGalleryItem(data) {
  const newItem = {
    id: `gal-${Date.now()}`,
    title: data.title,
    category: data.category || "Events",
    eventName: data.eventName || "",
    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    caption: data.caption || "",
    date: data.date || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("GALLERY_ITEM", newItem);
    }
  } catch (err) {
    console.warn("RushDB createGalleryItem fallback:", err.message);
  }

  const db = getFileDb();
  db.gallery = [newItem, ...(db.gallery || [])];
  saveFileDb(db);
  return newItem;
}

export async function updateGalleryItem(id, updates) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("GALLERY_ITEM", id, updates);
    }
  } catch (err) {
    console.warn("RushDB updateGalleryItem fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.gallery || []).findIndex((g) => g.id === id);
  if (index === -1) return null;

  db.gallery[index] = {
    ...db.gallery[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.gallery[index];
}

export async function deleteGalleryItem(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("GALLERY_ITEM", id);
    }
  } catch (err) {
    console.warn("RushDB deleteGalleryItem fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.gallery || []).length;
  db.gallery = (db.gallery || []).filter((g) => g.id !== id);
  saveFileDb(db);
  return db.gallery.length < initialLen;
}

// ─────────────────────────────────────────────
// MEMBERSHIP REGISTRATIONS
// ─────────────────────────────────────────────
export async function getMemberships({ search, status } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("MEMBERSHIP")) {
        const where = {};
        if (status && status !== "All") where.status = status;
        let list = await findRecords("MEMBERSHIP", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (m) =>
              m.fullName?.toLowerCase().includes(s) ||
              m.email?.toLowerCase().includes(s) ||
              m.prn?.toLowerCase().includes(s) ||
              (m.transactionId && m.transactionId.toLowerCase().includes(s))
          );
        }
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getMemberships fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.memberships || [];

  if (status && status !== "All") {
    list = list.filter((m) => m.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (m) =>
        m.fullName.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s) ||
        m.prn.toLowerCase().includes(s) ||
        (m.transactionId && m.transactionId.toLowerCase().includes(s))
    );
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function checkMembershipDuplicate({ email, prn, transactionId }) {
  const db = getFileDb();
  const existing = db.memberships || [];

  if (email && existing.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
    return { isDuplicate: true, field: "email", message: "A membership application with this email address already exists." };
  }
  if (prn && existing.some((m) => m.prn.toUpperCase() === prn.toUpperCase())) {
    return { isDuplicate: true, field: "prn", message: "A membership application with this PRN / Roll Number already exists." };
  }
  if (transactionId && existing.some((m) => m.transactionId.toUpperCase() === transactionId.toUpperCase())) {
    return { isDuplicate: true, field: "transactionId", message: "This Payment Transaction ID has already been submitted." };
  }
  return { isDuplicate: false };
}

export async function createMembership(data) {
  const duplicate = await checkMembershipDuplicate(data);
  if (duplicate.isDuplicate) {
    throw new Error(duplicate.message);
  }

  const newReg = {
    id: `mem-${Date.now()}`,
    fullName: data.fullName,
    email: data.email.toLowerCase().trim(),
    prn: data.prn.toUpperCase().trim(),
    department: data.department,
    academicYear: data.academicYear,
    phone: data.phone,
    membershipPlan: data.membershipPlan || "Annual (₹300)",
    transactionId: (data.transactionId || "").toUpperCase().trim(),
    paymentProofUrl: data.paymentProofUrl || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("MEMBERSHIP", newReg);
    }
  } catch (err) {
    console.warn("RushDB createMembership fallback:", err.message);
  }

  const db = getFileDb();
  db.memberships = [newReg, ...(db.memberships || [])];
  saveFileDb(db);
  return newReg;
}

export async function updateMembershipStatus(id, status) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("MEMBERSHIP", id, { status });
    }
  } catch (err) {
    console.warn("RushDB updateMembershipStatus fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.memberships || []).findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.memberships[index].status = status;
  db.memberships[index].updatedAt = new Date().toISOString();
  saveFileDb(db);
  return db.memberships[index];
}

export async function deleteMembership(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("MEMBERSHIP", id);
    }
  } catch (err) {
    console.warn("RushDB deleteMembership fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.memberships || []).length;
  db.memberships = (db.memberships || []).filter((m) => m.id !== id);
  saveFileDb(db);
  return db.memberships.length < initialLen;
}

// ─────────────────────────────────────────────
// TECHNEX 2K26 REGISTRATIONS
// ─────────────────────────────────────────────
export async function getTechnexRegistrations({ search, status, paymentStatus, domain } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TECHNEX_REGISTRATION")) {
        const where = {};
        if (status && status !== "All") where.status = status;
        if (paymentStatus && paymentStatus !== "All") where.paymentStatus = paymentStatus;
        if (domain && domain !== "All") where.domain = domain;
        let list = await findRecords("TECHNEX_REGISTRATION", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (r) =>
              r.teamName?.toLowerCase().includes(s) ||
              r.projectTitle?.toLowerCase().includes(s) ||
              r.leaderName?.toLowerCase().includes(s) ||
              r.leaderEmail?.toLowerCase().includes(s) ||
              r.leaderPrn?.toLowerCase().includes(s) ||
              (r.transactionId && r.transactionId.toLowerCase().includes(s))
          );
        }
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getTechnexRegistrations fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.technexRegistrations || [];

  if (status && status !== "All") {
    list = list.filter((r) => r.status && r.status.toLowerCase() === status.toLowerCase());
  }
  if (paymentStatus && paymentStatus !== "All") {
    list = list.filter((r) => r.paymentStatus && r.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
  }
  if (domain && domain !== "All") {
    list = list.filter((r) => r.domain && r.domain.toLowerCase() === domain.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.teamName.toLowerCase().includes(s) ||
        r.projectTitle.toLowerCase().includes(s) ||
        r.leaderName.toLowerCase().includes(s) ||
        r.leaderEmail.toLowerCase().includes(s) ||
        r.leaderPrn.toLowerCase().includes(s) ||
        (r.transactionId && r.transactionId.toLowerCase().includes(s))
    );
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function checkTechnexDuplicate({ teamName, leaderEmail, leaderPrn, transactionId }) {
  const db = getFileDb();
  const existing = db.technexRegistrations || [];

  if (teamName && existing.some((r) => r.teamName.toLowerCase() === teamName.toLowerCase())) {
    return { isDuplicate: true, field: "teamName", message: `Team name "${teamName}" is already registered. Please choose a unique name.` };
  }
  if (leaderEmail && existing.some((r) => r.leaderEmail.toLowerCase() === leaderEmail.toLowerCase())) {
    return { isDuplicate: true, field: "leaderEmail", message: "A team with this Leader Email has already been registered." };
  }
  if (leaderPrn && existing.some((r) => r.leaderPrn.toUpperCase() === leaderPrn.toUpperCase())) {
    return { isDuplicate: true, field: "leaderPrn", message: "A team with this Leader PRN has already been registered." };
  }
  if (transactionId && existing.some((r) => r.transactionId.toUpperCase() === transactionId.toUpperCase())) {
    return { isDuplicate: true, field: "transactionId", message: "This Payment Transaction ID has already been submitted for TECHNEX." };
  }
  return { isDuplicate: false };
}

export async function createTechnexRegistration(data) {
  const duplicate = await checkTechnexDuplicate(data);
  if (duplicate.isDuplicate) {
    throw new Error(duplicate.message);
  }

  const db = getFileDb();
  const count = (db.technexRegistrations || []).length + 1;
  const regCode = `TNX-2026-${String(count).padStart(3, "0")}`;

  const newReg = {
    id: `technex-${Date.now()}`,
    registrationCode: regCode,
    membershipType: data.membershipType || "Non-S4DS Member",
    registrationFee: Number(data.registrationFee) || 99,
    teamName: data.teamName.trim(),
    projectTitle: data.projectTitle.trim(),
    domain: data.domain,
    abstractSummary: data.abstractSummary || "",
    githubOrDriveUrl: data.githubOrDriveUrl || "",
    leaderName: data.leaderName.trim(),
    leaderEmail: data.leaderEmail.toLowerCase().trim(),
    leaderPhone: data.leaderPhone.trim(),
    leaderCollege: data.leaderCollege.trim(),
    leaderPrn: data.leaderPrn.toUpperCase().trim(),
    teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
    transactionId: (data.transactionId || "").toUpperCase().trim(),
    paymentProofUrl: data.paymentProofUrl || "",
    paymentStatus: "Pending Verification",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  // 1. Store in RushDB as primary database
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("TECHNEX_REGISTRATION", newReg);
    }
  } catch (err) {
    console.warn("RushDB createTechnexRegistration fallback:", err.message);
  }

  // 2. Store in local persistent JSON
  db.technexRegistrations = [newReg, ...(db.technexRegistrations || [])];
  saveFileDb(db);
  return newReg;
}

export async function updateTechnexStatus(id, updatePayload) {
  let fields = {};
  if (typeof updatePayload === "string") {
    fields = { status: updatePayload };
  } else if (typeof updatePayload === "object" && updatePayload !== null) {
    fields = updatePayload;
  }

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("TECHNEX_REGISTRATION", id, fields);
    }
  } catch (err) {
    console.warn("RushDB updateTechnexStatus fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.technexRegistrations || []).findIndex((r) => r.id === id);
  if (index === -1) return null;

  db.technexRegistrations[index] = {
    ...db.technexRegistrations[index],
    ...fields,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.technexRegistrations[index];
}

export async function deleteTechnexRegistration(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("TECHNEX_REGISTRATION", id);
    }
  } catch (err) {
    console.warn("RushDB deleteTechnexRegistration fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.technexRegistrations || []).length;
  db.technexRegistrations = (db.technexRegistrations || []).filter((r) => r.id !== id);
  saveFileDb(db);
  return db.technexRegistrations.length < initialLen;
}

// ─────────────────────────────────────────────
// MEDIA MANAGER & SUPABASE STORAGE METADATA (RushDB)
// ─────────────────────────────────────────────
export async function getMediaItems({ category, search, activeOnly } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("MEDIA_ITEM")) {
        const where = {};
        if (category && category !== "All") where.category = category;
        if (activeOnly) where.isActive = true;
        let list = await findRecords("MEDIA_ITEM", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (m) =>
              m.title?.toLowerCase().includes(s) ||
              m.fileName?.toLowerCase().includes(s) ||
              m.storagePath?.toLowerCase().includes(s)
          );
        }
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getMediaItems fallback:", err.message);
  }

  const db = getFileDb();
  let list = db.mediaItems || [];
  if (category && category !== "All") {
    list = list.filter((m) => m.category === category);
  }
  if (activeOnly) {
    list = list.filter((m) => m.isActive);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (m) =>
        m.title?.toLowerCase().includes(s) ||
        m.fileName?.toLowerCase().includes(s) ||
        m.storagePath?.toLowerCase().includes(s)
    );
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getMediaItemById(id) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("MEDIA_ITEM")) {
        const item = await findRecordById("MEDIA_ITEM", id);
        if (item) return item;
      }
    }
  } catch (err) {
    console.warn("RushDB getMediaItemById fallback:", err.message);
  }

  const db = getFileDb();
  return (db.mediaItems || []).find((m) => m.id === id) || null;
}

export async function createMediaItem(data) {
  const newItem = {
    id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: data.title || data.fileName || "Uploaded Asset",
    fileName: data.fileName || "asset",
    category: data.category || "event-poster",
    folder: data.folder || "events/posters",
    storagePath: data.storagePath,
    fileUrl: data.fileUrl,
    fileSize: Number(data.fileSize) || 0,
    mimeType: data.mimeType || "image/png",
    isPrivate: Boolean(data.isPrivate),
    isActive: Boolean(data.isActive),
    associatedRecordId: data.associatedRecordId || null,
    createdAt: new Date().toISOString(),
  };

  if (newItem.isActive && (newItem.category === "payment-qr" || newItem.category === "website-banner")) {
    await deactivateOtherCategoryMedia(newItem.category, newItem.id);
  }

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await createRecord("MEDIA_ITEM", newItem);
    }
  } catch (err) {
    console.warn("RushDB createMediaItem fallback:", err.message);
  }

  const db = getFileDb();
  db.mediaItems = [newItem, ...(db.mediaItems || [])];
  saveFileDb(db);
  return newItem;
}

export async function updateMediaItem(id, updates) {
  if (updates.isActive && updates.category && (updates.category === "payment-qr" || updates.category === "website-banner")) {
    await deactivateOtherCategoryMedia(updates.category, id);
  }

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await updateRecord("MEDIA_ITEM", id, updates);
    }
  } catch (err) {
    console.warn("RushDB updateMediaItem fallback:", err.message);
  }

  const db = getFileDb();
  const index = (db.mediaItems || []).findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.mediaItems[index] = {
    ...db.mediaItems[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveFileDb(db);
  return db.mediaItems[index];
}

export async function deleteMediaItem(id) {
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      await deleteRecord("MEDIA_ITEM", id);
    }
  } catch (err) {
    console.warn("RushDB deleteMediaItem fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.mediaItems || []).length;
  db.mediaItems = (db.mediaItems || []).filter((m) => m.id !== id);
  saveFileDb(db);
  return db.mediaItems.length < initialLen;
}

export async function deactivateOtherCategoryMedia(category, currentId) {
  try {
    if (await isRushDBConnected()) {
      const allCategoryItems = await findRecords("MEDIA_ITEM", { where: { category } });
      for (const item of allCategoryItems) {
        if (item.id !== currentId && item.isActive) {
          await updateRecord("MEDIA_ITEM", item.id, { isActive: false });
        }
      }
    }
  } catch (err) {
    console.warn("deactivateOtherCategoryMedia notice:", err.message);
  }

  const db = getFileDb();
  if (db.mediaItems) {
    db.mediaItems = db.mediaItems.map((m) =>
      m.category === category && m.id !== currentId ? { ...m, isActive: false } : m
    );
    saveFileDb(db);
  }
}

export async function getActivePaymentQr() {
  const items = await getMediaItems({ category: "payment-qr", activeOnly: true });
  if (items && items.length > 0) {
    return items[0];
  }
  const allQr = await getMediaItems({ category: "payment-qr" });
  if (allQr && allQr.length > 0) {
    return allQr[0];
  }
  return {
    id: "default-qr",
    title: "Official S4DS MITAOE Payment QR",
    fileUrl: "/images/payment-qr.png",
    isActive: true,
  };
}

// ─────────────────────────────────────────────
// ADMIN & STATS
// ─────────────────────────────────────────────
export async function getAdminByEmail(email) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("ADMIN")) {
        const admin = await findRecords("ADMIN", { where: { email } });
        if (admin && admin.length > 0) return admin[0];
      }
    }
  } catch (err) {
    console.warn("RushDB getAdminByEmail fallback:", err.message);
  }

  const db = getFileDb();
  return (db.admins || []).find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getDashboardStats() {
  const db = getFileDb();
  const events = db.events || [];
  const team = db.team || [];
  const projects = db.projects || [];
  const gallery = db.gallery || [];
  const memberships = db.memberships || [];
  const technex = db.technexRegistrations || [];
  const media = db.mediaItems || [];

  return {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === "Upcoming").length,
    totalTeamMembers: team.length,
    totalProjects: projects.length,
    totalGalleryItems: gallery.length,
    totalMemberships: memberships.length,
    pendingMemberships: memberships.filter((m) => m.status === "Pending").length,
    approvedMemberships: memberships.filter((m) => m.status === "Approved").length,
    totalTechnexTeams: technex.length,
    pendingTechnexTeams: technex.filter((t) => t.status === "Pending").length,
    approvedTechnexTeams: technex.filter((t) => t.status === "Approved").length,
    totalMediaItems: media.length,
  };
}
