import fs from "fs";
import path from "path";
import crypto from "crypto";
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

// High-performance in-memory cache with TTL and instant invalidation
const memCache = new Map();

export function getCached(key, ttlMs = 30000) {
  const item = memCache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > ttlMs) {
    memCache.delete(key);
    return null;
  }
  return item.value;
}

export function setCached(key, value) {
  memCache.set(key, { value, time: Date.now() });
}

export function clearDbCache(pattern) {
  if (!pattern) {
    memCache.clear();
    return;
  }
  for (const k of memCache.keys()) {
    if (k.startsWith(pattern)) {
      memCache.delete(k);
    }
  }
}

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
        date: "2026-11-21",
        time: "09:00 AM - 05:00 PM IST",
        venue: "MIT Academy of Engineering Campus & Central Auditorium, Alandi, Pune",
        description:
          "The premier annual flagship Project Expo and Competition organized by the Society for Data Science (S4DS) Student Chapter, MITAOE. Showcase breakthrough innovations across AI/ML, Web3, IoT, Cloud, and Software Engineering.",
        posterUrl: "/images/technex-poster.png",
        registrationDeadline: "2026-11-20",
        prizePool: "",
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
      technexWhatsappUrl: process.env.NEXT_PUBLIC_TECHNEX_WHATSAPP_URL || "https://chat.whatsapp.com/KFYW22NYGasBag1RZjnKJl",
      technexWhatsappEnabled: true,
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
  const cacheKey = `events:${category || "all"}:${status || "all"}:${search || ""}`;
  const cached = getCached(cacheKey, 30000);
  if (cached) return cached;

  let sortedList = null;
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
        sortedList = list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getEvents fallback:", err.message);
  }

  if (!sortedList) {
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
    sortedList = list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }

  setCached(cacheKey, sortedList);
  return sortedList;
}

export async function getEventById(id) {
  if (!id) return null;
  const cacheKey = `event:${id}`;
  const cached = getCached(cacheKey, 60000);
  if (cached) return cached;

  let item = null;
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("EVENT")) {
        item = await findRecordById("EVENT", id);
      }
    }
  } catch (err) {
    console.warn("RushDB getEventById fallback:", err.message);
  }

  if (!item) {
    const db = getFileDb();
    item = (db.events || []).find((e) => e.id === id) || null;
  }

  if (item) setCached(cacheKey, item);
  return item;
}

export async function createEvent(data) {
  clearDbCache("events");
  clearDbCache("event:");
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
  clearDbCache("events");
  clearDbCache("event:");
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
  clearDbCache("events");
  clearDbCache("event:");
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
  const cacheKey = `team:${domain || "all"}:${search || ""}`;
  const cached = getCached(cacheKey, 30000);
  if (cached) return cached;

  let sortedList = null;
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
        sortedList = list.sort((a, b) => (a.order || 99) - (b.order || 99));
      }
    }
  } catch (err) {
    console.warn("RushDB getTeam fallback:", err.message);
  }

  if (!sortedList) {
    const db = getFileDb();
    let list = db.team || [];

    if (domain && domain !== "All") {
      list = list.filter((m) => m.domain.toLowerCase() === domain.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(s) || m.role.toLowerCase().includes(s));
    }
    sortedList = list.sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  setCached(cacheKey, sortedList);
  return sortedList;
}

export const getTeamMembers = getTeam;

export async function getTeamMemberById(id) {
  if (!id) return null;
  const cacheKey = `teamMember:${id}`;
  const cached = getCached(cacheKey, 60000);
  if (cached) return cached;

  let item = null;
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TEAM_MEMBER")) {
        item = await findRecordById("TEAM_MEMBER", id);
      }
    }
  } catch (err) {
    console.warn("RushDB getTeamMemberById fallback:", err.message);
  }

  if (!item) {
    const db = getFileDb();
    item = (db.team || []).find((m) => m.id === id) || null;
  }

  if (item) setCached(cacheKey, item);
  return item;
}

export async function createTeamMember(data) {
  clearDbCache("team");
  clearDbCache("teamMember:");
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
  clearDbCache("team");
  clearDbCache("teamMember:");
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
  clearDbCache("team");
  clearDbCache("teamMember:");
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
  const cacheKey = `projects:${domain || "all"}:${search || ""}:${featuredOnly ? "1" : "0"}`;
  const cached = getCached(cacheKey, 30000);
  if (cached) return cached;

  let sortedList = null;
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
        sortedList = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getProjects fallback:", err.message);
  }

  if (!sortedList) {
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
    sortedList = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  setCached(cacheKey, sortedList);
  return sortedList;
}

