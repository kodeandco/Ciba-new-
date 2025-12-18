// app/job/page.tsx
import JobHero from "@/components/job-hero";
import JobCategories from "@/components/job-categories";
import JobStats from "@/components/job-stats";
import JobListings from "@/components/job-listings";
import StartupDirectory from "@/components/startup-directory";
import Navbar from "@/components/navbar";
export default function JobPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <JobHero />
        {/* <JobCategories /> */}
        <JobListings />
        <StartupDirectory />
      </div>
    </>
  );
}