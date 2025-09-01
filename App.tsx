import React, { useState, useCallback } from 'react';
import { Step, FormData, ProjectInfo, SafetyTraining, RiskAssessment, WorkPermit, SafetyPledge } from './types';
import { Stepper } from './components/Stepper';
import { Button } from './components/ui/Button';
import { Step1ProjectInfo } from './components/Step1ProjectInfo';
import { Step2SafetyTraining } from './components/Step2SafetyTraining';
import { Step3RiskAssessment } from './components/Step3RiskAssessment';
import { Step4WorkPermit } from './components/Step4WorkPermit';
import { Step5SafetyPledge } from './components/Step5SafetyPledge';
import { Step6Confirmation } from './components/Step6Confirmation';

const initialFormData: FormData = {
  projectInfo: { location: '', locationOther: '', constructionName: '', companyName: '', contactPerson: '' },
  safetyTraining: { completed: false, completionDate: null },
  riskAssessment: [],
  workPermit: { type: '', workDate: '', workStartTime: '', workEndTime: '', location: '', description: '', workerCount: 1, hasProcedureDoc: false, hasRiskAssessment: false, safetyChecks: [] },
  safetyPledge: { agreements: {}, agreeToAll: false, name: '', signature: '' }
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.ProjectInfo);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateProjectInfo = useCallback((field: keyof ProjectInfo, value: string) => {
    setFormData(prev => ({ ...prev, projectInfo: { ...prev.projectInfo, [field]: value } }));
  }, []);

  const updateSafetyTraining = useCallback((field: keyof SafetyTraining, value: boolean | Date | null) => {
    setFormData(prev => ({ ...prev, safetyTraining: { ...prev.safetyTraining, [field]: value } }));
  }, []);
  
  const setRiskAssessment = useCallback((data: RiskAssessment) => {
    setFormData(prev => ({ ...prev, riskAssessment: data }));
  }, []);

  const updateWorkPermit = useCallback((data: Partial<WorkPermit>) => {
    setFormData(prev => ({ ...prev, workPermit: { ...prev.workPermit, ...data }}));
  }, []);

  const updateSafetyPledge = useCallback((data: Partial<SafetyPledge>) => {
    setFormData(prev => ({...prev, safetyPledge: { ...prev.safetyPledge, ...data }}));
  }, []);


  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, Step.Submitted));
    } else {
        alert("계속하기 전에 모든 필수 항목을 입력해주세요.");
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, Step.ProjectInfo));
  };
  
  const handleSubmit = () => {
    console.log("Form Submitted", formData);
    // Here you would typically send the data to a server
    setCurrentStep(Step.Submitted);
  }

  const isStepValid = (): boolean => {
    switch (currentStep) {
        case Step.ProjectInfo: {
            const { location, locationOther, constructionName, companyName, contactPerson } = formData.projectInfo;
            const isLocationValid = location === '기타' ? !!locationOther : !!location;
            return isLocationValid && !!constructionName && !!companyName && !!contactPerson;
        }
        case Step.SafetyTraining:
            return formData.safetyTraining.completed;
        case Step.RiskAssessment:
            return formData.riskAssessment.every(item => item.location && item.task && item.hazard && item.reductionMeasures);
        case Step.WorkPermit: {
            const { type, workDate, workStartTime, workEndTime, location, description, workerCount } = formData.workPermit;
            return !!type && !!workDate && !!workStartTime && !!workEndTime && !!location && !!description && workerCount > 0;
        }
        case Step.SafetyPledge:
            return formData.safetyPledge.agreeToAll && !!formData.safetyPledge.name && !!formData.safetyPledge.signature;
        case Step.Confirmation:
            return true;
        default:
            return false;
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case Step.ProjectInfo:
        return <Step1ProjectInfo data={formData.projectInfo} updateData={updateProjectInfo} />;
      case Step.SafetyTraining:
        return <Step2SafetyTraining data={formData.safetyTraining} updateData={updateSafetyTraining} />;
      case Step.RiskAssessment:
        return <Step3RiskAssessment data={formData.riskAssessment} setData={setRiskAssessment} />;
      case Step.WorkPermit:
        return <Step4WorkPermit data={formData.workPermit} updateData={updateWorkPermit} />;
      case Step.SafetyPledge:
        return <Step5SafetyPledge data={formData.safetyPledge} updateData={updateSafetyPledge} />;
      case Step.Confirmation:
        return <Step6Confirmation data={formData} />;
      case Step.Submitted:
        return (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">제출 완료</h3>
            <p className="mt-2 text-sm text-gray-500">안전 관련 서류가 검토를 위해 제출되었습니다. 결과는 별도로 통보될 것입니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-4">
          <img src="https://www.ckdpharm.com/en/company/ci_img01.png" alt="Chong Kun Dang" className="h-10"/>
          <h1 className="text-2xl font-bold text-slate-900">적격 수급업체 안전 평가 시스템</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currentStep < Step.Submitted && (
            <div className="mb-12 flex justify-center">
                <Stepper currentStep={currentStep} />
            </div>
        )}
        
        {renderStep()}

        {currentStep < Step.Submitted && (
          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={handlePrev} disabled={currentStep === Step.ProjectInfo}>
              이전
            </Button>
            {currentStep === Step.Confirmation ? (
                 <Button onClick={handleSubmit}>제출하기</Button>
            ) : (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                    다음
                </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;