export async function getProjectById(id) {
  if (!id) return null;
  const cacheKey = `project:${id}`;
  const cached = getCached(cacheKey, 60000);
  if (cached) return cached;

  let item = null;
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("PROJECT")) {
        item = await findRecordById("PROJECT", id);
      }
    }
  } catch (err) {
    console.warn("RushDB getProjectById fallback:", err.message);
  }

  if (!item) {
    const db = getFileDb();
    item = (db.projects || []).find((p) => p.id === id) || null;
  }

  if (item) setCached(cacheKey, item);
  return item;
}

export async function createProject(data) {
  clearDbCache("projects");
  clearDbCache("project:");
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
  clearDbCache("projects");
  clearDbCache("project:");
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
  clearDbCache("projects");
  clearDbCache("project:");
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
  const cacheKey = `gallery:${category || "all"}:${search || ""}`;
  const cached = getCached(cacheKey, 30000);
  if (cached) return cached;

  let sortedList = null;
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
        sortedList = list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      }
    }
  } catch (err) {
    console.warn("RushDB getGallery fallback:", err.message);
  }

  if (!sortedList) {
    const db = getFileDb();
    let list = db.gallery || [];

    if (category && category !== "All") {
      list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(s) || g.caption.toLowerCase().includes(s));
    }
    sortedList = list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }

  setCached(cacheKey, sortedList);
  return sortedList;
}

export const getGalleryItems = getGallery;

export async function getGalleryById(id) {
  if (!id) return null;
  const cacheKey = `galleryItem:${id}`;
  const cached = getCached(cacheKey, 60000);
  if (cached) return cached;

  let item = null;
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("GALLERY_ITEM")) {
        item = await findRecordById("GALLERY_ITEM", id);
      }
    }
  } catch (err) {
    console.warn("RushDB getGalleryById fallback:", err.message);
  }

  if (!item) {
    const db = getFileDb();
    item = (db.gallery || []).find((g) => g.id === id) || null;
  }

  if (item) setCached(cacheKey, item);
  return item;
}

