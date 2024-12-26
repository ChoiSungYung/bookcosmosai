export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">제 1 조 (목적)</h2>
            <p className="text-gray-700">
              이 약관은 북서머리(이하 "회사")가 제공하는 도서 요약 서비스(이하
              "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및
              책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">제 2 조 (용어의 정의)</h2>
            <p className="text-gray-700">
              이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <ol className="list-decimal pl-5 mt-4 space-y-2">
              <li>회원: 회사와 서비스 이용계약을 체결한 자</li>
              <li>
                아이디(ID): 회원 식별과 회원의 서비스 이용을 위해 회원이 선정한
                문자와 숫자의 조합
              </li>
              <li>
                비밀번호: 회원이 부여받은 아이디와 일치된 회원임을 확인하고,
                회원의 개인정보를 보호하기 위해 회원이 설정한 문자와 숫자의 조합
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
