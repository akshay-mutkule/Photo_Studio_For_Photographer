import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Gallery, Booking, PortfolioImage, ClientActivity, DashboardStats } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser limits increased to allow Base64 image uploads (Drag-and-Drop)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Helper to ensure database file exists
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialPortfolio: PortfolioImage[] = [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        category: "Weddings",
        title: "Ethereal Canopy Altar",
        tags: ["wedding", "altar", "outdoor", "flowers", "ceremony", "nature", "elegant"]
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
        category: "Weddings",
        title: "Eternal Promise",
        tags: ["wedding", "hands", "rings", "couple", "holding hands", "love", "close-up"]
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        category: "Pre-Wedding",
        title: "Joyous Laughs",
        tags: ["pre-wedding", "couple", "laughing", "garden", "happy", "candid", "dress"]
      },
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
        category: "Engagement",
        title: "Golden Hour Embrace",
        tags: ["engagement", "sunset", "embrace", "golden hour", "couple", "romance", "field"]
      },
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
        category: "Portraits",
        title: "Sienna",
        tags: ["portrait", "woman", "model", "editorial", "studio", "fashion", "eyes"]
      },
      {
        id: "p6",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
        category: "Portraits",
        title: "Marcus",
        tags: ["portrait", "man", "headshot", "candid", "smile", "warm", "outdoor"]
      },
      {
        id: "p7",
        url: "https://images.unsplash.com/photo-1510972527409-cef5e0be306b?auto=format&fit=crop&w=1200&q=80",
        category: "Family",
        title: "Beachside Sunset Run",
        tags: ["family", "beach", "sunset", "kids", "running", "fun", "silhouette"]
      },
      {
        id: "p8",
        url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1200&q=80",
        category: "Maternity",
        title: "Beginning of Life",
        tags: ["maternity", "belly", "pregnant", "couple", "hands", "motherhood", "close-up"]
      },
      {
        id: "p9",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        category: "Fashion",
        title: "Retro Parisian Vibe",
        tags: ["fashion", "woman", "street style", "urban", "vintage", "sunglasses", "model"]
      },
      {
        id: "p10",
        url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
        category: "Wildlife",
        title: "Misty Buck",
        tags: ["wildlife", "deer", "forest", "fog", "woods", "nature", "animal", "majestic"]
      },
      {
        id: "p11",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        category: "Commercial",
        title: "Acoustic Beats Studio",
        tags: ["commercial", "product", "headphones", "sound", "music", "studio", "advertising"]
      },
      {
        id: "p12",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        category: "Commercial",
        title: "Velocity Crimson Sneaker",
        tags: ["commercial", "product", "shoe", "sneaker", "red", "advertising", "sportswear"]
      }
    ];

    const initialGalleries: Gallery[] = [
      {
        id: "gal-sophie-luke",
        title: "Sophie & Luke's Autumn Wedding",
        description: "A gorgeous autumnal celebration captured at the Oakridge Estate. Complete session for review.",
        date: "2026-05-15",
        passcode: "autumn2026",
        clientName: "Sophie Jennings",
        clientEmail: "sophie@example.com",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        images: [
          {
            id: "img1",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            tags: ["altar", "flowers", "ceremony"],
            originalName: "DSC_0102.jpg"
          },
          {
            id: "img2",
            url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
            tags: ["hands", "rings", "couple"],
            originalName: "DSC_0156.jpg"
          },
          {
            id: "img3",
            url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            tags: ["couple", "laughing", "candid"],
            originalName: "DSC_0210.jpg"
          },
          {
            id: "img4",
            url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
            tags: ["hug", "sunset", "outdoor"],
            originalName: "DSC_0284.jpg"
          }
        ],
        favorites: ["img2"],
        selected: ["img2", "img3"],
        selectionSubmitted: false,
        allowDownload: true,
        downloadApproved: false,
        views: 24,
        createdAt: new Date().toISOString(),
        expirationDate: "2026-09-01"
      }
    ];

    const initialBookings: Booking[] = [
      {
        id: "bk1",
        clientName: "Jane Doe",
        clientEmail: "jane.doe@example.com",
        clientPhone: "+1 (555) 234-5678",
        date: "2026-07-25",
        location: "Hillside Temple Heritage",
        sessionType: "Festive & Family Portrait",
        notes: "Looking for an elegant outdoor sunset portrait session with warm tones.",
        status: "confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "bk2",
        clientName: "Robert Miller",
        clientEmail: "robert.miller@example.com",
        clientPhone: "+1 (555) 345-6789",
        date: "2026-08-12",
        location: "The Royal Marquee Hall",
        sessionType: "Traditional Wedding Ceremony",
        notes: "Full day coverage, from bridal prep to exit.",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ];

    const initialActivities: ClientActivity[] = [
      {
        id: "act1",
        galleryId: "gal-sophie-luke",
        galleryTitle: "Sophie & Luke's Autumn Wedding",
        clientName: "Sophie Jennings",
        action: "viewed",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: "Accessed client proofing gallery with passcode."
      },
      {
        id: "act2",
        galleryId: "gal-sophie-luke",
        galleryTitle: "Sophie & Luke's Autumn Wedding",
        clientName: "Sophie Jennings",
        action: "favorited",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        details: "Added Eternal Promise (DSC_0156.jpg) to favorites."
      }
    ];

    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          portfolio: initialPortfolio,
          galleries: initialGalleries,
          bookings: initialBookings,
          activities: initialActivities
        },
        null,
        2
      )
    );
  }
}

