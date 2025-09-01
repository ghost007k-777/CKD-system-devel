import React from 'react';
import { SafetyPledge } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Checkbox } from './ui/Checkbox';
import { Input } from './ui/Input';
import { SignaturePad } from './SignaturePad';
import { PLEDGE_ITEMS } from '../constants';

interface Step5Props {
  data: SafetyPledge;
  updateData: (data: Partial<SafetyPledge>) => void;
}

export const Step5SafetyPledge: React.FC<Step5Props> = ({ data, updateData }) => {
  const handleCheckChange = (key: string) => {
    const newAgreements = { ...data.agreements, [key]: !data.agreements[key] };
    const allChecked = Object.values(newAgreements).every(Boolean);
    updateData({ agreements: newAgreements, agreeToAll: allChecked });
  };

  const handleAgreeToAllChange = () => {
    const newAgreeToAll = !data.agreeToAll;
    const newAgreements: { [key: string]: boolean } = {};
    Object.keys(PLEDGE_ITEMS).forEach(key => {
      newAgreements[key] = newAgreeToAll;
    });
    updateData({ agreements: newAgreements, agreeToAll: newAgreeToAll });
  };
  
  return (
    <Card>
      <CardHeader
        title="안전보건 준수 서약서"
        description="아래의 안전 준수 항목을 읽고 동의해주세요."
      />
      <div className="space-y-4">
        <div className="p-4 border rounded-md space-y-3">
          {Object.entries(PLEDGE_ITEMS).map(([key, text]) => (
            <Checkbox 
              key={key} 
              id={key} 
              label={text} 
              checked={!!data.agreements[key]}
              onChange={() => handleCheckChange(key)}
            />
          ))}
        </div>
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
          <Checkbox 
            id="agree-to-all"
            label="상기 내용 전체 동의"
            checked={data.agreeToAll}
            onChange={handleAgreeToAllChange}
          />
        </div>
        <p className="text-sm text-red-600">본인은 교육내용에 대해 충분히 이해하였으며 모두 준수할 것을 동의합니다. 상기 사항 관련 문제 발생 시 본인이 모든 책임을 질 것을 동의합니다.</p>
        <Input 
          label="성명"
          type="text"
          value={data.name}
          onChange={e => updateData({ name: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">서명</label>
          <SignaturePad onEnd={(sig) => updateData({ signature: sig })} signatureDataUrl={data.signature} />
        </div>
      </div>
    </Card>
  );
};