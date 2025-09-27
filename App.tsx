import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SectionCard } from './components/SectionCard';
import { Header } from './components/Header';
import { DocumentIcon } from './constants';
import { UnitPlan, UnitPlanData } from './data';
import { FileUpload } from './components/FileUpload';
import { ApiKeyInput } from './components/ApiKeyInput';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [unitPlans, setUnitPlans] = useState<UnitPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      facilitator: { type: Type.STRING },
      curriculum: { 
        type: Type.OBJECT,
        properties: {
          journey: { type: Type.STRING },
          year: { type: Type.STRING },
          department: { type: Type.STRING },
          impactTitle: { type: Type.STRING },
          fellowResponsibility: { type: Type.STRING },
        }
      },
      objectives: {
        type: Type.OBJECT,
        properties: {
          intro: { type: Type.STRING },
          endGoal: { type: Type.STRING },
          points: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      },
      competencies: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      },
      crossCurricular: { type: Type.OBJECT, properties: { description: { type: Type.STRING } } },
      differentiation: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          levels: { type: Type.ARRAY, items: { type: Type.STRING } },
          notes: { type: Type.STRING },
        }
      },
      assessment: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          standard: { type: Type.STRING },
        }
      },
      prework: { type: Type.STRING },
      strategy: { type: Type.STRING },
      introduction: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }, // Simplified for initial extraction
          }
        }
      },
      activities: {
         type: Type.ARRAY,
         items: {
           type: Type.OBJECT,
           properties: {
             title: { type: Type.STRING },
             description: { type: Type.STRING },
           }
         }
      },
      faq: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          time: { type: Type.STRING },
        }
      },
      furtherReading: { type: Type.STRING },
      closure: {
        type: Type.OBJECT,
        properties: {
          duration: { type: Type.STRING },
          superpowerTitle: { type: Type.STRING },
          superpowerQuestion: { type: Type.STRING },
        }
      },
      feedbackOnPlan: { type: Type.STRING },
      sessionFeedback: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          attachments: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      },
    }
  };


  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !apiKey) return;
    setIsLoading(true);
    setError(null);
    const newPlans: UnitPlan[] = [];
    const ai = new GoogleGenAI({ apiKey });

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // remove the "data:image/jpeg;base64," part
            resolve(base64data.substring(base64data.indexOf(',') + 1));
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    };

    try {
      for (const file of Array.from(files)) {
        const base64Data = await blobToBase64(file);
        const imagePart = {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        };
        const textPart = {
          text: `Extract the text from this unit plan document and structure it as JSON. The document contains sections like 'Session Facilitator(s)', 'Curriculum Standard (s)', 'Breakdown of Objectives', 'TFQ Fellow Competencies', etc. Please parse all text content and organize it according to the provided schema. For sections like introduction and activities that have complex structures, extract the main title and description text for now.`
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });
        
        const jsonString = response.text.replace(/^```json\n/, '').replace(/\n```$/, '');
        const parsedData = JSON.parse(jsonString) as UnitPlanData;
        
        const newPlan: UnitPlan = {
            id: file.name + Date.now(),
            fileName: file.name,
            data: parsedData
        };
        newPlans.push(newPlan);
      }
      
      const allPlans = [...unitPlans, ...newPlans];
      setUnitPlans(allPlans);
      if (!selectedPlanId && allPlans.length > 0) {
        setSelectedPlanId(allPlans[0].id);
      }

    } catch (err) {
        console.error("Error processing files:", err);
        setError("Failed to process one or more files. Please check your API key or try again.");
    } finally {
        setIsLoading(false);
    }
  };


  const handleDownloadCSV = () => {
    if (unitPlans.length === 0) return;

    const escapeCsvCell = (cell: string | undefined) => {
      if (cell === undefined) return '';
      if (/[",\n]/.test(cell)) {
        const escapedCell = cell.replace(/"/g, '""');
        return `"${escapedCell}"`;
      }
      return cell;
    };

    const sectionMappings = [
        { title: "Unit Plan Title", formatter: () => "Design Thinking Process" },
        { title: "Facilitator(s)", formatter: (d: UnitPlanData) => d.facilitator },
        { title: "Curriculum Standard(s)", formatter: (d: UnitPlanData) => `${d.curriculum.journey}\n${d.curriculum.year}\n${d.curriculum.department}\n${d.curriculum.impactTitle}: ${d.curriculum.fellowResponsibility}` },
        { title: "Breakdown of Objectives", formatter: (d: UnitPlanData) => `${d.objectives.intro}\n${d.objectives.endGoal}\n${d.objectives.points.map((p, i) => `${i+1}. ${p}`).join('\n')}` },
        { title: "TFQ Fellow Competencies", formatter: (d: UnitPlanData) => `${d.competencies.description}\n${d.competencies.items.join(', ')}` },
        { title: "Cross-curricular Links", formatter: (d: UnitPlanData) => d.crossCurricular.description },
        { title: "Differentiation of & for Learning", formatter: (d: UnitPlanData) => `${d.differentiation.description}\nLevels: ${d.differentiation.levels.join(', ')}\nNotes: ${d.differentiation.notes}` },
        { title: "Assessment", formatter: (d: UnitPlanData) => `${d.assessment.description}\nItems:\n${d.assessment.items.map(item => `- ${item}`).join('\n')}\nStandard: ${d.assessment.standard}` },
        { title: "Pre-work for Fellows", formatter: (d: UnitPlanData) => d.prework },
        { title: "Strategy taken from Fellows", formatter: (d: UnitPlanData) => d.strategy },
        { title: "Introduction", formatter: (d: UnitPlanData) => d.introduction.map(item => `${item.title}:\n${item.content}`).join('\n\n') },
        { title: "Activities", formatter: (d: UnitPlanData) => d.activities.map(item => `${item.title}:\n${item.description}`).join('\n\n') },
        { title: "Frequently Asked Questions", formatter: (d: UnitPlanData) => `${d.faq.description}\n${d.faq.time}` },
        { title: "Further reading", formatter: (d: UnitPlanData) => d.furtherReading },
        { title: "Closure", formatter: (d: UnitPlanData) => `${d.closure.duration}\n${d.closure.superpowerTitle}\n${d.closure.superpowerQuestion}` },
        { title: "Feedback on Plan", formatter: (d: UnitPlanData) => d.feedbackOnPlan },
        { title: "Session Feedback", formatter: (d: UnitPlanData) => `${d.sessionFeedback.description}\nAttachments:\n${d.sessionFeedback.attachments.join('\n')}` }
    ];

    const header = ['Section', ...unitPlans.map(p => p.fileName)].map(escapeCsvCell).join(',');

    const rows = sectionMappings.map(section => {
        const rowData = [
            section.title,
            ...unitPlans.map(plan => section.formatter(plan.data))
        ];
        return rowData.map(escapeCsvCell).join(',');
    });

    const csvContent = [header, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `all-unit-plans.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentPlan = unitPlans.find(p => p.id === selectedPlanId)?.data;

  if (!apiKey) {
    return <ApiKeyInput onSubmit={handleApiKeySubmit} />;
  }

  if (unitPlans.length === 0) {
     return <FileUpload onUpload={handleFileUpload} isLoading={isLoading} error={error} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        <Header 
            plans={unitPlans} 
            selectedPlanId={selectedPlanId} 
            onSelectPlan={setSelectedPlanId}
            onDownload={handleDownloadCSV} 
        />
        
        {currentPlan && (
            <main className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <SectionCard title="Session Facilitator(s)" className="md:col-span-2">
                    <p className="text-lg">{currentPlan.facilitator}</p>
                </SectionCard>

                <SectionCard title="Curriculum Standard (s)" arabicTitle="معايير المناهج">
                <div className="space-y-3">
                    <p className="font-semibold text-gray-700">{currentPlan.curriculum.journey}</p>
                    <p className="text-sm text-gray-600">{currentPlan.curriculum.year}</p>
                    <p className="text-sm text-gray-600">{currentPlan.curriculum.department}</p>
                    <p className="font-semibold text-gray-700 mt-2">{currentPlan.curriculum.impactTitle}</p>
                    <div className="flex items-start space-x-3 bg-gray-100 p-3 rounded-md">
                    <div className="flex-shrink-0 w-5 h-5 mt-1 bg-white border-2 border-blue-500 rounded-sm flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm">{currentPlan.curriculum.fellowResponsibility}</p>
                    </div>
                </div>
                </SectionCard>
                
                <SectionCard title="Breakdown of Objectives">
                <p className="text-sm text-gray-600 mb-4">{currentPlan.objectives.intro}</p>
                <p className="font-semibold mb-2">{currentPlan.objectives.endGoal}</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {currentPlan.objectives.points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ol>
                </SectionCard>

                <SectionCard title="TFQ Fellow Competencies">
                <p className="text-sm text-gray-600 mb-3">{currentPlan.competencies.description}</p>
                <ul className="list-disc list-inside space-y-1">
                    {currentPlan.competencies.items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                </SectionCard>
                
                <SectionCard title="Cross-curricular Links" arabicTitle="روابط عبر المناهج">
                <p className="text-sm text-gray-600">{currentPlan.crossCurricular.description}</p>
                </SectionCard>
                
                <SectionCard title="Differentiation of & for Learning">
                <p className="text-sm text-gray-600 mb-3">{currentPlan.differentiation.description}</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                    {currentPlan.differentiation.levels.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <h4 className="font-semibold text-gray-700">Notes</h4>
                <p className="text-sm text-gray-600 mt-1">{currentPlan.differentiation.notes}</p>
                </SectionCard>

                <SectionCard title="Assessment" arabicTitle="تقييم">
                <p className="text-sm text-gray-600 mb-3">{currentPlan.assessment.description}</p>
                <ul className="space-y-2">
                    {currentPlan.assessment.items.map((item, index) => (
                        <li key={index} className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full w-fit">{item}</li>
                    ))}
                </ul>
                    <p className="text-xs text-blue-600 mt-4 border-t pt-2">{currentPlan.assessment.standard}</p>
                </SectionCard>

                <SectionCard title="Pre-work for Fellows">
                    <p className="text-sm text-gray-600">{currentPlan.prework}</p>
                </SectionCard>
                
                <SectionCard title="Strategy taken from Fellows">
                    <p className="text-sm text-gray-600">{currentPlan.strategy}</p>
                </SectionCard>
                
                {/* Note: Simplified rendering for introduction and activities */}
                <SectionCard title="Introduction" arabicTitle="مقدمة" className="md:col-span-2">
                    <div className="space-y-6 whitespace-pre-line">
                        {currentPlan.introduction.map((item, index) => (
                             <div key={index}>
                               <h3 className="font-bold text-lg">{item.title}</h3>
                               <p>{typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
                
                <SectionCard title="Activities" arabicTitle="أنشطة" className="md:col-span-2">
                    <div className="space-y-8 whitespace-pre-line">
                         {currentPlan.activities.map((activity, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4">
                                <h3 className="font-bold text-xl">{activity.title}</h3>
                                <p>{activity.description}</p>
                            </div>
                         ))}
                    </div>
                </SectionCard>


                <SectionCard title="Frequently Asked Questions" arabicTitle="الأسئلة المكررة">
                <p className="text-sm text-gray-600 mb-2">{currentPlan.faq.description}</p>
                <p className="font-semibold">{currentPlan.faq.time}</p>
                </SectionCard>

                <SectionCard title="Further reading" arabicTitle="قراءة متعمقة">
                <p className="text-sm text-gray-600">{currentPlan.furtherReading}</p>
                </SectionCard>
                
                <SectionCard title="Closure" arabicTitle="خاتمة" className="md:col-span-2">
                <p className="font-semibold mb-2">{currentPlan.closure.duration}</p>
                <p className="font-bold text-gray-700">{currentPlan.closure.superpowerTitle}</p>
                <p className="text-sm text-gray-600 mb-4">{currentPlan.closure.superpowerQuestion}</p>
                <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Superpower:</span> __________________________________________________________________</p>
                    <p><span className="font-semibold">Reason:</span> ______________________________________________________________________</p>
                </div>
                </SectionCard>

                <SectionCard title="Feedback on Plan" className="md:col-span-2">
                    <p className="text-sm text-gray-600">{currentPlan.feedbackOnPlan}</p>
                </SectionCard>
                
                <SectionCard title="Session Feedback" className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-4">{currentPlan.sessionFeedback.description}</p>
                <div className="space-y-2">
                    {currentPlan.sessionFeedback.attachments.map((att, index) => (
                        <a key={index} href="#" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1.5 rounded-full">
                        <DocumentIcon/>
                        <span>{att}</span>
                        </a>
                    ))}
                </div>
                </SectionCard>

            </div>
            </main>
        )}
      </div>
    </div>
  );
};

export default App;
