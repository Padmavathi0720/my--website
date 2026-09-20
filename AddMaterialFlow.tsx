import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Scale, 
  Cpu, 
  Layers, 
  ShieldAlert,
  AlertTriangle,
  Bluetooth,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialCategory, AiVisionResult } from '../types';
import { analyzeMaterialPhoto } from '../services/aiService';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface AddMaterialFlowProps {
  onComplete: (draftLot: any) => void;
  onCancel: () => void;
}

export const AddMaterialFlow: React.FC<AddMaterialFlowProps> = ({ onComplete, onCancel }) => {
  const { language, speakText } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'
  );
  const [category, setCategory] = useState<MaterialCategory>('E-waste');
  const [weight, setWeight] = useState<number>(12);
  const [isScaleConnecting, setIsScaleConnecting] = useState(false);
  const [scaleConnected, setScaleConnected] = useState(false);

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiVisionResult | null>(null);

  // Sample Scrap Photos for quick selection
  const samplePhotos = [
    {
      title: 'E-Waste (Motherboards & PCBs)',
      cat: 'E-waste' as MaterialCategory,
      url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Circuit Boards (Grade A/B)',
      cat: 'E-waste' as MaterialCategory,
      url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Plastic HDPE Containers',
      cat: 'Plastic' as MaterialCategory,
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Copper Wire & Metal Scrap',
      cat: 'Metal' as MaterialCategory,
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categories: { id: MaterialCategory; label: string; sub: string; icon: any }[] = [
    { 
      id: 'E-waste', 
      label: language === 'ta' ? 'E-waste (மின்னணுக் கழிவு)' : language === 'hi' ? 'E-waste (इलेक्ट्रॉनिक)' : language === 'mr' ? 'E-waste (इलेक्ट्रॉनिक)' : 'E-waste (Electronics)', 
      sub: 'PCBs, phones, cables, adaptors (Verified E-waste)', 
      icon: Cpu 
    },
    { 
      id: 'Plastic', 
      label: language === 'ta' ? 'Plastic (பிளாஸ்டிக்)' : language === 'hi' ? 'Plastic (प्लास्टिक)' : language === 'mr' ? 'Plastic (प्लॅस्टिक)' : 'Plastic (Rigid & Bottles)', 
      sub: 'HDPE, PET bottles, rigid buckets', 
      icon: Layers 
    },
    { 
      id: 'Metal', 
      label: language === 'ta' ? 'Metal (உலோகம் / இரும்பு)' : language === 'hi' ? 'Metal (लोहा / तांबा)' : language === 'mr' ? 'Metal (लोखंड / तांबे)' : 'Metal (Copper / Iron / Brass)', 
      sub: 'Copper, aluminium, brass, iron', 
      icon: Scale 
    },
    { 
      id: 'Paper', 
      label: language === 'ta' ? 'Paper (காகிதம் / அட்டை)' : language === 'hi' ? 'Paper (कागज / रद्दी)' : language === 'mr' ? 'Paper (कागद / रद्दी)' : 'Paper & Cardboard', 
      sub: 'Cardboard, newspapers, office raddi', 
      icon: Layers 
    },
  ];

  const weightPresets = [5, 10, 12, 15, 20, 25, 50];

  const handleSimulateScale = () => {
    setIsScaleConnecting(true);
    speakText({
      en: 'Connecting to wireless Bluetooth scale',
      ta: 'புளூடூத் எடையிடும் கருவியுடன் இணைக்கப்படுகிறது',
      hi: 'वायरलेस ब्लूटूथ कांटे से कनेक्ट हो रहा है',
      mr: 'वायरलेस ब्लूटूथ काट्याशी जोडले जात आहे',
    });
    setTimeout(() => {
      setIsScaleConnecting(false);
      setScaleConnected(true);
      setWeight(12.45);
      speakText({
        en: 'Weight recorded: 12.45 kilograms',
        ta: 'எடை பதிவு செய்யப்பட்டது: 12.45 கிலோகிராம்',
        hi: 'वजन दर्ज किया गया: 12.45 किलोग्राम',
        mr: 'वजन नोंदवले गेले: 12.45 किलोग्राम',
      });
    }, 1200);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setStep(4);
    const result = await analyzeMaterialPhoto(category);
    setAiResult(result);
    setIsAnalyzing(false);
    speakText({
      en: `AI detected ${result.detectedName} with ${result.confidence} percent confidence.`,
      ta: `ஏஐ ${result.confidence}% துல்லியத்துடன் ${result.detectedName} என அடையாளம் கண்டுள்ளது.`,
      hi: `एआई ने ${result.confidence}% विश्वसनीयता के साथ ${result.detectedName} की पहचान की।`,
      mr: `एआयने ${result.confidence}% अचूकतेसह ${result.detectedName} ची ओळख पटवली.`,
    });
  };

  const handleProceedToPrice = () => {
    const draft = {
      material: category,
      subCategory: aiResult?.detectedName || `${category} scrap lot`,
      weightKg: weight,
      photoUrl,
      aiDetected: aiResult?.detectedName || `${category} verified scrap`,
      aiConfidence: aiResult?.confidence || 88,
      alternativeOptions: aiResult?.alternativeOptions || [],
      estimatedPriceMin: Math.round((aiResult?.suggestedPriceMin || 280) * weight),
      estimatedPriceMax: Math.round((aiResult?.suggestedPriceMax || 340) * weight),
      finalPricePerKg: Math.round(((aiResult?.suggestedPriceMin || 280) + (aiResult?.suggestedPriceMax || 340)) / 2),
    };
    onComplete(draft);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 pb-16">
      {/* Step Header */}
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={step === 1 ? onCancel : () => setStep((s) => (s - 1) as any)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-900">
              {step === 1 && 'Step 1: Take Scrap Photo'}
              {step === 2 && 'Step 2: Material Category'}
              {step === 3 && 'Step 3: Approximate Weight'}
              {step === 4 && 'Step 4: AI Identification'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Step {step} of 4 • E-Waste Formalization
            </p>
          </div>
        </div>

        <AudioReadoutButton
          text={
            step === 1
              ? audioScripts.addMaterialStep1
              : step === 2
              ? audioScripts.addMaterialStep2
              : step === 3
              ? audioScripts.addMaterialStep3
              : audioScripts.addMaterialStep4(
                  aiResult?.detectedName || category,
                  aiResult?.confidence || 88,
                  Math.round(weight * 280),
                  Math.round(weight * 340)
                )
          }
          label="Listen"
        />
      </div>

      {/* Step Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 flex">
        <div className={`h-full bg-emerald-700 transition-all ${
          step === 1 ? 'w-1/4' : step === 2 ? 'w-2/4' : step === 3 ? 'w-3/4' : 'w-full'
        }`} />
      </div>

      {/* Main Flow Content */}
      <div className="p-5 flex-1 space-y-4 overflow-y-auto">
        {/* STEP 1: PHOTO */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-4/3 border-2 border-slate-300 shadow-md flex items-center justify-center">
              <img
                src={photoUrl}
                alt="Scrap Lot"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Camera Preview
                </span>
                <p className="text-xs text-slate-200">
                  Hold steady with clear lighting to help AI assess grade.
                </p>
              </div>
            </div>

            {/* Photo Action Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  speakText({
                    en: 'Camera activated. Take a photo of the scrap.',
                    ta: 'கேமரா இயக்கப்பட்டது. கழிவுப் பொருளின் புகைப்படத்தை எடுக்கவும்.',
                    hi: 'कैमरा शुरू हो गया। कबाड़ की फोटो लें।',
                    mr: 'कॅमेरा सुरू झाला. भंगाराचा फोटो काढा.',
                  });
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Retake Photo
              </button>
              <label className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPhotoUrl(url);
                    }
                  }}
                />
              </label>
            </div>

            {/* Quick Demo Photo Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                Or pick a sample scrap batch for presentation:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {samplePhotos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(p.url);
                      setCategory(p.cat);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                      photoUrl === p.url ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-600/30' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <img src={p.url} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <span className="font-bold text-slate-800 text-[11px] leading-tight truncate">
                      {p.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
            >
              <span>Next: Select Category</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: CATEGORY */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
              <span className="font-extrabold text-emerald-950 block">
                ⭐ Priority Focus: Informal E-waste Formalization
              </span>
              <p className="text-emerald-800 mt-0.5">
                E-waste carries the highest health risks if dismantled informally, and the highest formal recovery value.
              </p>
            </div>

            <div className="space-y-2.5">
              {categories.map((c) => {
                const isSelected = category === c.id;
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 shadow-md ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-base font-extrabold text-slate-900 block">
                          {c.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {c.sub}
                        </span>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-emerald-700 text-white' : 'border-2 border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
            >
              <span>Next: Enter Weight</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: WEIGHT */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Weight numeric display */}
            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 text-center shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Approximate Scrap Lot Weight
              </span>

              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="text-4xl font-black text-slate-900 w-36 text-center border-b-2 border-emerald-600 focus:outline-none"
                />
                <span className="text-2xl font-black text-slate-400">kg</span>
              </div>

              <p className="text-xs text-slate-500 font-medium pt-1">
                Final weight will be verified at the recycler weighbridge or doorstep digital scale.
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Weight Selection (kg):
              </span>
              <div className="flex flex-wrap gap-2">
                {weightPresets.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-colors ${
                      weight === w
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Bluetooth Scale Simulation */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-white block">
                    Bluetooth Smart Scale
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {scaleConnected ? 'Scale Paired: 12.45 kg' : 'Auto-read from calibrated scale'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateScale}
                disabled={isScaleConnecting}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                {isScaleConnecting ? 'Connecting...' : scaleConnected ? 'Re-sync' : 'Pair Scale'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleRunAiAnalysis}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Analyze with AI Vision</span>
            </button>
          </div>
        )}

        {/* STEP 4: AI MATERIAL IDENTIFICATION & OVERRIDE */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            {isAnalyzing ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Analyzing Scrap Composition...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Detecting printed circuit board grade, copper content & hazardous components
                  </p>
                </div>
              </div>
            ) : aiResult ? (
              <div className="space-y-4">
                {/* AI Result Card */}
                <div className="p-5 bg-white rounded-3xl border-2 border-emerald-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" /> AI Verified Analysis
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Confidence: {aiResult.confidence}%
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Detected Scrap Grade
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {aiResult.detectedName}
                    </h3>
                  </div>

                  {/* Sub-components detected */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Subcomponents Identified:
                    </span>
                    {aiResult.subCategories.map((sub, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mandi Indicative Rate */}
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-600 font-medium">Indicative Mandi Band:</span>
                      <strong className="block text-emerald-950 text-sm font-black">
                        ₹{aiResult.suggestedPriceMin} - ₹{aiResult.suggestedPriceMax} / kg
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-600 font-medium">Lot Est. ({weight} kg):</span>
                      <strong className="block text-emerald-950 text-sm font-black">
                        ₹{(aiResult.suggestedPriceMin * weight).toLocaleString()} - ₹{(aiResult.suggestedPriceMax * weight).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Critical Safety Advisory */}
                  {aiResult.safetyAlert && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="font-medium">{aiResult.safetyAlert}</p>
                    </div>
                  )}
                </div>

                {/* Overriding Notice */}
                <div className="p-3 bg-slate-100 rounded-2xl text-xs text-slate-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Collector Authority:</strong> You are always in control. If AI detection is inaccurate, tap Override to change category.
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleProceedToPrice}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
                  >
                    <Check className="w-5 h-5" />
                    <span>CONFIRM MATERIAL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-extrabold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>OVERRIDE / CHANGE CATEGORY</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
