import Link from "next/link";
import { MainNavigation } from "./main-navigation";

export function SiteHeader() {
  return (
    <header className="topbar subpage-header">
      <Link className="brand" href="/"><span className="brandmark">N</span><span>Naukri<span>Setu</span></span></Link>
      <MainNavigation />
      <Link className="signin" href="/#updates">Search</Link>
    </header>
  );
}
