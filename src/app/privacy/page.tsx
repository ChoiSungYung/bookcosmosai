export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-700">
              북서머리는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
              있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
              목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 계약의 이행</li>
              <li>요금 결제 및 정산</li>
              <li>고객 상담 및 문의 응대</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              2. 개인정보의 처리 및 보유기간
            </h2>
            <p className="text-gray-700">
              북서머리는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>회원 가입 정보: 회원 탈퇴 시까지</li>
              <li>결제 정보: 5년</li>
              <li>고객 문의 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              3. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="text-gray-700">
              정보주체는 북서머리에 대해 언제든지 다음 각 호의 개인정보 보호
              관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">
              4. 개인정보의 안전성 확보조치
            </h2>
            <p className="text-gray-700">
              북서머리는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>관리적 조치: 내부관리계획 수립 및 시행, 정기적 직원 교육</li>
              <li>
                기술적 조치: 개인정보처리시스템 등의 접근권한 관리,
                접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
              </li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">5. 개인정보 보호책임자</h2>
            <p className="text-gray-700">
              북서머리는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">개인정보 보호책임자</p>
              <ul className="mt-2 space-y-1">
                <li>이름: 홍길동</li>
                <li>직책: 개인정보 보호책임자</li>
                <li>연락처: privacy@booksummary.com</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
