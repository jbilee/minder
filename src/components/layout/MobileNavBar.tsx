import Link from "next/link";
import { RiAccountCircleLine, RiMindMap, RiSettings3Line } from "react-icons/ri";

export default function MobileNavBar() {
  return (
    <div className="flex justify-around p-4 w-full bg-white border-t border-neutral-400">
      <li>
        <Link href="/maps">
          <RiMindMap size="2rem" />
        </Link>
      </li>
      <li>
        <Link href="/account">
          <RiAccountCircleLine size="2rem" />
        </Link>
      </li>
      <li>
        <Link href="/settings">
          <RiSettings3Line size="2rem" />
        </Link>
      </li>
    </div>
  );
}
