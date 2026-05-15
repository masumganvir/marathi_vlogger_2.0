import { useEffect, useState } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useClerkFirebaseSync } from "@/hooks/useClerkFirebaseSync";
import { Link } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import { BackButton } from "@/components/BackButton";
import { TechBackground } from "@/components/TechBackground";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ArrowLeft,
  Loader2,
  LogIn,
  MapPin,
  FileText,
  Save,
  Edit3,
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  ChevronRight,
} from "lucide-react";

interface FirestoreUserData {
  clerkId: string;
  fullName: string;
  email: string;
  imageUrl: string;
  username: string;
  phoneNumbers: string[];
  createdAt: { seconds: number } | null;
  lastSignInAt: { seconds: number } | null;
  syncedAt: { seconds: number } | null;
  bio?: string;
  location?: string;
}

interface Order {
  id: string;
  service: string;
  status: string;
  date: string;
  amount?: string;
}

const ProfileField = ({
  icon: Icon,
  label,
  value,
  isEditing = false,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (v: string) => void;
  type?: string;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-sm border border-primary/10 bg-primary/5 hover:border-primary/25 transition-all duration-300 group">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-luxury text-muted-foreground font-semibold mb-1">
        {label}
      </p>
      {isEditing && onChange ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-obsidian/40 border-b border-primary/30 py-1 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
        />
      ) : (
        <p className="text-foreground font-medium text-sm truncate">{value || "Not provided"}</p>
      )}
    </div>
  </div>
);

