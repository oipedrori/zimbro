import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Edit3 } from 'lucide-react';
import { analyzeTextWithGemini } from '../services/geminiService';
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';

const AiPanel = ({ isActive, onClose, onOpenManualModal }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiMessage, setAiMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const recognitionRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const transcriptRef = useRef(''); // To keep latest state for timeout

    const { addTx } = useTransactions(format(new Date(), 'yyyy-MM'));

    // Setup Speech Recognition
    useEffect(() => {
        // Verificar suporte da API nativa do navegador
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';

            recognition.onstart = () => {
                setIsListening(true);
                setSuggestionsVisible(false); // Esconde sugestões ao falar
            };

            recognition.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
                transcriptRef.current = currentTranscript;

                // Clear existing silence timeout
                if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

                // Set new timeout to autosubmit after 2 seconds of silence
                silenceTimeoutRef.current = setTimeout(() => {
                    if (transcriptRef.current.trim().length > 0 && !isProcessing) {
                        processTextRef.current(transcriptRef.current);
                    }
                }, 1500);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            };

            recognition.onend = () => {
                setIsListening(false);
                // Try to process if ended and we have transcript
                if (transcriptRef.current.trim().length > 0 && !isProcessing) {
                    processTextRef.current(transcriptRef.current);
                }
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Monitora mudança na prop isActive do bottom-nav para ligar o microfone automaticamente
    useEffect(() => {
        if (isActive) {
            setTranscript('');
            transcriptRef.current = '';
            setAiMessage('');
            setSuggestionsVisible(true);
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) { }
            } else {
                console.warn("Speech Recognition not supported in this browser.");
            }
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            setIsListening(false);
        }
    }, [isActive]);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            recognitionRef.current?.start();
        }
    };

    const handleManualAdd = () => {
        onClose();
        onOpenManualModal();
    };

    const processTextRef = useRef(null);

    // We update the ref implementation so the timer always calls the latest logic
    useEffect(() => {
        processTextRef.current = async (textToProcess) => {
            if (!textToProcess.trim() || isProcessing) return;

            recognitionRef.current?.stop();
            setIsListening(false);
            setIsProcessing(true);
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

            setAiMessage('Analisando...');

            try {
                const result = await analyzeTextWithGemini(textToProcess);

                if (result.error) {
                    setAiMessage(result.error);
                    setTranscript('');
                    transcriptRef.current = '';
                } else if (result.advice) {
                    setAiMessage(result.advice);
                    setTranscript('');
                    transcriptRef.current = '';
                } else if (result.isValid) {
                    const finalDate = result.date ? result.date : format(new Date(), 'yyyy-MM-dd');

                    await addTx({
                        type: result.type,
                        amount: parseFloat(result.amount),
                        description: result.description,
                        category: result.category,
                        date: finalDate,
                        repeatType: result.repeatType,
                        installments: result.installments || 1
                    });

                    // Confirmação de Sucesso Polida e Curta
                    const tipoTexto = result.type === 'income' ? 'Adicionado com sucesso' : 'Gasto registrado';
                    setAiMessage(`Tudo certo! ${tipoTexto}: ${result.description} (R$ ${result.amount}).`);

                    setTranscript('');
                    transcriptRef.current = '';

                    // Fecha sozinho depois de ler
                    setTimeout(() => onClose(), 2500);
                }
            } catch (err) {
                console.error(err);
                setAiMessage('Ocorreu um erro ao processar. Tente novamente.');
            } finally {
                setIsProcessing(false);
            }
        };
    }, [isProcessing, addTx, onClose]);

    const handleProcessManualClick = () => {
        if (transcriptRef.current.trim().length > 0 && !isProcessing) {
            processTextRef.current(transcriptRef.current);
        }
    };

    return (
        <div className={`ai-overlay ${isActive ? 'active' : ''}`}>
            <div className="ai-panel">

                {/* Header Options */}
                <div className="ai-header">
                    <button onClick={onClose} className="back-btn" aria-label="Voltar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    <div className="ai-title">
                        <div className="ai-icon-small">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6Z" /></svg>
                        </div>
                        <span>Assistente Financeiro IA</span>
                    </div>

                    <button onClick={handleManualAdd} className="avatar-btn" aria-label="Adição manual">
                        <Edit3 size={18} />
                    </button>
                </div>

                <div className="ai-body">
                    {aiMessage ? (
                        <div className="ai-system-message animate-fade-in">
                            <p>{aiMessage}</p>
                        </div>
                    ) : (
                        <>
                            {/* Transcript Display */}
                            <div className="transcript-area">
                                {transcript ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                                        <p className="spoken-text">{transcript}</p>
                                        {!isProcessing && !isListening && (
                                            <button className="send-transcript-btn" onClick={handleProcessManualClick}>
                                                Analisar
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <h2 className="ai-greeting">
                                        {isListening ? (
                                            <>Ouvindo<span className="dots">...</span></>
                                        ) : (
                                            <>Olá, como está seu<br />orçamento? <span className="highlight-text">Posso<br />ajudar com algo?</span></>
                                        )}
                                    </h2>
                                )}
                            </div>

                            {/* Suggestions Categories */}
                            <div className={`ai-suggestions-circular ${suggestionsVisible && !transcript && !aiMessage ? 'visible' : 'hidden'}`}>
                                <div className="sugg-circle sugg-secure">
                                    <div className="icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg></div>
                                    <span>Seguro</span>
                                </div>
                                <div className="sugg-circle sugg-invest">
                                    <div className="icon-wrapper"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
                                    <span>Investir</span>
                                </div>
                                <div className="sugg-circle sugg-plan">
                                    <div className="icon-wrapper"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                                    <span>Planejar</span>
                                </div>
                            </div>

                            {/* Central Mic/Aura at bottom */}
                            <div className="mic-container">
                                <div className={`aura ${isListening ? 'listening' : ''}`}></div>
                                <button className={`main-mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleListen} aria-label={isListening ? "Parar de ouvir" : "Ouvir"}>
                                    <Mic size={28} color="var(--primary-darkest)" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .ai-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0; 
          background: transparent; 
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 100;
          opacity: 0; pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .ai-overlay.active { opacity: 1; pointer-events: auto; }
        
        .ai-panel {
          width: 100%; height: 100%;
          background: transparent;
          display: flex; flex-direction: column;
          padding: 24px; padding-top: calc(24px + env(safe-area-inset-top, 20px));
          transform: translateY(20px); opacity: 0;
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ai-overlay.active .ai-panel { transform: translateY(0); opacity: 1; }
        
        /* Header Match */
        .ai-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 40px;
        }
        
        .back-btn {
          color: var(--primary-darker);
          padding: 8px; margin-left: -8px;
        }
        
        .ai-title {
          display: flex; align-items: center; gap: 8px;
          color: var(--primary-darkest); font-weight: 600; font-size: 0.95rem;
        }
        
        .ai-icon-small {
          color: var(--primary-color);
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px;
        }
        
        .avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--primary-darkest); color: white;
          display: flex; justify-content: center; align-items: center;
          overflow: hidden;
        }
        
        .ai-body {
          flex: 1; display: flex; flex-direction: column; 
          position: relative;
        }
        
        /* Typography Match */
        .transcript-area {
          margin-top: 40px; margin-bottom: auto;
          text-align: center; padding: 0 10px;
        }
        
        .ai-greeting { 
          font-family: 'Solway', serif;
          font-size: 2.2rem; 
          color: var(--primary-darkest); 
          font-weight: 700; 
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        
        .highlight-text {
          color: var(--primary-color);
          opacity: 0.9;
        }
        
        .spoken-text { 
           font-family: 'Solway', serif;
           font-size: 2rem; 
           color: var(--primary-darkest); 
           font-weight: 700; 
           line-height: 1.2; 
        }
        
        .ai-system-message {
           font-family: 'Solway', serif;
           font-size: 1.8rem;
           color: var(--primary-darkest);
           font-weight: 700;
           line-height: 1.3;
           text-align: center;
           margin-top: 40px;
           padding: 0 20px;
        }
        
        .dots {
          animation: blink 1.5s infinite both;
        }
        @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
        
        /* Circular Options */
        .ai-suggestions-circular {
          display: flex; justify-content: center; align-items: flex-end; gap: 16px;
          margin-bottom: 60px;
          transition: opacity 0.3s, transform 0.3s;
        }
        .ai-suggestions-circular.hidden { opacity: 0; pointer-events: none; transform: translateY(20px); }
        .ai-suggestions-circular.visible { opacity: 1; transform: translateY(0); }
        
        .sugg-circle {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          color: white; font-weight: 500; font-size: 0.95rem;
        }
        
        .sugg-secure .icon-wrapper {
          width: 80px; height: 80px; border-radius: 50%;
          background: var(--primary-darkest);
          display: flex; justify-content: center; align-items: center;
        }
        
        .sugg-invest .icon-wrapper {
          width: 100px; height: 100px; border-radius: 50%;
          background: var(--primary-dark);
          display: flex; justify-content: center; align-items: center;
          margin-bottom: 10px; /* Lift up the middle one slightly */
        }
        
        .sugg-plan .icon-wrapper {
          width: 80px; height: 80px; border-radius: 50%;
          background: var(--primary-color);
          display: flex; justify-content: center; align-items: center;
        }
        
        /* Bottom Organic Mic */
        .mic-container {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px; height: 80px;
          display: flex; justify-content: center; align-items: center;
        }
        
        .main-mic-btn {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
          z-index: 2; transition: transform 0.2s;
          display: flex; justify-content: center; align-items: center;
          color: white;
        }
        .main-mic-btn:active { transform: scale(0.95); }
        
        .aura {
          position: absolute;
          top: -30%; left: -30%; right: -30%; bottom: -30%;
          background: var(--primary-color);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          filter: blur(15px);
          opacity: 0.6;
          transition: all 0.4s ease;
          animation: organicIdle 8s ease-in-out infinite alternate;
          z-index: 1;
        }
        
        .aura.listening {
          background: #4ade80; /* lighter, glowing green */
          opacity: 0.85;
          filter: blur(20px);
          animation: organicGlow 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes organicIdle {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(0.9); }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 60%; transform: rotate(180deg) scale(1.1); }
        }
        
        @keyframes organicGlow {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: scale(1) rotate(0deg); opacity: 0.7; }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 60%; transform: scale(1.3) rotate(45deg); opacity: 1; }
        }
        
        .send-transcript-btn {
          background: var(--primary-darkest); color: white;
          padding: 14px 32px; border-radius: var(--border-radius-full);
          font-weight: 600; font-size: 1.1rem; 
          animation: slideUp 0.3s forwards;
          box-shadow: 0 4px 12px rgba(14, 34, 16, 0.2);
        }
      `}</style>
        </div>
    );
};

export default AiPanel;
