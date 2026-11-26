import Image from "next/image";
import { TextLink } from "./TextLink";

export function BrandMention({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon: string;
}) {
  return (
    <TextLink href={href}>
      <Image className="inline-icon" src={icon} alt="" width={16} height={16} />
      {name}
    </TextLink>
  );
}
