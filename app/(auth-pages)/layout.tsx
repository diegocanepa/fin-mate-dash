export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center h-screen relative items-center">{children}</div>
  );
}