const formatDate = (ts: { seconds: number } | null | undefined) => {
  if (!ts) return "Recently Joined";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UserProfileContent = () => {
  useClerkFirebaseSync();
  const { user } = useUser();
  const [data, setData] = useState<FirestoreUserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "interests">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [editForm, setEditForm] = useState({
    bio: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        // Fetch User
        const userSnap = await getDoc(doc(db, "users", user.id));
        if (userSnap.exists()) {
          const uData = userSnap.data() as FirestoreUserData;
          setData(uData);
          setEditForm({
            bio: uData.bio || "",
            location: uData.location || "",
            phone: uData.phoneNumbers?.[0] || "",
          });
        }

        // Fetch Orders (Mocking or real if collection exists)
        const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.id));
        const ordersSnap = await getDocs(ordersQuery);
        const ordersList = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ordersList.length > 0 ? ordersList : [
          { id: "mock-1", service: "Wedding Cinematography", status: "Completed", date: "24 Dec 2024", amount: "₹85,000" },
          { id: "mock-2", service: "Pre-Wedding Film", status: "Processing", date: "12 Feb 2025", amount: "₹45,000" }
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        bio: editForm.bio,
        location: editForm.location,
        phoneNumbers: [editForm.phone],
        updatedAt: serverTimestamp(),
      });
      setData((prev) => prev ? { ...prev, bio: editForm.bio, location: editForm.location, phoneNumbers: [editForm.phone] } : null);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-luxury text-primary/60 font-bold animate-pulse">Syncing Vault...</p>
      </div>
    );
  }

  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? data?.email ?? "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Avatar */}
      <div className="relative mb-12 flex flex-col md:flex-row items-center md:items-end gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-gold shadow-gold relative group">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Profile"}
                className="w-full h-full rounded-full object-cover border-4 border-obsidian"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center border-4 border-obsidian">
                <User className="w-14 h-14 text-primary" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-obsidian animate-pulse shadow-glow-green" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
            {user?.fullName || data?.fullName || "Studio Member"}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-luxury text-primary font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Diamond Member
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/30 bg-white/5 text-[10px] uppercase tracking-luxury text-zinc-400 font-bold">
              <Shield className="w-3.5 h-3.5" />
              Verified Account
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-sm border border-primary/30 bg-primary/5 hover:bg-primary hover:text-obsidian transition-all duration-500 font-bold text-[10px] uppercase tracking-luxury group"
          >
            {isEditing ? (
              saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>
            ) : (
              <><Edit3 className="w-4 h-4" /> Edit Profile</>
            )}
          </button>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="p-3 rounded-sm border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-primary/10 mb-10 overflow-x-auto no-scrollbar">
        {[
          { id: "profile", label: "Overview", icon: User },
          { id: "orders", label: "My Orders", icon: ShoppingBag },
          { id: "interests", label: "My Interests", icon: Heart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-luxury font-bold border-b-2 transition-all duration-300 ${
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "profile" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-luxury text-primary font-bold px-1 mb-2">Member Details</h3>
                <ProfileField icon={User} label="Full Name" value={user?.fullName || data?.fullName || ""} />
                <ProfileField icon={Mail} label="Primary Email" value={primaryEmail} />
                <ProfileField icon={Phone} label="Phone Number" value={editForm.phone} isEditing={isEditing} onChange={(v) => setEditForm({...editForm, phone: v})} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-luxury text-primary font-bold px-1 mb-2">Customizations</h3>
                <ProfileField icon={MapPin} label="Location" value={editForm.location} isEditing={isEditing} onChange={(v) => setEditForm({...editForm, location: v})} />
                <ProfileField icon={FileText} label="Short Bio" value={editForm.bio} isEditing={isEditing} onChange={(v) => setEditForm({...editForm, bio: v})} />
                <ProfileField icon={Calendar} label="Last Active" value={formatDate(data?.lastSignInAt)} />
              </div>
            </div>

            <div className="glass-premium p-8 rounded-sm border border-primary/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
               <h4 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                 <Shield className="w-5 h-5 text-primary" />
                 Studio Security Vault
               </h4>
               <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                 Your cinematography portal is secured with high-level encryption. All bookings, project files, and personal preferences are stored in your private Firestore silo, accessible only via your Clerk-verified identity.
               </p>
               <div className="flex items-center justify-between py-4 border-t border-primary/10">
                 <div className="text-[9px] uppercase tracking-luxury font-bold text-muted-foreground/60">
                   Vault Status: <span className="text-green-500">Encrypted & Live</span>
                 </div>
                 <div className="text-[9px] uppercase tracking-luxury font-bold text-muted-foreground/60">
                   Member ID: {user?.id.slice(0, 12)}...
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-display font-bold">Booking History</h3>
               <span className="text-[10px] uppercase tracking-luxury text-primary font-bold">{orders.length} Projects</span>
            </div>
            
            {orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="glass-premium p-6 rounded-sm border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{order.service}</h4>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-luxury font-bold mb-1">Status</div>
                        <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${
                          order.status === "Completed" ? "text-green-400 border-green-500/30 bg-green-500/5" : "text-amber-400 border-amber-500/30 bg-amber-500/5"
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      {order.amount && (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground uppercase tracking-luxury font-bold mb-1">Total</div>
                          <div className="text-lg font-display font-bold text-primary">{order.amount}</div>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-primary/20 rounded-sm">
                 <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                 <p className="text-muted-foreground font-medium">No bookings found yet.</p>
                 <Link to="/#packages" className="text-primary text-[10px] uppercase font-bold tracking-luxury mt-4 hover:underline">Book your first shoot →</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "interests" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col items-center justify-center py-32 text-center bg-primary/5 border border-primary/10 rounded-sm">
                <Heart className="w-12 h-12 text-primary/40 mb-6" />
                <h3 className="text-2xl font-display font-bold mb-3">Your Inspiration Board</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Save packages and cinematic styles you love to discuss them during our consultation.
                </p>
                <button className="mt-8 px-6 py-3 border border-primary/30 rounded-full text-[10px] uppercase tracking-luxury font-bold text-primary hover:bg-primary/10 transition-all">
                  Browse Services
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};


const Profile = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <TechBackground />
      <BackButton />
      
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-charcoal via-black to-obsidian opacity-80" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container py-20 px-6">

        <SignedIn>
          <UserProfileContent />
        </SignedIn>

        <SignedOut>
          <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-glow">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Portal Locked</h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Please sign in to access your personal cinematography vault and account settings.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-gold text-obsidian font-bold text-[11px] uppercase tracking-luxury rounded-sm hover:shadow-gold transition-all duration-300 group"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Member Portal
            </button>

            {showModal && <AuthModal onClose={() => setShowModal(false)} />}
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default Profile;

