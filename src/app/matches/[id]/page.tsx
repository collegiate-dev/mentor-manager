import { TallyPM } from "./_components/tally";

export default function PM({ params }: { params: { id: string } }) {
  if (!params.id)
    return <div>Invalid. Contact Ishaan for support ishaan@collegiate.dev</div>;

  return (
    <main>
      <TallyPM id={params.id} />
    </main>
  );
}
