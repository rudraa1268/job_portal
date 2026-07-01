import { Link } from 'react-router-dom';
import { formatSalary, toTitleCase, getCompanyColor } from '../utils/formatters';

export default function JobCard({ job, linkTo }) {
  const companyName = job.company?.name || 'Company';
  const companyInitial = companyName.charAt(0).toUpperCase();
  const avatarBgColor = getCompanyColor(companyName);
  
  // Hide description if it is missing or under 10 characters
  const showDescription = job.description && job.description.trim().length >= 10;
  const title = toTitleCase(job.title);

  return (
    <div className="card border border-slate/10 hover:border-coral hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 ease-in-out bg-paper">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Company Avatar */}
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading font-bold text-lg text-white shadow-sm"
            style={{ backgroundColor: avatarBgColor }}
          >
            {companyInitial}
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="font-heading text-lg font-bold text-ink-text leading-snug">
                {linkTo ? (
                  <Link to={linkTo} className="hover:text-coral transition-colors duration-150 focus:outline-none focus:underline decoration-coral">
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>
              <p className="text-sm font-medium text-slate">{companyName}</p>
            </div>

            {/* Meta row chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate/5 px-2.5 py-0.5 text-xs font-medium text-slate">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job.location}</span>
              </div>

              {job.salary && (
                <div className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-semibold text-amber">
                  <span className="font-bold">₹</span>
                  <span className="font-mono">{formatSalary(job.salary).replace('₹', '')}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1 rounded-full bg-slate/5 px-2.5 py-0.5 text-xs font-medium text-slate">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Active</span>
              </div>
            </div>

            {showDescription && (
              <p className="line-clamp-2 text-sm text-slate pt-1 leading-relaxed">
                {job.description}
              </p>
            )}
          </div>
        </div>

        {linkTo && (
          <Link to={linkTo} className="btn-primary shrink-0 text-center text-sm px-4 py-2">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
