import React from 'react';
import { FormData } from '../types';
import { Card, CardHeader } from './ui/Card';

interface Step6Props {
  data: FormData;
}

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="space-y-1 text-sm text-gray-600">{children}</div>
    </div>
)

const Field: React.FC<{label: string; value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-3 gap-4">
        <span className="font-medium text-gray-500">{label}</span>
        <span className="col-span-2">{value || <span className="text-gray-400">제공되지 않음</span>}</span>
    </div>
)

export const Step6Confirmation: React.FC<Step6Props> = ({ data }) => {
  return (
    <Card>
      <CardHeader
        title="검토 및 제출"
        description="제출하기 전에 모든 정보를 주의 깊게 검토해주세요."
      />
      <div className="space-y-4">
        <Section title="프로젝트 정보">
          <Field label="공사 위치" value={data.projectInfo.location === '기타' ? data.projectInfo.locationOther : data.projectInfo.location} />
          <Field label="공사명" value={data.projectInfo.constructionName} />
          <Field label="업체명" value={data.projectInfo.companyName} />
          <Field label="담당자" value={data.projectInfo.contactPerson} />
        </Section>
        
        <Section title="안전 교육">
            <Field label="이수 여부" value={data.safetyTraining.completed ? `완료, 이수일: ${data.safetyTraining.completionDate?.toLocaleString()}` : "미이수"} />
        </Section>
        
        <Section title="위험성 평가">
            {data.riskAssessment.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                    {data.riskAssessment.map(item => (
                        <li key={item.id}><strong>{item.task}:</strong> {item.hazard}</li>
                    ))}
                </ul>
            ) : <p>추가된 위험 항목이 없습니다.</p>}
        </Section>

        <Section title="작업 허가서">
            <Field label="유형" value={data.workPermit.type} />
            <Field label="일시" value={
                data.workPermit.workDate 
                ? `${data.workPermit.workDate} ${data.workPermit.workStartTime || ''} ~ ${data.workPermit.workEndTime || ''}`.trim()
                : ''
            } />
            <Field label="장소" value={data.workPermit.location} />
            <Field label="내용" value={data.workPermit.description} />
            <Field label="작업 인원" value={data.workPermit.workerCount} />
        </Section>

        <Section title="안전 서약서">
            <Field label="성명" value={data.safetyPledge.name} />
            <Field label="전체 동의" value={data.safetyPledge.agreeToAll ? '예' : '아니오'} />
            <Field label="서명" value={data.safetyPledge.signature ? <img src={data.safetyPledge.signature} alt="signature" className="h-16 bg-slate-100 border rounded"/> : '서명 없음'} />
        </Section>
      </div>
    </Card>
  );
};