export async function createGalleryItem(data) {
  clearDbCache("gallery");
  clearDbCache("galleryItem:");
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
  clearDbCache("gallery");
  clearDbCache("galleryItem:");
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
  clearDbCache("gallery");
  clearDbCache("galleryItem:");
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
export async function getTechnexRegistrations({ search, status, membershipType, domain, department, academicYear, sortBy = "newest", paymentStatus } = {}) {
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TECHNEX_REGISTRATION")) {
        const where = {};
        if (status && status !== "All") where.status = status;
        if (membershipType && membershipType !== "All") where.membershipType = membershipType;
        if (paymentStatus && paymentStatus !== "All") where.paymentStatus = paymentStatus;
        if (domain && domain !== "All") where.domain = domain;
        if (department && department !== "All") where.leaderDepartment = department;
        if (academicYear && academicYear !== "All") where.leaderYear = academicYear;
        let list = await findRecords("TECHNEX_REGISTRATION", { where });
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (r) =>
              r.id?.toLowerCase().includes(s) ||
              r.registrationCode?.toLowerCase().includes(s) ||
              r.teamName?.toLowerCase().includes(s) ||
              r.projectTitle?.toLowerCase().includes(s) ||
              r.leaderName?.toLowerCase().includes(s) ||
              r.leaderEmail?.toLowerCase().includes(s) ||
              r.leaderPrn?.toLowerCase().includes(s) ||
              r.leaderDepartment?.toLowerCase().includes(s) ||
              r.domain?.toLowerCase().includes(s) ||
              (r.teamMembers || []).some(
                (m) =>
                  m.name?.toLowerCase().includes(s) ||
                  m.email?.toLowerCase().includes(s) ||
                  m.prn?.toLowerCase().includes(s)
              )
          );
        }
        return list.sort((a, b) =>
          sortBy === "oldest"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt)
        );
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
  if (membershipType && membershipType !== "All") {
    list = list.filter((r) => r.membershipType && r.membershipType.toLowerCase() === membershipType.toLowerCase());
  }
  if (paymentStatus && paymentStatus !== "All") {
    list = list.filter((r) => r.paymentStatus && r.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
  }
  if (domain && domain !== "All") {
    list = list.filter((r) => r.domain && r.domain.toLowerCase() === domain.toLowerCase());
  }
  if (department && department !== "All") {
    list = list.filter((r) => r.leaderDepartment && r.leaderDepartment.toLowerCase() === department.toLowerCase());
  }
  if (academicYear && academicYear !== "All") {
    list = list.filter((r) => r.leaderYear && r.leaderYear.toLowerCase() === academicYear.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.id?.toLowerCase().includes(s) ||
        r.registrationCode?.toLowerCase().includes(s) ||
        r.teamName?.toLowerCase().includes(s) ||
        r.projectTitle?.toLowerCase().includes(s) ||
        r.leaderName?.toLowerCase().includes(s) ||
        r.leaderEmail?.toLowerCase().includes(s) ||
        r.leaderPrn?.toLowerCase().includes(s) ||
        r.leaderDepartment?.toLowerCase().includes(s) ||
        r.domain?.toLowerCase().includes(s) ||
        (r.teamMembers || []).some(
          (m) =>
            m.name?.toLowerCase().includes(s) ||
            m.email?.toLowerCase().includes(s) ||
            m.prn?.toLowerCase().includes(s)
        )
    );
  }
  return list.sort((a, b) =>
    sortBy === "oldest"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function checkTechnexDuplicate({ teamName, leaderEmail, leaderPrn }) {
  let existing = [];
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("TECHNEX_REGISTRATION")) {
        existing = await findRecords("TECHNEX_REGISTRATION", { limit: 500 });
      }
    }
  } catch (err) {
    console.warn("RushDB checkTechnexDuplicate fallback:", err.message);
  }

  const db = getFileDb();
  const fileRegs = db.technexRegistrations || [];
  for (const fr of fileRegs) {
    if (!existing.some((r) => r.id === fr.id || r.registrationCode === fr.registrationCode)) {
      existing.push(fr);
    }
  }

  const cleanTeam = (teamName || "").trim().toLowerCase();
  const cleanEmail = (leaderEmail || "").trim().toLowerCase();
  const cleanPrn = (leaderPrn || "").trim().toUpperCase();

  if (cleanTeam && existing.some((r) => r.teamName?.trim().toLowerCase() === cleanTeam)) {
    return { isDuplicate: true, field: "teamName", message: `Team name "${teamName}" is already registered. Please choose a unique name.` };
  }
  if (cleanEmail && existing.some((r) => r.leaderEmail?.trim().toLowerCase() === cleanEmail)) {
    return { isDuplicate: true, field: "leaderEmail", message: "A team with this Leader Email has already been registered." };
  }
  if (cleanPrn && existing.some((r) => r.leaderPrn?.trim().toUpperCase() === cleanPrn)) {
    return { isDuplicate: true, field: "leaderPrn", message: "A team with this Leader PRN has already been registered." };
  }
  return { isDuplicate: false };
}