initDb();

// Read and Write Helpers
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed.profiles) {
      parsed.profiles = [];
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database", error);
    return { portfolio: [], galleries: [], bookings: [], activities: [], profiles: [] };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database", error);
  }
}

// Log Client Activity Helper
function logActivity(galleryId: string, galleryTitle: string, clientName: string, action: ClientActivity['action'], details: string) {
  const db = readDb();
  const newActivity: ClientActivity = {
    id: "act-" + Math.random().toString(36).substr(2, 9),
    galleryId,
    galleryTitle,
    clientName,
    action,
    timestamp: new Date().toISOString(),
    details
  };
  db.activities = [newActivity, ...db.activities];
  writeDb(db);
}

// Shared Gemini Setup
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// ================= API ENDPOINTS =================

// 1. Portfolio Routes
app.get("/api/portfolio", (req, res) => {
  const db = readDb();
  res.json(db.portfolio || []);
});

// Admin add portfolio image
app.post("/api/portfolio", (req, res) => {
  const { url, category, title, tags } = req.body;
  if (!url || !category || !title) {
    return res.status(400).json({ error: "Missing required fields for portfolio image" });
  }

  const db = readDb();
  const newImage: PortfolioImage = {
    id: "p-" + Math.random().toString(36).substr(2, 9),
    url,
    category,
    title,
    tags: tags || []
  };

  db.portfolio.push(newImage);
  writeDb(db);
  res.status(201).json(newImage);
});

// 2. Booking Routes
app.get("/api/bookings", (req, res) => {
  const db = readDb();
  res.json(db.bookings || []);
});

