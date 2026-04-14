const SectionHeading = ({ eyebrow, title, description, action }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-roseBrown/70 dark:text-slate-400">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="section-title mt-3">{title}</h2>
        {description ? <p className="mt-4 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
};

export default SectionHeading;
