import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { getProjects } from "@/serverFunctions/projects";
import { CreateProjectModal } from "@/client/features/projects/CreateProjectModal";
import { getStandardErrorMessage } from "@/client/lib/error-messages";

export const Route = createFileRoute("/_app/clients")({
  head: () => ({ meta: [{ title: "Clients | Signal House Media" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
    retry: false,
  });
  const query = search.trim().toLowerCase();
  const clients = (projects.data ?? []).filter(
    (project) =>
      project.name.toLowerCase().includes(query) ||
      project.domain?.toLowerCase().includes(query),
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Signal House Media
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Client hub</h1>
          <p className="mt-2 max-w-xl text-base-content/70">
            A workspace for every client. Turn search intelligence into the next
            useful action.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add client
        </button>
      </header>

      <section aria-labelledby="clients-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="clients-heading" className="text-lg font-semibold">
            Client workspaces
          </h2>
          <label className="input input-bordered flex items-center gap-2">
            <Search aria-hidden="true" className="size-4 opacity-50" />
            <input
              aria-label="Search clients"
              placeholder="Search name or domain"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
            />
          </label>
        </div>
        {projects.isPending ? (
          <p role="status" className="py-8 text-base-content/60">
            Loading clients…
          </p>
        ) : projects.isError ? (
          <div role="alert" className="rounded-xl border border-error/30 p-5">
            <p>
              {getStandardErrorMessage(
                projects.error,
                "Couldn't load clients.",
              )}
            </p>
            <button
              className="btn btn-sm mt-3"
              onClick={() => void projects.refetch()}
            >
              Try again
            </button>
          </div>
        ) : clients.length === 0 ? (
          <p className="rounded-xl border border-base-300 p-8 text-base-content/60">
            {query
              ? "No clients match your search."
              : "Add your first client to get started."}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {clients.map((client) => (
              <article
                key={client.id}
                className="rounded-xl border border-base-300 bg-base-100 p-5"
              >
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p className="mt-1 break-all text-sm text-base-content/60">
                  {client.domain || "Website not set"}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    className="btn btn-primary btn-sm"
                    to="/p/$projectId"
                    params={{ projectId: client.id }}
                  >
                    Open workspace <ArrowUpRight className="size-4" />
                  </Link>
                  <Link
                    className="btn btn-ghost btn-sm"
                    to="/p/$projectId/audit"
                    params={{ projectId: client.id }}
                    search={{}}
                  >
                    Site audit
                  </Link>
                  <Link
                    className="btn btn-ghost btn-sm"
                    to="/p/$projectId/settings/integrations"
                    params={{ projectId: client.id }}
                  >
                    Connections
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        aria-labelledby="capabilities-heading"
        className="rounded-xl border border-base-300 bg-base-200/50 p-5"
      >
        <h2 id="capabilities-heading" className="text-lg font-semibold">
          Platform capabilities
        </h2>
        <p className="mt-2 text-sm text-base-content/70">
          OpenSEO powers keyword research, rankings, backlinks, site audits and
          AI visibility. Data features require connected services and may incur
          usage charges.
        </p>
        <p className="mt-3 text-sm text-base-content/70">
          Planned: website fixes, WordPress publishing, Google Business Profile,
          reviews, local pages, citations and scheduled client reports. These
          execution tools are not connected yet.
        </p>
      </section>
      {creating ? (
        <CreateProjectModal onClose={() => setCreating(false)} />
      ) : null}
    </div>
  );
}
