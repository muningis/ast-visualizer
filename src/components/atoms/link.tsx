interface LinkProps {
  href: string;
  label: string;
}

const EXTERNAL_LINK_REGEX = /^https?:\/\//;
export function Link(props: LinkProps) {
  const external = EXTERNAL_LINK_REGEX.test(props.href);
  return (<a class="underline hover:text-blue-400 active:text-blue-400 duration-75" target="_blank" {...(external ? {referrerpolicy: "origin"} : {})} href={props.href}>{props.label}</a>); 
}