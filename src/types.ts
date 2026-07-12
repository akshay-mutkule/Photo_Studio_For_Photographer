export interface ImageItem {
  id: string;
  url: string;
  tags: string[];
  originalName: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  date: string;
  passcode: string; // Password to access
  clientName: string;
  clientEmail: string;
  coverImage: string;
  images: ImageItem[];
  favorites: string[]; // Image IDs marked as favorite
  selected: string[]; // Image IDs selected for final submission
  selectionSubmitted: boolean;
  selectionSubmittedAt?: string;
  allowDownload: boolean;
  downloadApproved: boolean;
  views: number;
  retouchStatus?: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  expirationDate?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  location: string;
  sessionType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'declined';
  createdAt: string;
}

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ClientProfile {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  passcode: string; // Code to view profile and notifications
  createdAt: string;
  notifications: ClientNotification[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  category: string;
  title: string;
  tags: string[];
}

export interface ClientActivity {
  id: string;
  galleryId: string;
  galleryTitle: string;
  clientName: string;
  action: 'viewed' | 'favorited' | 'selected' | 'submitted' | 'downloaded';
  timestamp: string;
  details: string;
}

export interface DashboardStats {
  totalGalleries: number;
  totalBookings: number;
  pendingBookings: number;
  totalViews: number;
  totalSelectionsSubmitted: number;
}
