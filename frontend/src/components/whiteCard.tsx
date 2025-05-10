interface WhiteCardProps {
  children: React.ReactNode;
  middle?: boolean;
}

export function WhiteCard({ children, middle= true }: WhiteCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${middle ? "min-h-screen" : ''} bg-gray-100 w-full`}>
      <div className={`bg-white p-6 rounded shadow-md ${middle ? 'w-96' : ''}`}>{children}</div>
    </div>
  );
}
