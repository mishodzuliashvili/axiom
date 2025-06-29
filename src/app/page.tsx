import { ifAuthenticatedRedirect } from '@/lib/auth';
import LandingPage from './_components/LandingPage';

export default async function LandingPag() {
  await ifAuthenticatedRedirect();

  return <LandingPage />;
}