export async function createTechnexRegistration(data) {
  const duplicate = await checkTechnexDuplicate(data);
  if (duplicate.isDuplicate) {
    const dupErr = new Error(duplicate.message);
    dupErr.status = 409;
    dupErr.field = duplicate.field;
    throw dupErr;
  }

  // Count existing records across RushDB and local DB for sequential registration code
  let totalExisting = 0;
  try {
    if (await isRushDBConnected()) {
      const allRush = await findRecords("TECHNEX_REGISTRATION");
      totalExisting = Math.max(totalExisting, allRush.length);
    }
  } catch {}
  const db = getFileDb();
  totalExisting = Math.max(totalExisting, (db.technexRegistrations || []).length);
  const count = totalExisting + 1;
  const regCode = `TNX-2026-${String(count).padStart(3, "0")}`;
  const confirmationToken = crypto.randomBytes(24).toString("hex");

  const newReg = {
    id: `technex-${Date.now()}`,
    registrationId: regCode,
    registrationCode: regCode,
    confirmationToken,
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
    leaderDepartment: (data.leaderDepartment || "").trim(),
    leaderYear: (data.leaderYear || "").trim(),
    leaderDivision: (data.leaderDivision || "").trim(),
    teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
    utr: (data.utr || data.upiTransactionId || "").trim(),
    paymentScreenshotUrl: data.paymentScreenshotUrl || "",
    paymentScreenshotPath: data.paymentScreenshotPath || "",
    paymentScreenshotFileName: data.paymentScreenshotFileName || "",
    paymentScreenshotFileSize: Number(data.paymentScreenshotFileSize) || 0,
    paymentScreenshotMimeType: data.paymentScreenshotMimeType || "",
    paymentScreenshotUploadedAt: data.paymentScreenshotUploadedAt || new Date().toISOString(),
    paymentScreenshotMediaId: data.paymentScreenshotMediaId || null,
    registrationStatus: "Successfully Registered",
    status: data.status || "Approved",
    createdAt: new Date().toISOString(),
  };

  // 1. Store in RushDB as primary database
  let rushSaved = false;
  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      const created = await createRecord("TECHNEX_REGISTRATION", newReg);
      if (created) {
        rushSaved = true;
        if (created.__id) newReg.__id = created.__id;
      }
    }
  } catch (err) {
    console.warn("RushDB createTechnexRegistration fallback:", err.message);
  }

  // 2. Store in local persistent JSON
  let fileSaved = false;
  try {
    db.technexRegistrations = [newReg, ...(db.technexRegistrations || [])];
    saveFileDb(db);
    fileSaved = true;
  } catch (err) {
    console.error("Local JSON save error:", err);
  }

  if (!rushSaved && !fileSaved) {
    throw new Error("Failed to save registration record in database. Please try again.");
  }

  // Cache in memory for instant retrieval and zero-latency confirmation
  setCached(`technexReg:${regCode}`, newReg);
  setCached(`technexReg:${newReg.id}`, newReg);
  if (newReg.registrationId) setCached(`technexReg:${newReg.registrationId}`, newReg);
  if (newReg.__id) setCached(`technexReg:${newReg.__id}`, newReg);
  clearDbCache("technexRegistrations");

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
  if (!id) return false;
  const idStr = String(id).trim();
  clearDbCache();

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      const deleted = await deleteRecord("TECHNEX_REGISTRATION", idStr);
      if (!deleted) {
        const recs = await findRecords("TECHNEX_REGISTRATION");
        const match = (recs || []).find(
          (r) =>
            r.id === idStr ||
            r.registrationCode === idStr ||
            r.registrationId === idStr ||
            r.id?.toLowerCase() === idStr.toLowerCase() ||
            r.registrationCode?.toLowerCase() === idStr.toLowerCase() ||
            r.registrationId?.toLowerCase() === idStr.toLowerCase()
        );
        if (match && match.id) {
          await deleteRecord("TECHNEX_REGISTRATION", match.id);
        }
      }
    }
  } catch (err) {
    console.warn("RushDB deleteTechnexRegistration fallback:", err.message);
  }

  const db = getFileDb();
  const initialLen = (db.technexRegistrations || []).length;
  db.technexRegistrations = (db.technexRegistrations || []).filter(
    (r) =>
      r.id !== idStr &&
      r.registrationCode !== idStr &&
      r.registrationId !== idStr &&
      r.id?.toLowerCase() !== idStr.toLowerCase() &&
      r.registrationCode?.toLowerCase() !== idStr.toLowerCase() &&
      r.registrationId?.toLowerCase() !== idStr.toLowerCase()
  );
  saveFileDb(db);
  clearDbCache();
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
  if (!id) return null;
  const cacheKey = `media:${id}`;
  const cached = getCached(cacheKey, 60000);
  if (cached) return cached;

  let item = null;
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("MEDIA_ITEM")) {
        item = await findRecordById("MEDIA_ITEM", id);
      }
    }
  } catch (err) {
    console.warn("RushDB getMediaItemById fallback:", err.message);
  }

  if (!item) {
    const db = getFileDb();
    item = (db.mediaItems || []).find((m) => m.id === id) || null;
  }

  if (item) setCached(cacheKey, item);
  return item;
}

