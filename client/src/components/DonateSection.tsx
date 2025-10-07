export default function DonateSection() {
  return (
    <section id="donate" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
            Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Help Us Feed More People</h2>
          <p className="text-muted-foreground">Your contribution keeps pickups running and meals moving</p>
        </div>

        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold text-foreground mb-2">Bank Transfer</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Account Name:</span> EcoConnect Foundation</div>
              <div><span className="font-medium text-foreground">Account No:</span> 0000000000</div>
              <div><span className="font-medium text-foreground">IFSC:</span> ABCD0123456</div>
              <div><span className="font-medium text-foreground">Bank:</span> Your Bank Name</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold text-foreground mb-2">UPI / Quick Pay</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">UPI ID:</span> ecoconnect@upi</div>
              <div>Scan QR in events or contact us for receipt</div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Note: Replace these placeholders with your real details.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold text-foreground mb-2">Online Payments (Stripe/PayPal)</h3>
            <p className="text-sm text-muted-foreground mb-3">Comming soon — test buttons below</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-black text-white rounded-md" disabled>Pay with Stripe</button>
              <button className="px-4 py-2 bg-[#003087] text-white rounded-md" disabled>Pay with PayPal</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


