export default function PageContainer({ children }) {
  return (
    <div className="pt-36 px-10">
      <div className="bg-white min-h-screen rounded-lg drop-shadow-lg p-5">
        {children}
      </div>
    </div>
  );
}
