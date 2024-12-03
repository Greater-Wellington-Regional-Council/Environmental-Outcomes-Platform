export default function GWHeader({title, subtitle, council, backTo}: { title: string, subtitle: string, council: Council, backTo?: { href: string, text: string } }) {
  return (
    <header className="header bold p-3 pl-[1.5em] bg-nui text-white grid grid-cols-12">
      <div className="header-text col-span-10">
        {backTo && (
          <a href={backTo.href} className="text-xs underline">{backTo.text || "<Back"}</a>)}
        <h1 className="header-title">{title}</h1>
        <h2 className="header-subtitle mb-1">{subtitle}</h2>
      </div>
      <div className="header-image col-span-2 mt-1 mr-2 ml-auto">
        <img className={"text-white"} src={council.logo} style={{maxHeight: "83px"}} alt="Greater Wellington Regional Council logo"/>
      </div>
    </header>
  )
}
