import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/Button';

// Developer Note: This component requires the 'react-signature-canvas' library.
// Please install it and its types:
// npm install react-signature-canvas
// npm install @types/react-signature-canvas

interface SignaturePadProps {
  onEnd: (signature: string) => void;
  signatureDataUrl: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, signatureDataUrl }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onEnd('');
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      onEnd(sigCanvas.current.toDataURL('image/png'));
    }
  };

  return (
    <div>
      <div className="border border-gray-300 rounded-md">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ className: 'w-full h-48' }}
          onEnd={handleEnd}
        />
      </div>
      <div className="mt-2 text-right">
        <Button type="button" variant="secondary" onClick={clear} disabled={!signatureDataUrl}>
          서명 지우기
        </Button>
      </div>
    </div>
  );
};