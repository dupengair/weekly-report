interface ReportPageProps {
  params: { id: string };
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Report {params.id}</h1>
      <p className="text-gray-600">Report details will be shown here...</p>
    </main>
  );
}
