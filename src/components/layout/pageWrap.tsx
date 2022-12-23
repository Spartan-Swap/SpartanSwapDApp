type LayoutProps = {
  children: React.ReactNode;
};

export default function PageWrap({ children }: LayoutProps) {
  return (
    <>
      <div className="container mx-auto max-w-5xl py-6 px-2 sm:px-4 lg:px-8">
        {children}
      </div>
    </>
  );
}
