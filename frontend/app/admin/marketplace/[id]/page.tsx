"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Star, CheckCircle, Clock, ShoppingCart } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import seedListings from "@/data/seed/marketplace_listings.json"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

const BOOKINGS_KEY = "talentos_marketplace_bookings"
const REVIEWS_KEY = "talentos_marketplace_reviews"
const VERIFY_KEY = "talentos_marketplace_verified"

function getBookings(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]") } catch { return [] }
}
function addBooking(booking: any) {
  const bookings = getBookings()
  bookings.unshift(booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}
function getReviews(listingId: string): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(`${REVIEWS_KEY}_${listingId}`) || "[]") } catch { return [] }
}
function addReview(listingId: string, review: any) {
  const reviews = getReviews(listingId)
  reviews.unshift(review)
  localStorage.setItem(`${REVIEWS_KEY}_${listingId}`, JSON.stringify(reviews))
}
function getVerified(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(VERIFY_KEY) || "{}") } catch { return {} }
}
function setVerified(id: string, val: boolean) {
  const v = getVerified(); v[id] = val
  localStorage.setItem(VERIFY_KEY, JSON.stringify(v))
}

const CATEGORY_LABELS: Record<string, string> = {
  MODELING: "Modeling", VIDEO: "Video", HOSTING: "Hosting", PHOTOGRAPHY: "Photography", BEAUTY: "Beauty",
}

export default function MarketplaceListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<any | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [verified, setVerifiedState] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({ date: "", notes: "", quantity: "1" })
  const [reviewForm, setReviewForm] = useState({ rating: "5", comment: "" })

  useEffect(() => {
    const found = (seedListings as any[]).find((l) => l._id === id)
    setListing(found || null)
    setBookings(getBookings().filter((b) => b.listingId === id))
    setReviews(getReviews(id))
    setVerifiedState(getVerified()[id] || false)
  }, [id])

  function handleBook() {
    const booking = {
      _id: `bk_${Date.now()}`,
      listingId: id,
      listingTitle: listing?.title,
      date: bookingForm.date,
      notes: bookingForm.notes,
      quantity: parseInt(bookingForm.quantity),
      total: (listing?.rate || 0) * parseInt(bookingForm.quantity),
      currency: listing?.currency || "INR",
      status: "CONFIRMED",
      bookedAt: new Date().toISOString(),
    }
    addBooking(booking)
    setBookings((prev) => [booking, ...prev])
    setBookingForm({ date: "", notes: "", quantity: "1" })
    setBookingOpen(false)
  }

  function handleReview() {
    const review = {
      _id: `rev_${Date.now()}`,
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      reviewer: "Admin User",
      createdAt: new Date().toISOString(),
    }
    addReview(id, review)
    setReviews((prev) => [review, ...prev])
    setReviewForm({ rating: "5", comment: "" })
    setReviewOpen(false)
  }

  function handleVerify() {
    setVerified(id, true)
    setVerifiedState(true)
  }

  if (!listing) return (
    <AdminPageWrapper>
      <AdminCard><p className="text-center text-white/50">Listing not found.</p></AdminCard>
    </AdminPageWrapper>
  )

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={listing.title}
        subtitle={CATEGORY_LABELS[listing.category] || listing.category}
        action={
          <div className="flex gap-2">
            <Link href="/admin/marketplace"><AdminButton variant="ghost">← Marketplace</AdminButton></Link>
            {!verified && (
              <AdminButton variant="secondary" onClick={handleVerify}>
                <CheckCircle className="mr-2 h-4 w-4" /> Verify Vendor
              </AdminButton>
            )}
            <AdminButton onClick={() => setBookingOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Book Now
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Listing details */}
        <AdminCard className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{listing.title}</h2>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <AdminBadge variant={listing.status === "ACTIVE" ? "success" : "default"}>{listing.status}</AdminBadge>
                {verified && <AdminBadge variant="success"><CheckCircle className="mr-1 h-3 w-3" />Verified</AdminBadge>}
              </div>
            </div>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-white/70">{listing.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">Rate</p>
              <p className="text-2xl font-bold text-white">₹{listing.rate?.toLocaleString("en-IN")}</p>
              <p className="text-xs text-white/40">{listing.currency}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</p>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`h-3 w-3 ${i <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                ))}
                <span className="ml-1 text-xs text-white/50">({reviews.length})</span>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Bookings */}
        <AdminCard>
          <h3 className="mb-4 font-bold text-white">Bookings ({bookings.length})</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-white/30">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">{b.date}</span>
                    <AdminBadge variant="success">Confirmed</AdminBadge>
                  </div>
                  <p className="mt-1 font-semibold text-white">₹{b.total?.toLocaleString("en-IN")}</p>
                  {b.notes && <p className="text-xs text-white/40">{b.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Reviews */}
      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">Reviews ({reviews.length})</h3>
          <AdminButton variant="secondary" size="sm" onClick={() => setReviewOpen(true)}>
            <Star className="mr-1 h-3 w-3" /> Add Review
          </AdminButton>
        </div>
        {reviews.length === 0 ? (
          <p className="text-sm text-white/30">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                  ))}
                </div>
                <p className="text-sm text-white/80">{r.comment}</p>
                <p className="mt-2 text-xs text-white/40">{r.reviewer} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="border border-white/10 bg-slate-900 text-white">
          <DialogHeader><DialogTitle>Book: {listing.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Date</label>
              <input type="date" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={bookingForm.date} onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Quantity / Days</label>
              <input type="number" min="1" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={bookingForm.quantity} onChange={(e) => setBookingForm((f) => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Total</span>
                <span className="font-bold text-white">₹{((listing.rate || 0) * parseInt(bookingForm.quantity || "1")).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Notes</label>
              <textarea className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2} placeholder="Special requirements..." value={bookingForm.notes}
                onChange={(e) => setBookingForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setBookingOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleBook} disabled={!bookingForm.date}>Confirm Booking</AdminButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="border border-white/10 bg-slate-900 text-white">
          <DialogHeader><DialogTitle>Add Review</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Rating</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
                value={reviewForm.rating} onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}>
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Comment</label>
              <textarea className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3} placeholder="Share your experience..." value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} />
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setReviewOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleReview} disabled={!reviewForm.comment}>Submit Review</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
