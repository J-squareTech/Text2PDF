import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Languages,
  MessageSquare,
  ArrowRight,
  Check,
  RefreshCw,
  Copy,
  AlertCircle,
  FilePlus,
  Send,
} from 'lucide-react';
import { DocumentModel } from '../../types/document';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: DocumentModel;
  onReplaceContent: (newContent: string) => void;
  onAppendContent: (content: string) => void;
  initialSelectedText?: string;
}

type AITab = 'generate' | 'transform' | 'translate' | 'chat';

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onReplaceContent,
  onAppendContent,
  initialSelectedText = '',
}) => {
  const [activeTab, setActiveTab] = useState<AITab>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tab 1: Generation State
  const [prompt, setPrompt] = useState(
    'Create a 3-page business proposal for an automated poultry farming facility in Cameroon seeking 10,000,000 FCFA in funding'
  );
  const [docType, setDocType] = useState('Business Proposal');
  const [tone, setTone] = useState('Professional & Persuasive');
  const [generatedDoc, setGeneratedDoc] = useState('');

  // Tab 2: Transform State
  const [transformText, setTransformText] = useState(initialSelectedText || '');
  const [transformAction, setTransformAction] = useState('rewrite-professional');
  const [customInstruction, setCustomInstruction] = useState('');
  const [transformResult, setTransformResult] = useState('');

  // Tab 3: Translation State
  const [targetLanguage, setTargetLanguage] = useState('French');
  const [translationResult, setTranslationResult] = useState('');

  // Tab 4: Q&A Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'What is the main objective of this document?',
      a: 'This document presents the commercial and technical expansion plan, detailing capital allocation, production cycle metrics, and market demand analysis.',
    },
  ]);

  if (!isOpen) return null;

  // Handle Prompt -> Document Generation
  const handleGenerateDocument = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          documentType: docType,
          tone,
          length: 'medium-comprehensive',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Document generation failed');
      setGeneratedDoc(data.content);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to communicate with AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Transform Text
  const handleTransform = async (actionOverride?: string) => {
    const textToTransform = transformText.trim() || currentDoc.content;
    if (!textToTransform) {
      setErrorMessage('Please provide text to transform.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const act = actionOverride || transformAction;
    try {
      const res = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTransform,
          action: act,
          instruction: customInstruction,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transformation failed');
      setTransformResult(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to transform text.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Translation
  const handleTranslate = async () => {
    const textToTranslate = transformText.trim() || currentDoc.content;
    if (!textToTranslate) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          action: 'translate',
          targetLanguage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      setTranslationResult(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to translate document.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Chat / Document Q&A
  const handleChat = async () => {
    if (!chatQuestion.trim()) return;
    const q = chatQuestion;
    setChatQuestion('');
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContent: currentDoc.content,
          userQuestion: q,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setChatHistory((prev) => [...prev, { q, a: data.answer }]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to answer question.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">AI Document Intelligence</h2>
            <p className="text-[11px] text-slate-500">Gemini 3.8 Flash Document Engine</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 text-xs font-medium">
        <button
          id="tab-ai-generate"
          onClick={() => { setActiveTab('generate'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'generate'
              ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>Generate</span>
        </button>

        <button
          id="tab-ai-transform"
          onClick={() => { setActiveTab('transform'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'transform'
              ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Polish</span>
        </button>

        <button
          id="tab-ai-translate"
          onClick={() => { setActiveTab('translate'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'translate'
              ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>Translate</span>
        </button>

        <button
          id="tab-ai-chat"
          onClick={() => { setActiveTab('chat'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Q&A</span>
        </button>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="flex-1">{errorMessage}</p>
        </div>
      )}

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700">
        {/* TAB 1: GENERATE FROM PROMPT */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Describe the Document You Want to Create
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Create a 5-page commercial expansion proposal for an organic cocoa cooperative..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Prompt Starters */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Starters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Poultry Farm Funding Proposal (10M FCFA)',
                  'Freelance Cloud Engineering Contract',
                  'Academic Thesis on Green Energy',
                  'Bilingual Quotation & Proforma Invoice',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setPrompt(`Create a professional ${preset}`)}
                    className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded text-slate-600 transition-colors text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Attributes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Format</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-8 border border-slate-200 rounded-md bg-white px-2 text-xs"
                >
                  <option value="Business Proposal">Business Proposal</option>
                  <option value="Formal Contract">Formal Contract</option>
                  <option value="Commercial Invoice">Commercial Invoice</option>
                  <option value="Academic Paper">Academic Paper</option>
                  <option value="Executive Resume">Executive Resume</option>
                  <option value="Meeting Minutes">Meeting Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tone & Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full h-8 border border-slate-200 rounded-md bg-white px-2 text-xs"
                >
                  <option value="Professional & Persuasive">Professional & Persuasive</option>
                  <option value="Authoritative Legal">Authoritative Legal</option>
                  <option value="Academic & Rigorous">Academic & Rigorous</option>
                  <option value="Concise Executive">Concise Executive</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              id="btn-generate-ai-doc"
              onClick={handleGenerateDocument}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-sm shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Complete Document</span>
                </>
              )}
            </button>

            {/* Generated Output Preview */}
            {generatedDoc && (
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Generated Result</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onReplaceContent(generatedDoc)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Use as Document
                    </button>
                    <button
                      onClick={() => onAppendContent(`\n\n${generatedDoc}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                    >
                      Append
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {generatedDoc}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POLISH & TRANSFORM */}
        {activeTab === 'transform' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">Source Text</label>
                <button
                  onClick={() => setTransformText(currentDoc.content)}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Load Entire Document
                </button>
              </div>
              <textarea
                value={transformText}
                onChange={(e) => setTransformText(e.target.value)}
                rows={4}
                placeholder="Highlight text in the editor, or paste content here..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Action buttons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Select Transformation
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rewrite-professional', label: 'Make Professional' },
                  { id: 'fix-grammar', label: 'Fix Grammar & Typos' },
                  { id: 'simplify', label: 'Simplify & Clarify' },
                  { id: 'summarize', label: 'Summarize Key Points' },
                  { id: 'expand', label: 'Expand with Details' },
                  { id: 'extract-table', label: 'Convert to Table' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTransformAction(item.id);
                      handleTransform(item.id);
                    }}
                    disabled={isLoading}
                    className="p-2 text-left border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instruction */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Custom Instruction</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="e.g. Add Cameroon tax rates (19.25% VAT)"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleTransform('custom')}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-md font-semibold text-xs hover:bg-indigo-700"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Transform Result */}
            {transformResult && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Transformed Text</span>
                  <button
                    onClick={() => onReplaceContent(transformResult)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply Revision</span>
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs whitespace-pre-wrap">
                  {transformResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSLATION */}
        {activeTab === 'translate' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-800 mb-1.5">Target Language</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { lang: 'French', label: 'Français (French)' },
                  { lang: 'English', label: 'English' },
                  { lang: 'Spanish', label: 'Español (Spanish)' },
                  { lang: 'German', label: 'Deutsch (German)' },
                  { lang: 'Portuguese', label: 'Português' },
                  { lang: 'Swahili', label: 'Kiswahili' },
                ].map((item) => (
                  <button
                    key={item.lang}
                    onClick={() => setTargetLanguage(item.lang)}
                    className={`p-2 rounded-lg border text-left font-medium transition-all ${
                      targetLanguage === item.lang
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating Document...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5" />
                  <span>Translate to {targetLanguage}</span>
                </>
              )}
            </button>

            {translationResult && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Translated Document ({targetLanguage})</span>
                  <button
                    onClick={() => onReplaceContent(translationResult)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium"
                  >
                    Replace Document
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] whitespace-pre-wrap">
                  {translationResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Q&A / DOCUMENT ANALYSIS */}
        {activeTab === 'chat' && (
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-medium ml-4">
                    {item.q}
                  </div>
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-950 mr-4">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center space-x-1.5">
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask anything about this document..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleChat}
                disabled={isLoading || !chatQuestion.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
