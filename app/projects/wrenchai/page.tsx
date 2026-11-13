import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudy from '../../../components/CaseStudy';
import { projectBySlug } from '../../../data/projects';

const project = projectBySlug('wrenchai');

export const metadata: Metadata = {
  title: 'WrenchAI case study',
  description: 'WrenchAI, a live aviation-maintenance study platform built on Base44: verbal-exam practice, written-test prep, practical checklists and progress tracking, specified and tested by Aarav Jit.',
  alternates: { canonical: '/projects/wrenchai/' },
  openGraph: { type: 'article', title: 'WrenchAI case study', url: '/projects/wrenchai/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const shot = (src: string, alt: string, caption: string, priority = false) => (
  <>
    <figure className="shot"><Image src={src} width={1600} height={1071} sizes="(max-width: 920px) calc(100vw - 32px), 860px" alt={alt} priority={priority} /></figure>
    <figcaption>{caption}</figcaption>
  </>
);

export default function WrenchAICaseStudy() {
  return (
    <CaseStudy
      project={project}
      lede="A live study platform for aviation-maintenance students preparing across General, Airframe and Powerplant, with verbal-exam practice, written-test prep, practical checklists and progress tracking."
      sections={[
        {
          id: 'problem', label: 'Problem', title: 'Three subject areas, several kinds of exam',
          body: <>
            <p>Aviation-maintenance students prepare for written tests and for oral and practical exams across three knowledge areas. Study material tends to be split by format, so the student has to stitch their own plan together.</p>
            {shot('/wrenchai-landing.webp', 'WrenchAI landing page showing a simulated verbal-exam question, answer feedback, and study product introduction', 'The public landing page, centered on AI-assisted verbal practice.', true)}
          </>,
        },
        {
          id: 'role', label: 'My role', title: 'Product specification and testing, on a no-code platform',
          body: <>
            <p>WrenchAI is built and hosted on Base44, an AI app builder that generates the code and database from natural-language specifications. I didn’t write its code, and there is no repository to show. My work was at the product level:</p>
            <ul>
              <li>Picked the problem and organized the product around the three A&amp;P knowledge areas.</li>
              <li>Specified each study mode (verbal practice, written tests, weak-spot drill, practical prep) and how they share one dashboard and navigation.</li>
              <li>Defined the account, session and progress data the dashboard reads from.</li>
              <li>Tested each flow end to end on the live app, as a student would use it.</li>
            </ul>
          </>,
        },
        {
          id: 'product', label: 'Product', title: 'One workspace for every study mode',
          body: <>
            <p>The authenticated dashboard keeps General, Airframe and Powerplant in view while the learner moves between Practice, Written Test, Weak Spot Drill, Practical Prep, Reference Library and Career Tools. Performance, Recent Sessions and Topic Progress fill in as sessions are completed; the screenshot is a fresh account, so it shows the empty states a new user sees first.</p>
            {shot('/wrenchai-dashboard.webp', 'WrenchAI dashboard showing study navigation, performance tabs, and General, Airframe, and Powerplant practice sections', 'Authenticated dashboard.')}
            <p>Written Test Prep gives each section its own session card with topic labels, question counts and estimated time. Practical Prep breaks readiness into trackable checklists such as corrosion control, inspection, weight and balance, and fluid lines and fittings.</p>
            {shot('/wrenchai-written-test-prep.webp', 'WrenchAI Written Test Prep page with General, Airframe, and Powerplant quiz cards', 'Written practice organized by section.')}
            {shot('/wrenchai-practical-prep.webp', 'WrenchAI Practical Prep interface showing General practical-project readiness and checklist items', 'Practical-project readiness as a checklist.')}
          </>,
        },
        {
          id: 'status', label: 'Status', title: 'Live, with honest limits',
          body: <>
            <ul className="checklist"><li>Live with public sign-up and authenticated study areas.</li></ul>
            <ul className="checklist todo">
              <li>No usage numbers are published, so none are claimed.</li>
              <li>The platform owns the code, which limits custom engineering such as automated tests or my own backend.</li>
            </ul>
            <p>WrenchAI is an independent study tool and isn’t affiliated with the FAA.</p>
          </>,
        },
      ]}
    />
  );
}