export async function createMediaItem(data) {
  clearDbCache("media");
  clearDbCache("technexConfig");
  const newItem = {
    id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: data.title || data.fileName || "Uploaded Asset",
    fileName: data.fileName || "asset",
    category: data.category || "event-poster",
    folder: data.folder || "S4DS",
    storagePath: data.storagePath || data.publicId,
    publicId: data.publicId || data.storagePath,
    fileUrl: data.fileUrl || data.secureUrl,
    secureUrl: data.secureUrl || data.fileUrl,
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
  clearDbCache("media");
  clearDbCache("technexConfig");
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
  clearDbCache("media");
  clearDbCache("technexConfig");
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
// WEBSITE SETTINGS (TECHNEX & Chapter Settings)
// ─────────────────────────────────────────────
export function getDefaultSettings() {
  return {
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
      values: [
        {
          title: "Hands-on Technical Rigor",
          desc: "Moving beyond basic theory into production-ready deep learning, MLOps, LLMs, and enterprise distributed computing.",
        },
        {
          title: "Inclusive Student Community",
          desc: "Creating an open peer ecosystem where First Year students collaborate alongside final-year researchers and industry mentors.",
        },
        {
          title: "Applied Research & Publishing",
          desc: "Guiding students to write, review, and present technical research papers at national and international conferences.",
        },
        {
          title: "Industry & Ecosystem Alignment",
          desc: "Partnering with tech enterprises to host project expos, real-world case study hackathons, and placement masterclasses.",
        },
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
      upiId: process.env.NEXT_PUBLIC_UPI_ID || "9172106568@airtel",
      upiPayeeName: "S4DS MITAOE",
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

    membership: {
      intakeBadge: "Cohort Admissions",
      intakeTitle: "Join Society for Data Science, MITAOE",
      intakeSchedule: "Intake Starts February 2027",
      intakeDescription:
        "Official enrollment for the S4DS MITAOE Student Chapter cohort will officially launch in February 2027. Explore membership privileges, eligibility guidelines, and upcoming term roadmap below.",
      status: "Scheduled",
      timeline: [
        { label: "Registration Portal Launch", date: "February 2027" },
        { label: "Chapter Orientation & Induction", date: "February 2027 (MITAOE Auditorium)" },
        { label: "Member Kit & Certificate Allocation", date: "February 2027" },
        { label: "Active Chapter Term", date: "Academic Year 2027" },
      ],
      benefits: [
        "Official S4DS National Student Member Certificate & Membership Kit",
        "Priority access & discounted entry to TECHNEX 2K26 Project Expo",
        "Closed-door masterclasses in Generative AI, LLMs, Computer Vision & MLOps",
        "Direct eligibility to join chapter technical committees & project teams",
        "Exclusive placement prep bootcamps, resume reviews & industry referrals",
      ],
      eligibility: [
        "Open to all enrolled students of MIT Academy of Engineering (MITAOE), Alandi.",
        "Students across all engineering departments (Data Science, AI, Computer, IT, ENTC, Mechanical, Chemical, Civil).",
        "First Year, Second Year, Third Year, and Final Year B.Tech students are eligible.",
        "Passionate about Data Science, Machine Learning, Web Innovation, and Technical Leadership.",
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
}

function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export async function getSettings() {
  const cached = getCached("settings", 30000);
  if (cached) return cached;

  const defaultSettings = getDefaultSettings();
  let result = null;

  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog.labels.has("SETTING")) {
        const list = await findRecords("SETTING", { limit: 1 });
        if (list && list.length > 0) {
          result = deepMerge(defaultSettings, list[0]);
        }
      }
    }
  } catch (err) {
    console.warn("RushDB getSettings fallback:", err.message);
  }

  if (!result) {
    const db = getFileDb();
    result = deepMerge(defaultSettings, db.settings || {});
  }

  setCached("settings", result);
  return result;
}

export async function updateSettings(updates) {
  clearDbCache("settings");
  clearDbCache("technexConfig");

  const current = await getSettings();
  const merged = deepMerge(current, updates);

  try {
    if (await isRushDBConnected()) {
      await getSchemaCatalog();
      const list = await findRecords("SETTING", { limit: 1 });
      if (list && list.length > 0) {
        await updateRecord("SETTING", list[0].id, merged);
      } else {
        await createRecord("SETTING", { id: "site-settings", ...merged });
      }
    }
  } catch (err) {
    console.warn("RushDB updateSettings fallback:", err.message);
  }

  const db = getFileDb();
  db.settings = merged;
  saveFileDb(db);
  setCached("settings", merged);
  return merged;
}

export async function getTechnexConfig() {
  const cached = getCached("technexConfig", 30000);
  if (cached) return cached;

  const settings = await getSettings();
  const technex = { ...settings.technex };

  // Resolve dynamic Payment QR reference from MEDIA_ITEM if configured
  if (technex.activePaymentQrId || settings.activePaymentQrId) {
    const qrId = technex.activePaymentQrId || settings.activePaymentQrId;
    const qrMedia = await getMediaItemById(qrId);
    if (qrMedia && qrMedia.fileUrl) {
      technex.activePaymentQrUrl = qrMedia.fileUrl;
      technex.activePaymentQrId = qrMedia.id;
    }
  }

  if (!technex.activePaymentQrUrl) {
    const activeMedia = await getActiveMediaItem("payment-qr");
    if (activeMedia && activeMedia.fileUrl) {
      technex.activePaymentQrUrl = activeMedia.fileUrl;
      technex.activePaymentQrId = activeMedia.id;
    }
  }

  // Resolve dynamic Event Poster reference from MEDIA_ITEM if configured
  if (technex.posterMediaId) {
    const posterMedia = await getMediaItemById(technex.posterMediaId);
    if (posterMedia && posterMedia.fileUrl) {
      technex.posterUrl = posterMedia.fileUrl;
    }
  }

  // Sync WhatsApp configuration
  if (settings.technexWhatsappUrl) {
    technex.whatsappUrl = settings.technexWhatsappUrl;
    technex.whatsappEnabled = settings.technexWhatsappEnabled !== false;
  }

  // Ensure dynamic UPI payment parameters
  technex.upiId = technex.upiId || settings.upiId || process.env.NEXT_PUBLIC_UPI_ID || "9172106568@airtel";
  technex.upiPayeeName = technex.upiPayeeName || settings.upiPayeeName || "S4DS MITAOE";

  setCached("technexConfig", technex);
  return technex;
}

export async function updateTechnexConfig(updates) {
  clearDbCache("settings");
  clearDbCache("technexConfig");
  const currentSettings = await getSettings();
  const mergedTechnex = deepMerge(currentSettings.technex, updates);

  // Sync top-level settings fields if technex updates them
  const topLevelUpdates = {
    technex: mergedTechnex,
  };

  if (updates.upiId) {
    topLevelUpdates.upiId = updates.upiId;
  }
  if (updates.upiPayeeName) {
    topLevelUpdates.upiPayeeName = updates.upiPayeeName;
  }

  if (updates.whatsappUrl) {
    topLevelUpdates.technexWhatsappUrl = updates.whatsappUrl;
  }
  if (updates.whatsappEnabled !== undefined) {
    topLevelUpdates.technexWhatsappEnabled = Boolean(updates.whatsappEnabled);
  }
  if (updates.activePaymentQrId) {
    topLevelUpdates.activePaymentQrId = updates.activePaymentQrId;
  }

  await updateSettings(topLevelUpdates);
  return getTechnexConfig();
}

export async function getTechnexRegistrationById(id) {
  if (!id) return null;

  const idStr = String(id).trim();

  // 0. Check high-speed in-memory cache first
  const memCached = getCached(`technexReg:${idStr}`);
  if (memCached) {
    return formatTechnexConfirmation(memCached);
  }

  let reg = null;

  // 1. Try RushDB lookup with multi-level resilient search
  try {
    if (await isRushDBConnected()) {
      const catalog = await getSchemaCatalog();
      if (catalog && catalog.labels && catalog.labels.has("TECHNEX_REGISTRATION")) {
        // 1a. Try finding by ID directly
        try {
          reg = await findRecordById("TECHNEX_REGISTRATION", idStr);
        } catch (e) {
          // ignore error and proceed
        }

        // 1b. Try finding by registrationCode in RushDB
        if (!reg) {
          try {
            const byCode = await findRecords("TECHNEX_REGISTRATION", {
              where: { registrationCode: { $eq: idStr } },
              limit: 1,
            });
            if (byCode && byCode.length > 0) {
              reg = byCode[0];
            }
          } catch (e) {
            // ignore error and proceed
          }
        }

        // 1c. Try finding by registrationId in RushDB
        if (!reg) {
          try {
            const byRegId = await findRecords("TECHNEX_REGISTRATION", {
              where: { registrationId: { $eq: idStr } },
              limit: 1,
            });
            if (byRegId && byRegId.length > 0) {
              reg = byRegId[0];
            }
          } catch (e) {
            // ignore error and proceed
          }
        }

        // 1d. Fallback scan across RushDB records for case-insensitive match
        if (!reg) {
          try {
            const all = await findRecords("TECHNEX_REGISTRATION", { limit: 250 });
            reg = all.find(
              (r) =>
                r.id === idStr ||
                r.registrationCode === idStr ||
                r.registrationId === idStr ||
                r.__id === idStr ||
                r.id?.toLowerCase() === idStr.toLowerCase() ||
                r.registrationCode?.toLowerCase() === idStr.toLowerCase() ||
                r.registrationId?.toLowerCase() === idStr.toLowerCase()
            ) || null;
          } catch (e) {
            // ignore error and proceed
          }
        }
      }
    }
  } catch (err) {
    console.warn("RushDB getTechnexRegistrationById notice:", err.message);
  }

  // 2. Fallback to local persistent JSON file
  if (!reg) {
    try {
      const db = getFileDb();
      reg = (db.technexRegistrations || []).find(
        (r) =>
          r.id === idStr ||
          r.registrationCode === idStr ||
          r.registrationId === idStr ||
          r.__id === idStr ||
          r.id?.toLowerCase() === idStr.toLowerCase() ||
          r.registrationCode?.toLowerCase() === idStr.toLowerCase() ||
          r.registrationId?.toLowerCase() === idStr.toLowerCase()
      ) || null;
    } catch (err) {
      console.error("Local JSON read error:", err);
    }
  }

  if (!reg) return null;

  // Cache in memory for subsequent immediate reads
  setCached(`technexReg:${idStr}`, reg, 600000); // 10 minutes TTL
  if (reg.registrationCode) setCached(`technexReg:${reg.registrationCode}`, reg, 600000);
  if (reg.registrationId) setCached(`technexReg:${reg.registrationId}`, reg, 600000);
  if (reg.id) setCached(`technexReg:${reg.id}`, reg, 600000);

  return formatTechnexConfirmation(reg);
}

async function formatTechnexConfirmation(reg) {
  if (!reg) return null;

  // Fetch settings & technex config dynamically
  const settings = await getSettings();
  const technex = await getTechnexConfig();

  const finalCode = reg.registrationCode || reg.registrationId || reg.id;

  return {
    id: reg.id || reg.__id || finalCode,
    registrationId: finalCode,
    registrationCode: finalCode,
    teamName: reg.teamName,
    projectTitle: reg.projectTitle,
    domain: reg.domain,
    abstractSummary: reg.abstractSummary || "",
    githubOrDriveUrl: reg.githubOrDriveUrl || "",
    leaderName: reg.leaderName,
    leaderEmail: reg.leaderEmail,
    leaderPhone: reg.leaderPhone,
    leaderCollege: reg.leaderCollege,
    leaderPrn: reg.leaderPrn,
    leaderDepartment: reg.leaderDepartment || "",
    leaderYear: reg.leaderYear || "",
    leaderDivision: reg.leaderDivision || "",
    membershipType: reg.membershipType,
    registrationFee: reg.registrationFee,
    registrationStatus: "Successfully Registered",
    status: reg.status || "Approved",
    teamMembers: reg.teamMembers || [],
    utr: reg.utr || "",
    paymentScreenshotUrl: reg.paymentScreenshotUrl || "",
    paymentScreenshotPath: reg.paymentScreenshotPath || "",
    paymentScreenshotFileName: reg.paymentScreenshotFileName || "",
    paymentScreenshotFileSize: reg.paymentScreenshotFileSize || 0,
    paymentScreenshotMimeType: reg.paymentScreenshotMimeType || "",
    paymentScreenshotUploadedAt: reg.paymentScreenshotUploadedAt || reg.createdAt,
    createdAt: reg.createdAt,
    eventTitle: technex.title || "TECHNEX 2K26 – THE PROJECT EXPO",
    eventDate: technex.date || "Nov 21, 2026",
    eventVenue: technex.venue || "MITAOE Campus, Alandi, Pune",
    whatsappUrl: technex.whatsappUrl || settings.technexWhatsappUrl || process.env.NEXT_PUBLIC_TECHNEX_WHATSAPP_URL || "https://chat.whatsapp.com/KFYW22NYGasBag1RZjnKJl",
    whatsappEnabled: technex.whatsappEnabled !== false && settings.technexWhatsappEnabled !== false,
  };
}

export async function getTechnexRegistrationByConfirmation(id, token) {
  return getTechnexRegistrationById(id);
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
