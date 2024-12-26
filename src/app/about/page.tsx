export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">북서머리 소개</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">우리의 미션</h2>
          <p className="text-lg text-gray-700 mb-6">
            바쁜 현대인들이 좋은 책의 핵심을 쉽고 빠르게 만날 수 있도록
            돕습니다.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">주요 특징</h2>
          <div className="grid gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">전문가의 요약</h3>
              <p className="text-gray-700">
                각 분야 전문가들이 책의 핵심을 정확하게 요약합니다.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">다양한 카테고리</h3>
              <p className="text-gray-700">
                소설부터 경영까지, 다양한 분야의 도서를 만나보세요.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">편리한 접근성</h3>
              <p className="text-gray-700">
                언제 어디서나 쉽게 도서 요약을 읽을 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
