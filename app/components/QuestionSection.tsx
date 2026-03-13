"use client";

import { useState, useTransition } from "react";
import { askQuestion } from "@/lib/actions/question.actions";
import { IQuestion, IUser } from "@/types";
import { MessageSquare, Send, User as UserIcon, Loader2, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionSectionProps {
  productId: string;
  user: IUser | null;
  initialQuestions: IQuestion[];
}

export default function QuestionSection({ productId, user, initialQuestions }: QuestionSectionProps) {
  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newQuestion.trim()) return;

    startTransition(async () => {
      const result = await askQuestion({
        userId: user._id,
        productId,
        question: newQuestion,
        path: `/product/${productId}`,
      });

      if (result.success) {
        setQuestions([result.data, ...questions]);
        setNewQuestion("");
        setShowInput(false);
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
               <MessageCircleQuestion className="w-6 h-6 text-amber-500" />
            </div>
            <div>
               <h3 className="text-xl font-black italic">שאלות ותשובות</h3>
               <p className="text-slate-500 text-sm">יש לכם שאלה על המוצר? הקהילה והצוות כאן בשבילכם</p>
            </div>
         </div>
         
         {!showInput && user && (
           <button 
             onClick={() => setShowInput(true)}
             className="bg-white hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-white/5"
           >
             שאל שאלה
           </button>
         )}
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
             <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="מה תרצו לדעת על המוצר?"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50 min-h-[120px] transition-all"
                />
                <div className="flex justify-end gap-3">
                   <button 
                     type="button" 
                     onClick={() => setShowInput(false)}
                     className="px-6 py-2 text-slate-400 font-bold hover:text-white transition-colors"
                   >
                     ביטול
                   </button>
                   <button 
                     type="submit"
                     disabled={isPending || !newQuestion.trim()}
                     className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                     {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                     שלח שאלה
                   </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <motion.div 
              key={q._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                   <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tr-none p-4 group-hover:bg-white/[0.08] transition-colors">
                      <p className="text-amber-400 text-xs font-black mb-1 uppercase tracking-wider">
                         {(q.user as any)?.name || "משתמש אנונימי"} • {new Date(q.createdAt).toLocaleDateString("he-IL")}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-200">{q.question}</p>
                   </div>

                   {q.answer ? (
                     <div className="flex gap-3 mr-8">
                        <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                           <MessageSquare className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl rounded-tr-none p-4 flex-1">
                           <p className="text-amber-500 text-[10px] font-black mb-1 uppercase tracking-widest">תשובת הצוות</p>
                           <p className="text-sm text-slate-300 italic">{q.answer}</p>
                        </div>
                     </div>
                   ) : (
                     <div className="mr-8 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Loader2 className="w-3 h-3 animate-pulse" />
                        ממתין לתשובת הצוות...
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/5 border border-white/5 border-dashed rounded-[2.5rem]">
             <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">עדיין אין שאלות על המוצר הזה.<br/>היו הראשונים לשאול!</p>
          </div>
        )}
      </div>
    </div>
  );
}