app.post("/api/bookings", (req, res) => {
  const { clientName, clientEmail, clientPhone, date, location, sessionType, notes } = req.body;
  if (!clientName || !clientEmail || !date || !sessionType) {
    return res.status(400).json({ error: "Missing required fields for booking request" });
  }

  const db = readDb();
  db.bookings = db.bookings || [];
  db.profiles = db.profiles || [];

  const newBooking: Booking = {
    id: "bk-" + Math.random().toString(36).substr(2, 9),
    clientName,
    clientEmail,
    clientPhone: clientPhone || "",
    date,
    location: location || "Studio Session",
    sessionType,
    notes: notes || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);

  // Profile Generation & Notification creation
  let profile = db.profiles.find(
    (p: any) => p.clientEmail.toLowerCase() === clientEmail.toLowerCase()
  );

  let isNewProfile = false;
  let passcode = "";

  if (!profile) {
    isNewProfile = true;
    passcode = "VS-" + Math.floor(1000 + Math.random() * 9000);
    profile = {
      id: "prof-" + Math.random().toString(36).substr(2, 9),
      clientName,
      clientEmail,
      clientPhone: clientPhone || "",
      passcode,
      createdAt: new Date().toISOString(),
      notifications: [
        {
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          title: "Welcome to VS Photography! 📸",
          message: `Your client profile has been created successfully. Use your passcode "${passcode}" with your email "${clientEmail}" to log into the Client Portal, where you can view booking statuses, read messages, and access your photo shoots.`,
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "notif-" + Math.random().toString(36).substr(2, 9),
          title: "Photoshoot Booking Received ⏳",
          message: `Your booking request for a ${sessionType} photoshoot on ${date} at ${location || "Studio"} has been received and is currently pending photographer approval. We'll update you here as soon as it is approved!`,
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
    db.profiles.push(profile);
  } else {
    passcode = profile.passcode;
    profile.notifications.unshift({
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      title: "New Photoshoot Booking Requested ⏳",
      message: `Your new booking request for a ${sessionType} session on ${date} has been received. Our team will review the details and update your booking status shortly.`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDb(db);
  res.status(201).json({
    booking: newBooking,
    profilePasscode: passcode,
    isNewProfile
  });
});

// Admin update booking status
app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "confirmed", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid booking status value" });
  }

  const db = readDb();
  db.bookings = db.bookings || [];
  db.profiles = db.profiles || [];

  const index = db.bookings.findIndex((b: Booking) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const oldStatus = db.bookings[index].status;
  db.bookings[index].status = status;

  // Add notification to client profile if status changed
  if (oldStatus !== status) {
    const clientEmail = db.bookings[index].clientEmail;
    const profile = db.profiles.find(
      (p: any) => p.clientEmail.toLowerCase() === clientEmail.toLowerCase()
    );

    if (profile) {
      let title = "Booking Status Updated 📅";
      let message = `Your photoshoot booking request status has been updated to: ${status}.`;

      if (status === "confirmed") {
        title = "Photoshoot Approved! 🎉";
        message = `Good news! Your photoshoot booking for a ${db.bookings[index].sessionType} session on ${db.bookings[index].date} has been approved by VS Photography. We are looking forward to capturing your beautiful moments!`;
      } else if (status === "declined") {
        title = "Photoshoot Update 📅";
        message = `Your photoshoot booking request for a ${db.bookings[index].sessionType} session on ${db.bookings[index].date} could not be confirmed at this time. Please get in touch with us to reschedule or select a different date.`;
      }

      profile.notifications.unshift({
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        title,
        message,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  writeDb(db);
  res.json(db.bookings[index]);
});

// 3. Client Gallery & Portal Authorization
app.post("/api/client/gallery-auth", (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ error: "Passcode is required" });
  }

  const db = readDb();
  // Find gallery matching passcode (case insensitive)
  const gallery = db.galleries.find(
    (g: Gallery) => g.passcode.toLowerCase() === passcode.toLowerCase()
  );

  if (!gallery) {
    return res.status(401).json({ error: "Invalid gallery passcode. Please try again." });
  }

  // Increment view counter and log view
  gallery.views = (gallery.views || 0) + 1;
  writeDb(db);

  logActivity(
    gallery.id,
    gallery.title,
    gallery.clientName,
    "viewed",
    `Authenticated using passcode and viewed the gallery.`
  );

  // Return gallery, safe to exclude passcode if requested but we can keep client experience smooth
  res.json(gallery);
});

// Get a specific gallery by ID directly for sharing link workflow (with password challenge)
app.get("/api/client/gallery/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const gallery = db.galleries.find((g: Gallery) => g.id === id);

  if (!gallery) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  // Only return partial meta (or full gallery if there's no passcode, but we should prompt for passcode)
  // If passcode is empty, we can return it directly, else just require pass verification
  if (!gallery.passcode) {
    gallery.views = (gallery.views || 0) + 1;
    writeDb(db);
    return res.json({ requiresPasscode: false, gallery });
  }

  res.json({ requiresPasscode: true, title: gallery.title, coverImage: gallery.coverImage });
});

// Save client selections/favorites
app.post("/api/client/gallery-action", (req, res) => {
  const { galleryId, favorites, selected, submitSelection } = req.body;
  if (!galleryId) {
    return res.status(400).json({ error: "Gallery ID is required" });
  }

  const db = readDb();
  const index = db.galleries.findIndex((g: Gallery) => g.id === galleryId);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  const gallery = db.galleries[index];

  // Detect and log delta favorites
  if (favorites && Array.isArray(favorites)) {
    const oldFavs = gallery.favorites || [];
    const added = favorites.filter((f) => !oldFavs.includes(f));
    if (added.length > 0) {
      logActivity(
        gallery.id,
        gallery.title,
        gallery.clientName,
        "favorited",
        `Favorited ${added.length} photo(s).`
      );
    }
    gallery.favorites = favorites;
  }

  // Detect and log delta selections
  if (selected && Array.isArray(selected)) {
    const oldSel = gallery.selected || [];
    const added = selected.filter((s) => !oldSel.includes(s));
    if (added.length > 0) {
      logActivity(
        gallery.id,
        gallery.title,
        gallery.clientName,
        "selected",
        `Marked ${added.length} photo(s) for final submission.`
      );
    }
    gallery.selected = selected;
  }

  if (submitSelection) {
    gallery.selectionSubmitted = true;
    gallery.selectionSubmittedAt = new Date().toISOString();
    gallery.retouchStatus = 'pending';
    logActivity(
      gallery.id,
      gallery.title,
      gallery.clientName,
      "submitted",
      `Finalized photo selection. Approved ${gallery.selected.length} image(s) for final editing.`
    );
  }

  writeDb(db);
  res.json(gallery);
});

// Client Profile Authentication & Fetch Data
app.post("/api/client/profile-auth", (req, res) => {
  const { email, passcode } = req.body;
  if (!email || !passcode) {
    return res.status(400).json({ error: "Both Client Email and Profile Passcode are required." });
  }

  const db = readDb();
  db.profiles = db.profiles || [];

  const profile = db.profiles.find(
    (p: any) => p.clientEmail.toLowerCase() === email.toLowerCase().trim() && p.passcode.toLowerCase() === passcode.toLowerCase().trim()
  );

  if (!profile) {
    return res.status(401).json({ error: "Invalid Email or Profile Passcode. Please check and try again." });
  }

  // Find all bookings and galleries linked to this client's email
  const bookings = (db.bookings || []).filter(
    (b: any) => b.clientEmail.toLowerCase() === email.toLowerCase().trim()
  );

  const galleries = (db.galleries || []).filter(
    (g: any) => g.clientEmail.toLowerCase() === email.toLowerCase().trim()
  );

  res.json({
    profile,
    bookings,
    galleries
  });
});

// Mark Client Notification as Read
app.post("/api/client/notifications/read", (req, res) => {
  const { email, passcode, notificationId } = req.body;
  if (!email || !passcode || !notificationId) {
    return res.status(400).json({ error: "Auth info and Notification ID are required." });
  }

  const db = readDb();
  db.profiles = db.profiles || [];

  const profileIndex = db.profiles.findIndex(
    (p: any) => p.clientEmail.toLowerCase() === email.toLowerCase().trim() && p.passcode.toLowerCase() === passcode.toLowerCase().trim()
  );

  if (profileIndex === -1) {
    return res.status(401).json({ error: "Unauthorized access to profile notifications." });
  }

  const notifIndex = db.profiles[profileIndex].notifications.findIndex(
    (n: any) => n.id === notificationId
  );

  if (notifIndex !== -1) {
    db.profiles[profileIndex].notifications[notifIndex].read = true;
  }

  writeDb(db);
  res.json({ success: true, profile: db.profiles[profileIndex] });
});

// 4. Admin Gallery Management Routes
app.get("/api/admin/galleries", (req, res) => {
  const db = readDb();
  res.json(db.galleries || []);
});

app.post("/api/admin/galleries", (req, res) => {
  const { title, description, date, passcode, clientName, clientEmail, coverImage, images, allowDownload, expirationDate } = req.body;
  if (!title || !clientName || !clientEmail) {
    return res.status(400).json({ error: "Title, Client Name, and Client Email are required." });
  }

  const db = readDb();
  db.profiles = db.profiles || [];
  
  const actualPasscode = passcode || Math.random().toString(36).substr(2, 6);

  const newGallery: Gallery = {
    id: "gal-" + Math.random().toString(36).substr(2, 9),
    title,
    description: description || "",
    date: date || new Date().toISOString().split("T")[0],
    passcode: actualPasscode,
    clientName,
    clientEmail,
    coverImage: coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    images: images || [],
    favorites: [],
    selected: [],
    selectionSubmitted: false,
    allowDownload: allowDownload !== undefined ? allowDownload : true,
    downloadApproved: false,
    views: 0,
    createdAt: new Date().toISOString(),
    expirationDate: expirationDate || undefined
  };

  db.galleries.unshift(newGallery);

  // Link or auto-create client profile & send notification
  let profile = db.profiles.find(
    (p: any) => p.clientEmail.toLowerCase() === clientEmail.toLowerCase()
  );

  if (!profile) {
    const generatedPasscode = "VS-" + Math.floor(1000 + Math.random() * 9000);
    profile = {
      id: "prof-" + Math.random().toString(36).substr(2, 9),
      clientName,
      clientEmail,
      clientPhone: "",
      passcode: generatedPasscode,
      createdAt: new Date().toISOString(),
      notifications: []
    };
    db.profiles.push(profile);
  }

  profile.notifications.unshift({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    title: "New Photo Shoot Published! 📸",
    message: `Your proofing gallery "${title}" is ready for selection! Log in to view the photos and mark your favorites. Use passcode "${actualPasscode}" to open it directly.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDb(db);
  res.status(201).json(newGallery);
});

// Admin toggle download approval
app.patch("/api/admin/galleries/:id/downloads", (req, res) => {
  const { id } = req.params;
  const { downloadApproved } = req.body;

  const db = readDb();
  const index = db.galleries.findIndex((g: Gallery) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  db.galleries[index].downloadApproved = downloadApproved;
  writeDb(db);
  res.json(db.galleries[index]);
});

// Admin update gallery retouch status
app.patch("/api/admin/galleries/:id/retouch-status", (req, res) => {
  const { id } = req.params;
  const { retouchStatus } = req.body;

  const db = readDb();
  const index = db.galleries.findIndex((g: Gallery) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  db.galleries[index].retouchStatus = retouchStatus;
  writeDb(db);
  res.json(db.galleries[index]);
});

// Delete a gallery
app.delete("/api/admin/galleries/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.galleries.findIndex((g: Gallery) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  db.galleries.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: "Gallery deleted successfully" });
});

// GET Client Activities Logs (for photographer dashboard)
app.get("/api/activities", (req, res) => {
  const db = readDb();
  res.json(db.activities || []);
});

// GET Dashboard Quick Stats (Admin)
app.get("/api/admin/stats", (req, res) => {
  const db = readDb();
  const galleries = db.galleries || [];
  const bookings = db.bookings || [];
  const activities = db.activities || [];

  const totalGalleries = galleries.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b: Booking) => b.status === "pending").length;
  const totalViews = galleries.reduce((acc: number, g: Gallery) => acc + (g.views || 0), 0);
  const totalSelectionsSubmitted = galleries.filter((g: Gallery) => g.selectionSubmitted).length;

  const stats: DashboardStats = {
    totalGalleries,
    totalBookings,
    pendingBookings,
    totalViews,
    totalSelectionsSubmitted
  };

  res.json(stats);
});

// ================= GEMINI POWERED FEATURES =================

// Real Server-Side Gemini tag generator & intelligent search matching
app.post("/api/gemini/ai-search", async (req, res) => {
  const { query, type } = req.body; // type can be 'portfolio' or 'gallery'
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const db = readDb();
    const itemsToSearch = type === "gallery" ? db.galleries : db.portfolio;

    // Guard if Gemini API isn't set up yet
    if (!ai) {
      // Fallback search matching substrings in tags, category, title, or description
      const keyword = query.toLowerCase();
      let matchedItems = [];

      if (type === "gallery") {
        matchedItems = db.galleries.filter((g: Gallery) => 
          g.title.toLowerCase().includes(keyword) || 
          g.description.toLowerCase().includes(keyword) ||
          g.clientName.toLowerCase().includes(keyword)
        );
      } else {
        matchedItems = db.portfolio.filter((p: PortfolioImage) => 
          p.title.toLowerCase().includes(keyword) || 
          p.category.toLowerCase().includes(keyword) || 
          p.tags.some(t => t.toLowerCase().includes(keyword))
        );
      }
      return res.json({ matches: matchedItems, isAIPowered: false });
    }

    // AI Grounded Search using Gemini 3.5 Flash!
    // We send the list of candidate items (excluding large base64 URLs if any to save tokens)
    const candidates = itemsToSearch.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category || "",
      description: item.description || "",
      tags: item.tags || []
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an AI-powered image search engine for VS Photography studio.
Analyze this user query: "${query}"
Select which of the following image items match this query conceptually or literally. Return a JSON list of matched IDs ONLY, ranked in order of relevance.

Candidates list:
${JSON.stringify(candidates, null, 2)}

Return a JSON array of strings containing the matched IDs. Example output: ["p1", "p4"]. Do not wrap in markdown or anything else besides the raw JSON array.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    let matchedIds: string[] = [];
    try {
      const text = response.text?.trim() || "[]";
      matchedIds = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON output, raw text: ", response.text);
      matchedIds = [];
    }

    const matchedItems = itemsToSearch.filter((item: any) => matchedIds.includes(item.id));
    res.json({ matches: matchedItems, isAIPowered: true });

  } catch (err: any) {
    console.error("Gemini AI Search error: ", err);
    res.status(500).json({ error: "AI search failed, falling back to manual search." });
  }
});

// Admin endpoint to automatically tag a new photoshoot image using Gemini 3.5 Vision!
app.post("/api/gemini/tag-image", async (req, res) => {
  const { imageUrl, base64Data, prompt } = req.body;
  if (!imageUrl && !base64Data) {
    return res.status(400).json({ error: "Image URL or Base64 data is required to tag" });
  }

  if (!ai) {
    // Return dummy intelligent-looking tags if Gemini API Key isn't provided yet
    const defaults = ["photography", "fine-art", "ambient-lighting", "cinematic", "vs-photography"];
    return res.json({ tags: defaults, isAIPowered: false });
  }

  try {
    let contents: any;
    
    if (base64Data) {
      // Clean up base64 header if present
      const cleanBase = base64Data.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase
            }
          },
          {
            text: "Generate 5-8 descriptive SEO tags for this photography image. Focus on visual components, color palettes, lighting mood, and atmosphere. Return a JSON array of strings containing the tags only. Format: [\"sunset\", \"romantic\", \"warm-lighting\"]."
          }
        ]
      };
    } else {
      // If direct URL is provided
      contents = `Generate 5-8 descriptive SEO tags for this photography image url: "${imageUrl}". Focus on lighting, mood, color scheme, and visual objects. Return a JSON array of strings containing the tags only. Format: ["sunset", "romantic", "warm-lighting"].`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    let tags: string[] = [];
    try {
      tags = JSON.parse(response.text?.trim() || "[]");
    } catch (e) {
      console.error("Failed parsing tags json, raw output: ", response.text);
      tags = ["professional", "vs-photography", "gallery"];
    }

    res.json({ tags, isAIPowered: true });

  } catch (err: any) {
    console.error("Gemini Image Tagging error: ", err);
    res.status(500).json({ error: "AI tag generation failed" });
  }
});

// Interactive AI Photoshoot Stylist and Creative Director consultant endpoint
app.post("/api/gemini/shoot-consultant", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required for shoot stylist consultation" });
  }

  if (!ai) {
    // Elegant fallback if Gemini is not initialized yet (missing key)
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    const text = `Hello! I'm Aria, your studio stylist. (Note: Gemini API Key is not set, so I'm running in offline mode). Based on your ideas: "${lastUserMsg}", I suggest we design a warm sunset photo shoot. We can use natural light, comfortable clothes, and natural movements. I've pre-filled a suggested draft for you. Click 'Apply Aria's Design' to autofill your booking form!`;
    return res.json({
      text,
      draftDetails: {
        location: "Scenic Lake Overlook",
        sessionType: "Pre-Wedding Scenic Shoot",
        notes: "Aria's Styling Draft:\n- Theme: Traditional pre-wedding elegance\n- Colors: Vibrant gold, warm marigold, and silk ivory\n- Key Shots: Walking hand-in-hand by the lake, traditional dupatta pose, candid laughter close-up\n- Outfits: Vibrant ethnic wear (Lehenga/Sherwani)",
        colors: ["#F9F6F0", "#FFD700", "#FF8C00", "#8B0000", "#2E1C15"],
        shotList: [
          "Walking along the beach water",
          "Close-up laugh with wind-swept hair",
          "Sunset silhouette portrait with waves",
          "Looking towards the warm sun"
        ],
        styleKeywords: ["Warm", "Natural", "Cinematic", "Simple"]
      },
      isAIPowered: false
    });
  }

  try {
    // Map client conversation messages to Gemini's format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const systemInstruction = `You are Aria, the photoshoot stylist at VS Photography.
Your job is to help clients plan their photo shoot. Help them choose locations, colors, and outfit ideas.

VS Photography's photo packages (sessionType) are:
- "Premium Multi-Day Wedding"
- "Traditional Wedding Ceremony"
- "Pre-Wedding Scenic Shoot"
- "Haldi & Mehendi Festivities"
- "Maternity & Dohale Jevan"
- "Festive & Family Portrait"

Write in very simple, plain, friendly English. Do NOT use complex artistic jargon, overly grand adjectives, or fancy marketing words. Keep your response clear, helpful, and easy to read.

You MUST respond in JSON format matching this schema:
{
  "text": "Your friendly reply in simple English, explaining your suggestions.",
  "draftDetails": {
    "location": "A proposed location (e.g. 'Baker Beach, SF' or 'Indoor Studio')",
    "sessionType": "One of the standard packages (e.g. 'Portrait Sessions')",
    "notes": "A simple, clear summary of the planned theme, outfits, and key shot ideas that the client can apply to their booking request",
    "colors": ["A list of 4 to 5 hex codes that represent the ideal color palette for this session. Choose beautiful colors, e.g. ['#FDFBF7', '#D4AF37', '#4A3B32']"],
    "shotList": ["A list of 3 to 5 clear, simple shot ideas for this session (e.g., 'Walking on the beach', 'Laughing close-up', 'Detail shot of details')"],
    "styleKeywords": ["3 to 4 short, simple adjectives describing the style of the photoshoot, e.g., ['Dreamy', 'Natural', 'Minimalist', 'Warm']"]
  }
}

Even if details aren't finalized, ALWAYS return a JSON object. Ensure 'text' contains your full friendly response. Do not output anything other than raw valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    let result;
    try {
      result = JSON.parse(response.text?.trim() || "{}");
    } catch (e) {
      console.error("Failed parsing consultant json, raw output: ", response.text);
      result = {
        text: response.text || "I apologize, I encountered a tiny ripple in my processing canvas. Let's keep designing your shoot!",
        draftDetails: {}
      };
    }

    res.json({ ...result, isAIPowered: true });

  } catch (err: any) {
    console.error("Gemini Shoot Stylist error: ", err);
    res.status(500).json({ error: "AI stylist consultation failed" });
  }
});

// Interactive AI Studio Copilot / Analytics Assistant endpoint for Administrators
app.post("/api/gemini/admin-copilot", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required for co-pilot" });
  }

  const db = readDb();
  const bookingsSummary = (db.bookings || []).map((b: any) => 
    `- Client: ${b.clientName} (${b.clientEmail}), Date: ${b.date}, Style: ${b.sessionType}, Status: ${b.status}, Location: ${b.location}, Notes: "${b.notes}"`
  ).join("\n");

  const galleriesSummary = (db.galleries || []).map((g: any) =>
    `- Title: ${g.title}, Client: ${g.clientName}, Views: ${g.views || 0}, Total Images: ${g.images?.length || 0}, Selection Submitted: ${g.selectionSubmitted ? "YES" : "NO"}`
  ).join("\n");

  const activitiesSummary = (db.activities || []).slice(0, 10).map((a: any) =>
    `-[${new Date(a.timestamp).toLocaleTimeString()}] ${a.clientName} performed "${a.action}" on "${a.galleryTitle}" details: ${a.details}`
  ).join("\n");

  if (!ai) {
    // Simple fallback response if Gemini key is missing
    const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
    let text = "Hello! I am your studio assistant. (Note: Gemini API Key is not set, running in offline mode).\n\n";
    
    if (lastUserMsg.includes("email") || lastUserMsg.includes("proposal") || lastUserMsg.includes("draft")) {
      text += `Here is a draft email for you:\n\nSubject: Booking details for your photo shoot\n\nDear Client,\n\nThank you for choosing VS Photography! We are excited to work with you and help bring your ideas to life. We have saved your date in our calendar. Please let us know if you have any questions.\n\nBest regards,\nAria Sterling\nVS Photography Studio`;
    } else if (lastUserMsg.includes("summar") || lastUserMsg.includes("stats") || lastUserMsg.includes("analy")) {
      text += `Here is a summary of your studio records:\n- Photo Galleries: ${db.galleries?.length || 0}\n- Total Bookings: ${db.bookings?.length || 0}\n- Pending Bookings: ${db.bookings?.filter((b: any) => b.status === "pending").length || 0}\n\nEverything is running well!`;
    } else {
      text += `I can help you manage your photography studio. You can ask me to:\n1. "Draft an email to a client for their booking"\n2. "Show a summary of studio numbers"\n3. "Give some simple ideas to get more clients for Portrait Sessions"\n\nHow can I help you today?`;
    }

    return res.json({ text, isAIPowered: false });
  }

  try {
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const systemInstruction = `You are the AI Studio Assistant for VS Photography Studio.
Your role is to help the photographer, Aria Sterling, manage bookings, write simple emails, and summarize studio numbers.

Below is the current state of the photography database:

--- BOOKING REQUESTS ---
${bookingsSummary || "No bookings found."}

--- CLIENT GALLERIES ---
${galleriesSummary || "No client galleries setup."}

--- RECENT CLIENT ACTIVITY ---
${activitiesSummary || "No client activities recorded yet."}

---

Write in very simple, plain, friendly, and direct English. Do NOT use fancy marketing jargon or complicated words. Keep everything clear and easy to understand. Format your answers in simple Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction
      }
    });

    res.json({ text: response.text || "No response received", isAIPowered: true });

  } catch (err: any) {
    console.error("Gemini Co-Pilot error: ", err);
    res.status(500).json({ error: "AI copilot failed" });
  }
});

// ================= VITE MIDDLEWARE & CLIENT MOUNTING =================

// Mount Vite middleware in development (when process.env.NODE_ENV !== "production")
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for all non-api SPA paths
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

serveApp();
