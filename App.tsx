
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { allExamSets } from './services/examGenerator';
import { 
  StudentInfo, 
  ExamSet, 
  QuestionType, 
  LeaderboardEntry 
} from './types';
import MathRenderer from './components/MathRenderer';
import VariationTable from './components/VariationTable';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'testing' | 'result'>('setup');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: '', className: '', examId: 1 });
  const [currentSet, setCurrentSet] = useState<ExamSet | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('math12_leaderboard');
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let timer: any;
    if (step === 'testing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'testing') {
      handleSubmitInternal();
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleStart = () => {
    if (!studentInfo.name.trim() || !studentInfo.className.trim()) {
      alert("Học sinh vui lòng nhập đầy đủ Họ tên và Lớp!");
      return;
    }
    const set = allExamSets.find(s => s.id === studentInfo.examId);
    setCurrentSet(set || allExamSets[0]);
    setStep('testing');
    setTimeLeft(3600);
    setUserAnswers({});
    setIsSubmitting(false);
  };

  const calculateScore = useCallback(() => {
    if (!currentSet) return 0;
    let total = 0;
    
    currentSet.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (q.type === QuestionType.MULTIPLE_CHOICE) {
        if (ans === q.correctOption) total += 0.25;
      } else if (q.type === QuestionType.TRUE_FALSE) {
        let correctParts = 0;
        q.trueFalseParts?.forEach(part => {
          if (ans?.[part.id] === part.correct) correctParts++;
        });
        if (correctParts === 1) total += 0.1;
        else if (correctParts === 2) total += 0.25;
        else if (correctParts === 3) total += 0.5;
        else if (correctParts === 4) total += 1.0;
      } else if (q.type === QuestionType.SHORT_ANSWER) {
        const cleanAns = String(ans || "").trim().replace(',', '.');
        const cleanCorrect = String(q.shortAnswerCorrect || "").trim().replace(',', '.');
        if (cleanAns === cleanCorrect && cleanAns !== "") total += 0.5;
      }
    });
    
    return Math.min(10, total);
  }, [currentSet, userAnswers]);

  const handleSubmitInternal = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    
    const newEntry: LeaderboardEntry = {
      name: studentInfo.name,
      className: studentInfo.className,
      score: finalScore,
      timeSpent: 3600 - timeLeft,
      timestamp: new Date().toISOString()
    };

    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 50);
    setLeaderboard(updated);
    localStorage.setItem('math12_leaderboard', JSON.stringify(updated));
    setStep('result');
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = useMemo(() => {
    if (!currentSet) return 0;
    const answeredCount = Object.keys(userAnswers).length;
    return (answeredCount / currentSet.questions.length) * 100;
  }, [userAnswers, currentSet]);

  if (step === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-5xl grid lg:grid-cols-2 gap-12 border-2 border-slate-200 fade-in mb-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="text-center lg:text-left">
              <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Bộ Giáo Dục & Đào Tạo</span>
              <h1 className="text-4xl font-black text-slate-800 mt-6 leading-tight uppercase tracking-tighter">Hệ Thống Luyện Thi<br/><span className="text-blue-600">Toán 12 Học Kỳ I</span></h1>
              <p className="text-slate-500 font-medium mt-4 text-lg">Phần mềm giả lập đề thi trắc nghiệm theo chương trình GDPT mới.</p>
            </div>
            
            <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Họ và tên thí sinh</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm text-lg font-bold"
                  placeholder="Vd: Nguyễn Văn A"
                  value={studentInfo.name}
                  onChange={e => setStudentInfo({...studentInfo, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Lớp học</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm text-lg font-bold"
                  placeholder="Vd: 12A1"
                  value={studentInfo.className}
                  onChange={e => setStudentInfo({...studentInfo, className: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Chọn bộ đề</label>
                <select 
                  className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer text-lg font-bold"
                  value={studentInfo.examId}
                  onChange={e => setStudentInfo({...studentInfo, examId: parseInt(e.target.value)})}
                >
                  {allExamSets.map(set => (
                    <option key={set.id} value={set.id}>Đề thi số {set.id}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleStart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-6 rounded-2xl shadow-xl transform active:scale-95 transition-all text-xl mt-4 uppercase tracking-tighter"
              >
                Vào Phòng Thi
              </button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
        <footer className="text-slate-400 font-bold tracking-widest uppercase text-sm fade-in">
          Designer: Cô Hải Hà
        </footer>
      </div>
    );
  }

  if (step === 'testing' && currentSet) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
        <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-lg px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="bg-slate-800 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black leading-none shadow-md">
                <span className="text-[10px] opacity-70 mb-1">MÃ ĐỀ</span>
                <span className="text-xl">{currentSet.id}</span>
              </div>
              <div className="hidden md:block">
                <h2 className="text-slate-900 font-black uppercase text-base">{studentInfo.name}</h2>
                <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Lớp: {studentInfo.className}</span>
                  <span className="text-blue-600">Toán 12 Học Kỳ I</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className={`flex flex-col items-center px-6 py-2 rounded-2xl border-2 transition-all ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest">Thời gian còn lại</span>
                <span className="text-2xl font-mono font-black">{formatTime(timeLeft)}</span>
              </div>
              <button 
                onClick={() => setIsSubmitting(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl active:scale-95 uppercase tracking-tighter"
              >
                Nộp Bài
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto mt-12 px-6">
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <span className="bg-slate-800 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">I</span>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn</h2>
                <p className="text-sm text-slate-500 font-medium">Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi chỉ chọn một phương án.</p>
              </div>
            </div>

            <div className="space-y-12">
              {currentSet.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).map((q, idx) => (
                <div key={q.id} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all fade-in">
                  <div className="flex items-start mb-8">
                    <span className="font-black text-blue-600 mr-5 text-2xl">Câu {idx + 1}.</span>
                    <MathRenderer content={q.content} className="flex-1 leading-relaxed text-slate-800 font-medium" />
                  </div>
                  
                  {q.bbtData && <VariationTable data={q.bbtData} />}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                    {q.options?.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                        className={`text-left p-6 rounded-[1.25rem] border-2 transition-all flex items-center gap-6 group ${
                          userAnswers[q.id] === opt.id 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-all ${
                          userAnswers[q.id] === opt.id ? 'bg-white text-blue-700 border-white' : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-blue-400'
                        }`}>
                          {opt.id}
                        </span>
                        <div className="flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <span className="bg-slate-800 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">II</span>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">PHẦN II. Câu trắc nghiệm đúng sai</h2>
                <p className="text-sm text-slate-500 font-medium">Thí sinh trả lời câu 13 và 14. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.</p>
              </div>
            </div>

            <div className="space-y-12">
              {currentSet.questions.filter(q => q.type === QuestionType.TRUE_FALSE).map((q, idx) => (
                <div key={q.id} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 fade-in">
                  <div className="flex items-start mb-8">
                    <span className="font-black text-blue-600 mr-5 text-2xl">Câu {idx + 13}.</span>
                    <MathRenderer content={q.content} className="flex-1 leading-relaxed text-slate-800 font-medium" />
                  </div>
                  
                  <div className="space-y-4">
                    {q.trueFalseParts?.map(part => (
                      <div key={part.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-2xl gap-6 border border-slate-200/50">
                        <div className="flex-1 flex gap-4">
                          <span className="font-black text-slate-900">{part.label})</span>
                          <MathRenderer content={part.statement} className="text-slate-700" />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setUserAnswers(prev => ({
                              ...prev,
                              [q.id]: { ...(prev[q.id] || {}), [part.id]: true }
                            }))}
                            className={`px-8 py-3 rounded-xl border-2 font-black text-sm transition-all flex-1 sm:flex-none ${
                              userAnswers[q.id]?.[part.id] === true 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-400'
                            }`}
                          >
                            ĐÚNG
                          </button>
                          <button
                            onClick={() => setUserAnswers(prev => ({
                              ...prev,
                              [q.id]: { ...(prev[q.id] || {}), [part.id]: false }
                            }))}
                            className={`px-8 py-3 rounded-xl border-2 font-black text-sm transition-all flex-1 sm:flex-none ${
                              userAnswers[q.id]?.[part.id] === false 
                                ? 'bg-rose-600 border-rose-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-rose-400'
                            }`}
                          >
                            SAI
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <span className="bg-slate-800 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">III</span>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">PHẦN III. Câu trắc nghiệm trả lời ngắn</h2>
                <p className="text-sm text-slate-500 font-medium">Thí sinh trả lời từ câu 15 đến câu 18. Ghi kết quả vào ô trống tương ứng.</p>
              </div>
            </div>

            <div className="space-y-12">
              {currentSet.questions.filter(q => q.type === QuestionType.SHORT_ANSWER).map((q, idx) => (
                <div key={q.id} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 fade-in">
                  <div className="flex items-start mb-8">
                    <span className="font-black text-blue-600 mr-5 text-2xl">Câu {idx + 15}.</span>
                    <MathRenderer content={q.content} className="flex-1 leading-relaxed text-slate-800 font-medium" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 p-8 bg-blue-50/30 rounded-3xl border border-blue-100">
                    <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Kết quả tính toán:</span>
                    <input
                      type="text"
                      maxLength={10}
                      className="w-48 px-6 py-4 bg-white border-3 border-blue-200 rounded-2xl focus:border-blue-500 outline-none font-black text-2xl text-blue-700 shadow-inner tracking-wide"
                      placeholder="..."
                      value={userAnswers[q.id] || ''}
                      onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                    <div className="text-xs text-slate-400 italic font-medium">
                      Ghi số (vd: 5; -1,2). Nếu kết quả là số thập phân, dùng dấu phẩy.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {isSubmitting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
            <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center fade-in">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                📋
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">Xác Nhận Nộp Bài</h3>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">Thời gian vẫn còn <b>{formatTime(timeLeft)}</b>. Bạn có chắc chắn muốn kết thúc bài thi ngay bây giờ không?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsSubmitting(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
                >
                  Kiểm tra lại
                </button>
                <button 
                  onClick={handleSubmitInternal}
                  className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase tracking-widest text-sm"
                >
                  Nộp ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-2xl border-2 border-slate-100 text-center fade-in">
          <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center text-6xl mx-auto mb-10 shadow-inner rotate-3">
            🏆
          </div>
          <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Kết Quả Bài Thi</h1>
          <p className="text-slate-400 mb-12 text-xl font-medium tracking-tight">Thí sinh: <span className="text-blue-600 font-black">{studentInfo.name.toUpperCase()}</span></p>
          
          <div className="bg-slate-50 p-12 rounded-[3rem] mb-12 grid grid-cols-1 md:grid-cols-2 gap-10 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-emerald-400"></div>
            <div className="text-center">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-3">Tổng Điểm</p>
              <p className="text-8xl font-black text-blue-600 tabular-nums tracking-tighter">{score.toFixed(2)}</p>
              <p className="text-slate-400 font-bold mt-2">Thang điểm 10.0</p>
            </div>
            <div className="text-center flex flex-col justify-center">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-3">Thời Gian Làm Bài</p>
              <p className="text-5xl font-black text-slate-700 tabular-nums tracking-tight">{formatTime(3600 - timeLeft)}</p>
              <p className="text-slate-400 font-bold mt-2">Phút : Giây</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <button 
              onClick={() => {
                const csvHeader = "\ufeff" + "Họ Tên,Lớp,Điểm,Thời Gian,Mã Đề\n";
                const csvRow = `${studentInfo.name},${studentInfo.className},${score.toFixed(2)},${3600 - timeLeft},${studentInfo.examId}\n`;
                const blob = new Blob([csvHeader + csvRow], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `PhieuDiem_${studentInfo.name.replace(/\s+/g, '')}.csv`;
                link.click();
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 text-white font-black py-6 px-8 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 uppercase tracking-tighter text-lg"
            >
              📊 Xuất Phiếu Điểm
            </button>
            <button 
              onClick={() => setStep('setup')}
              className="flex items-center justify-center gap-3 bg-white text-slate-600 font-black py-6 px-8 rounded-[1.5rem] border-3 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-tighter text-lg"
            >
              🏠 Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
