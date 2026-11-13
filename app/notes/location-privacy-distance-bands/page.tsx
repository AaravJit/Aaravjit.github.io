import type { Metadata } from 'next';
import Link from 'next/link';
import Article from '../../../components/Article';
import { Code } from '../../../components/ui';

export const metadata: Metadata = {
  title: 'Why RoadPing stopped returning distances',
  description: 'Threat-modeling a proximity feature: how repeated polling, range probing and ordering leak location, and how distance bands, grid snapping and held values close those channels.',
  alternates: { canonical: '/notes/location-privacy-distance-bands/' },
  openGraph: { type: 'article', title: 'Why RoadPing stopped returning distances', url: '/notes/location-privacy-distance-bands/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const contract = `{ "drivers": [ {
  "user_id": "uuid", "handle": "maya", "display_name": "Maya",
  "vehicle_type": "car", "vehicle_make": "Honda", "vehicle_model": "Civic",
  "distance_band": "800m_to_1600m",
  "is_speaking": false, "dnd": false
} ] }`;

export default function Note() {
  return (
    <Article slug="location-privacy-distance-bands">
      <p>RoadPing lets drivers near each other talk with push-to-talk audio. To do that it has to answer one question many times a minute: <em>who is near me?</em> The first answer the backend gave was reasonable-looking and wrong.</p>

      <h2>The first design</h2>
      <p>Raw positions lived in a table that no client role could read. A <code>SECURITY DEFINER</code> function computed the distance from the caller to each nearby driver and returned it rounded to 50 metres, sorted by exact distance. No coordinates ever left the database. That felt like the hard part done.</p>

      <h2>Why a rounded distance still leaks</h2>
      <p>A distance from a known point puts the target on a ring. Two rings from two known points intersect in at most two places; a third ring picks one. If the caller can choose where they are (a GPS spoofer is enough), a rounded distance becomes a location with roughly the rounding as its error. Rounding to 50 m doesn’t stop trilateration, it only blurs it to 50 m, and the target might be sitting in their driveway.</p>
      <p>The project’s threat model, written before the fix, lists the other channels that carried precision:</p>
      <ul>
        <li><strong>Polling.</strong> A fresh distance on every request, up to 30 a minute.</li>
        <li><strong>A range parameter.</strong> The request could ask for 12 different radii, and “visible or not” at each radius is a one-bit distance measurement.</li>
        <li><strong>Session restarts.</strong> Even with the range stored server-side, restarting at 250 m and then 400 m would reveal “between 250 and 400 m”.</li>
        <li><strong>Ordering.</strong> A list sorted by exact distance ranks targets precisely even if the numbers are hidden.</li>
        <li><strong>A map pin.</strong> The client drew each stranger at the reported distance along a bearing derived from their user id. The direction was invented, but the pin looked like geography.</li>
      </ul>

      <h2>The redesign</h2>
      <p>The goal stated in the design document is not to make inference impossible, which coarse proximity can’t do, but to remove precision the product doesn’t need and make probing slow, coarse and costly:</p>
      <ol>
        <li><strong>Bands, not numbers.</strong> Clients get one of four values: within 800 m, 0.8–1.6 km, 1.6–3.2 km, or beyond. Each band doubles the previous one, so the relative precision is constant.</li>
        <li><strong>Grid snapping.</strong> Both positions are snapped to a ~250 m, latitude-adaptive grid before any distance is computed, so the band edges can’t be walked with GPS precision.</li>
        <li><strong>Held values.</strong> Each band is held for 30 seconds per viewer and target session in a private table. Refetching, reconnecting or restarting the app returns the held value.</li>
        <li><strong>No range to probe.</strong> The request body never reaches the query. The only ranges a user can choose are the band edges, so “visible at range R” never says more than the band already does.</li>
        <li><strong>Neutral ordering.</strong> Band, then name, then id. Strangers are no longer drawn on the map at all.</li>
      </ol>
      <p>The public API contract after the change carries no coordinate, numeric distance, bearing or session id:</p>
      <Code file="docs/PHASE2_PROXIMITY_PRIVACY.md (API contract, trimmed)" href="https://github.com/AaravJit/RoadPing/blob/main/docs/PHASE2_PROXIMITY_PRIVACY.md" code={contract} />

      <h2>Testing a privacy property</h2>
      <p>“Nothing finer than the band leaks through range changes” is a claim you can test. The pgTAP suite restarts an attacker’s session at 100 different ranges against a target placed at 23 distances, 2,300 restarts in all, and checks that the visible/not-visible observations split the placements into exactly five classes: the four bands and out of range. If any range setting distinguished two positions inside one band, there would be more than five.</p>

      <h2>What’s still observable</h2>
      <p>Whether someone appears at all is evaluated fresh on every request and isn’t held; the document lists it as residual observability. Someone who can see the target on the road is out of scope. And a determined attacker with many accounts can still learn which ~250 m cell a person is in, one sample per 30 seconds. That is a deliberate trade, written down, rather than an accident.</p>

      <h2>What I took from it</h2>
      <p>“We never return coordinates” was true and insufficient. Every value derived from a secret is a measurement of it, including list order, a yes/no visibility check, and how often you’re allowed to ask. The useful question in review is not “does this field contain the secret?” but “what could someone learn from this field if they asked a thousand times from places of their choosing?”</p>
      <p>The full case study is at <Link href="/projects/roadping/">RoadPing</Link>, and the decision record is <Link href="/decisions/#location-bands">here</Link>.</p>
    </Article>
  );
}
