import { EditionPage, editionMetadata, editionStaticParams, type EditionParams } from "@/views/edition";

export const dynamicParams = false;
export const generateStaticParams = editionStaticParams;
export const generateMetadata = (props: EditionParams) => editionMetadata("en", props);

export default function Page(props: EditionParams) {
  return <EditionPage locale="en" {...props} />;
}
