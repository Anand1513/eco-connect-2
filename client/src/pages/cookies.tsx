export default function Cookies() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral dark:prose-invert">
        <h1 className="mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground">Effective: Oct 2024</p>

        <h2>What are cookies?</h2>
        <p>
          Chhote text files jo aapke device par store hote hain taaki app smoothly kaam kare aur thoda analytics mile.
        </p>

        <h2>Types of Cookies We Use</h2>
        <ul>
          <li>
            Essential: login sessions, route handling — bina iske service nahi chalegi.
          </li>
          <li>
            Analytics: basic usage metrics, errors — product improve karne ke liye.
          </li>
          <li>
            Functionality: preferences jaise theme, language.
          </li>
        </ul>

        <h2>Controls</h2>
        <p>
          Aap browser settings se cookies manage ya delete kar sakte hain. Essential cookies disable karne se service impact ho sakta hai.
        </p>

        <h2>Contact</h2>
        <p>
          Cookie queries: <a href="mailto:privacy@ecoconnect.example">privacy@ecoconnect.example</a>
        </p>
      </div>
    </div>
  );
}