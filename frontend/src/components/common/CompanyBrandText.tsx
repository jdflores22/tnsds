interface CompanyBrandTextProps {
  companyName: string;
  tagline: string;
  nameColor: string;
  accentColor: string;
  taglineColor: string;
}

export function CompanyBrandText({
  companyName,
  tagline,
  nameColor,
  accentColor,
  taglineColor,
}: CompanyBrandTextProps) {
  const nameParts = companyName.includes('-') ? companyName.split('-') : null;

  return (
    <div className="leading-tight">
      <span className="block text-base font-medium tracking-wide" style={{ color: nameColor }}>
        {nameParts ? (
          <>
            {nameParts[0]}-
            <span style={{ color: accentColor }}>{nameParts.slice(1).join('-')}</span>
          </>
        ) : (
          companyName
        )}
      </span>
      <span
        className="block text-[10px] font-medium uppercase tracking-wider"
        style={{ color: taglineColor }}
      >
        {tagline}
      </span>
    </div>
  );
}
