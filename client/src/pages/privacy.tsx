export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral dark:prose-invert">
        <h1 className="mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Effective: Oct 2024</p>

        <h2>Overview</h2>
        <p>
          EcoConnect food waste reduce karne ke liye bana hai. Hum aapki privacy
          ka dhyan rakhte hain aur only required data collect karte hain taaki service sahi chal sake.
        </p>

        <h2>Data We Collect</h2>
        <ul>
          <li>Account data: name, email, role (restaurant/volunteer/ngo)</li>
          <li>Operational data: listings, pickup timing, confirmations</li>
          <li>Device data: basic analytics (pages visited, errors) for improvements</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>Service delivery: pickups, notifications, confirmations</li>
          <li>Security: fraud prevention, abuse detection</li>
          <li>Product improvement: performance, usability, bug fixes</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          Hum data sirf service ke liye share karte hain — jaise pickup coordination me partner ko relevant info.
          Koi bhi marketing ke liye personal data sell nahi hota.
        </p>

        <h2>Retention</h2>
        <p>
          Account active rehte waqt data retain hota hai. Account delete request ke baad reasonable time me
          backups se bhi remove karne ki koshish hoti hai, legal obligations ko dhyan me rakhte hue.
        </p>

        <h2>Your Rights</h2>
        <ul>
          <li>Access/Export: apne data dekh sakte hain</li>
          <li>Rectify: galat details ko update kar sakte hain</li>
          <li>Delete: account closure ke saath removal request kar sakte hain</li>
        </ul>

        <h2>Contact</h2>
        <p>
          Privacy queries ke liye: <a href="mailto:privacy@ecoconnect.example">privacy@ecoconnect.example</a>
        </p>
      </div>
    </div>
  );
}