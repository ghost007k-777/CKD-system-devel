import React from 'react';
import { WorkPermit } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';
import { WORK_PERMIT_SAFETY_CHECKS } from '../constants';

interface Step4Props {
  data: WorkPermit;
  updateData: (data: Partial<WorkPermit>) => void;
}

export const Step4WorkPermit: React.FC<Step4Props> = ({ data, updateData }) => {
  const handleCheckChange = (check: string) => {
    const newChecks = data.safetyChecks.includes(check)
      ? data.safetyChecks.filter(c => c !== check)
      : [...data.safetyChecks, check];
    updateData({ safetyChecks: newChecks });
  };
  
  return (
    <Card>
      <CardHeader
        title="작업 허가서"
        description="작업 허가서 발급을 위해 세부 정보를 작성해주세요."
      />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">작업 유형</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="workType" value="general" checked={data.type === 'general'} onChange={e => updateData({ type: e.target.value as 'general' | 'hazardous'})} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span className="ml-2">일반</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="workType" value="hazardous" checked={data.type === 'hazardous'} onChange={e => updateData({ type: e.target.value as 'general' | 'hazardous'})} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span className="ml-2">위험</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="workDate"
            label="작업일자"
            type="date"
            value={data.workDate}
            onChange={e => updateData({ workDate: e.target.value })}
            required
          />
          <Input
            id="workStartTime"
            label="시작 시간"
            type="time"
            value={data.workStartTime}
            onChange={e => updateData({ workStartTime: e.target.value })}
            required
          />
          <Input
            id="workEndTime"
            label="종료 시간"
            type="time"
            value={data.workEndTime}
            onChange={e => updateData({ workEndTime: e.target.value })}
            required
          />
        </div>
        <Input
          id="workLocation"
          label="작업장소"
          type="text"
          value={data.location}
          onChange={e => updateData({ location: e.target.value })}
          required
        />
        <Input
          id="workDescription"
          label="작업내용"
          type="text"
          value={data.description}
          onChange={e => updateData({ description: e.target.value })}
          required
        />
        <Input
          id="workerCount"
          label="작업인원"
          type="number"
          min="1"
          value={data.workerCount}
          onChange={e => updateData({ workerCount: parseInt(e.target.value) || 0 })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">첨부서류</label>
          <div className="flex space-x-4">
            <Checkbox id="hasProcedureDoc" label="작업절차서" checked={data.hasProcedureDoc} onChange={e => updateData({ hasProcedureDoc: e.target.checked })} />
            <Checkbox id="hasRiskAssessment" label="위험성평가" checked={data.hasRiskAssessment} onChange={e => updateData({ hasRiskAssessment: e.target.checked })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">안전조치 확인사항</label>
          <div className="space-y-2 mt-2 p-4 border rounded-md">
            {WORK_PERMIT_SAFETY_CHECKS.map(check => (
              <Checkbox key={check} id={check} label={check} checked={data.safetyChecks.includes(check)} onChange={() => handleCheckChange(check)} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};