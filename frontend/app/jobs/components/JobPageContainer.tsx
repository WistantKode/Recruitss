"use client";

import { useEffect, useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import type { JobOffer, PaginatedResponse } from "@/lib/types";
import { Header } from "@/components/layouts/header";
import { JobSearchSection } from "./JobSearchSection";
import { JobListSection } from "./JobListSection";
import { JobFilters } from "../types";

export function JobPageContainer() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<JobFilters>({
    search: "",
    location: "",
    contract_type: "",
    is_remote: "",
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | boolean> = { status: "PUBLISHED" };

      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.location) params.location = currentFilters.location;
      if (currentFilters.contract_type)
        params.contract_type = currentFilters.contract_type;
      if (currentFilters.is_remote)
        params.is_remote = currentFilters.is_remote === "true";

      const response: PaginatedResponse<JobOffer> = await apiClient.getJobs(
        params
      );
      setJobs(response.results || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (filters: JobFilters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <JobSearchSection
        initialFilters={currentFilters}
        onSearchSubmit={handleSearchSubmit}
        jobsCount={jobs.length}
      />
      <JobListSection jobs={jobs} loading={loading} />
    </div>
  );
}
