export default function Header({ council }: { council: Council }) {
  return (
    <header className="flex items-center px-6 py-4 border-b">
      <div className="flex-1">
        <h1 className="text-xl font-light">{council.labels.headingText}</h1>
        <h2>Water Quantity Limits</h2>
      </div>
      <a href={council.url} title={`Go to the ${council.name} website`}>
        <img
          className="h-10"
          alt={`${council.name} Logo`}
          src={council.logo}
        ></img>
      </a>
    </header>
  );
}
