import React, { useState } from 'react';
import { RiskAssessment, RiskItem } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { analyzeImageForRisks, ImageAnalysisResult } from '../services/geminiService';
import { Spinner } from './ui/Spinner';

interface Step3Props {
  data: RiskAssessment;
  setData: (data: RiskAssessment) => void;
}

const RiskRow: React.FC<{ item: RiskItem; onUpdate: (item: RiskItem) => void; onRemove: (id: string) => void }> = ({ item, onUpdate, onRemove }) => {
  const riskScore = item.likelihood * item.severity;
  const riskColor = riskScore >= 9 ? 'bg-red-100' : riskScore >= 4 ? 'bg-yellow-100' : 'bg-green-100';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg ${riskColor}`}>
      <Input label="장소명(공정명)" value={item.location} onChange={e => onUpdate({ ...item, location: e.target.value })} />
      <Input label="세부작업명" value={item.task} onChange={e => onUpdate({ ...item, task: e.target.value })} />
      <div className="md:col-span-2">
        <Input label="유해·위험요인" value={item.hazard} onChange={e => onUpdate({ ...item, hazard: e.target.value })} />
      </div>
      <div className="md:col-span-2">
         <Input label="현재 안전보건조치" value={item.safetyMeasures} onChange={e => onUpdate({ ...item, safetyMeasures: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">가능성 (1-5)</label>
          <input type="number" min="1" max="5" value={item.likelihood} onChange={e => onUpdate({ ...item, likelihood: parseInt(e.target.value) || 1 })} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">중대성 (1-5)</label>
          <input type="number" min="1" max="5" value={item.severity} onChange={e => onUpdate({ ...item, severity: parseInt(e.target.value) || 1 })} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900" />
        </div>
        <div className="text-center p-2 rounded-md bg-white">
          <div className="text-sm text-gray-500">위험성</div>
          <div className="font-bold text-lg">{riskScore}</div>
        </div>
      </div>
      <Input label="위험성 감소대책" value={item.reductionMeasures} onChange={e => onUpdate({ ...item, reductionMeasures: e.target.value })} />
      <div className="md:col-span-2 text-right">
        <Button variant="danger" onClick={() => onRemove(item.id)}>삭제</Button>
      </div>
    </div>
  );
};

export const Step3RiskAssessment: React.FC<Step3Props> = ({ data, setData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const result: ImageAnalysisResult = await analyzeImageForRisks(file);
      const newItems: RiskItem[] = result.hazards.map(hazard => ({
        id: crypto.randomUUID(),
        location: '이미지 분석 결과',
        task: result.workType,
        hazard: hazard,
        safetyMeasures: '',
        likelihood: 3,
        severity: 3,
        reductionMeasures: '',
      }));
      setData([...data, ...newItems]);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const addRow = () => {
    setData([
      ...data,
      {
        id: crypto.randomUUID(),
        location: '', task: '', hazard: '', safetyMeasures: '',
        likelihood: 1, severity: 1, reductionMeasures: ''
      }
    ]);
  };

  const updateRow = (updatedItem: RiskItem) => {
    setData(data.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const removeRow = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <Card>
      <CardHeader
        title="위험성 평가"
        description="잠재적 위험 요소를 식별하고 완화 조치를 작성합니다. AI 지원 분석을 위해 이미지를 업로드할 수 있습니다."
      />
      <div className="mb-6 p-4 border rounded-lg bg-slate-50">
        <h3 className="font-semibold text-gray-800 mb-2">AI 기반 위험 요소 탐지</h3>
        <p className="text-sm text-gray-600 mb-3">작업 현장 사진을 업로드하면 AI가 평가에 포함할 잠재적 위험을 제안합니다.</p>
        <div className="flex items-center space-x-4">
          <Button as="label" variant="secondary" className="cursor-pointer">
            <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
            {isLoading ? '분석 중...' : '이미지 업로드'}
          </Button>
          {isLoading && <Spinner/>}
          {fileName && !isLoading && <span className="text-sm text-gray-500">{fileName}</span>}
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="space-y-6">
        {data.map(item => <RiskRow key={item.id} item={item} onUpdate={updateRow} onRemove={removeRow} />)}
        <Button onClick={addRow}>위험 항목 추가</Button>
      </div>
    </Card>
  );
};