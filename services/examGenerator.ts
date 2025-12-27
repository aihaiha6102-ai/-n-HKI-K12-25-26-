
import { Question, QuestionType, ExamSet } from '../types';

const generateSet = (setId: number): ExamSet => {
  const seed = setId * 7;
  
  const questions: Question[] = [
    {
      id: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây. Hàm số đã cho đồng biến trên khoảng nào?`,
      bbtData: {
        x: ['$-\\infty$', seed % 2 === 0 ? '-1' : '-2', seed % 3 === 0 ? '1' : '3', '$+\\infty$'],
        fPrime: ['+', '0', '-', '0', '+'],
        f: ['$-\\infty$', '↗', seed % 5 + 2, '↘', seed % 4 - 1, '↗', '$+\\infty$']
      },
      options: [
        { id: 'A', text: `$( -\\infty ; ${seed % 2 === 0 ? '-1' : '-2'} )$` },
        { id: 'B', text: `$( ${seed % 2 === 0 ? '-1' : '-2'} ; ${seed % 3 === 0 ? '1' : '3'} )$` },
        { id: 'C', text: `$( 0 ; +\\infty )$` },
        { id: 'D', text: `$( -1 ; 1 )$` }
      ],
      correctOption: 'A'
    },
    {
      id: 2,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = x^2(x - ${setId})$. Số điểm cực trị của hàm số là:`,
      options: [
        { id: 'A', text: '0' },
        { id: 'B', text: '1' },
        { id: 'C', text: '2' },
        { id: 'D', text: '3' }
      ],
      correctOption: 'B'
    },
    {
      id: 3,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Giá trị nhỏ nhất của hàm số $f(x) = x^3 - ${3 * setId}x + 2$ trên đoạn $[0 ; ${setId + 1}]$ bằng:`,
      options: [
        { id: 'A', text: `${2 - 2 * Math.sqrt(setId)}` },
        { id: 'B', text: '2' },
        { id: 'C', text: `${2 - (3 * setId)}` },
        { id: 'D', text: '0' }
      ],
      correctOption: 'C'
    },
    {
      id: 4,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Số đường tiệm cận của đồ thị hàm số $y = \\ds \\frac{x - ${setId}}{x^2 - ${setId * setId}}$ là:`,
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
        { id: 'C', text: '3' },
        { id: 'D', text: '0' }
      ],
      correctOption: 'B'
    },
    {
      id: 5,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian cho hình hộp $ABCD.A'B'C'D'$. Vectơ $\\vec{AB} + \\vec{AD} + \\vec{AA'}$ bằng vectơ nào sau đây?`,
      options: [
        { id: 'A', text: '$\\vec{AC\'}$' },
        { id: 'B', text: '$\\vec{BD\'}$' },
        { id: 'C', text: '$\\vec{CA\'}$' },
        { id: 'D', text: '$\\vec{DB\'}$' }
      ],
      correctOption: 'A'
    },
    {
      id: 6,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian $Oxyz$, cho vectơ $\\vec{u} = ${setId}\\vec{i} - ${setId + 1}\\vec{j} + ${setId + 2}\\vec{k}$. Tọa độ của $\\vec{u}$ là:`,
      options: [
        { id: 'A', text: `(${setId}; ${setId + 1}; ${setId + 2})` },
        { id: 'B', text: `(${setId}; -${setId + 1}; ${setId + 2})` },
        { id: 'C', text: `(-${setId}; ${setId + 1}; -${setId + 2})` },
        { id: 'D', text: `(${setId}; ${setId + 1}; -${setId + 2})` }
      ],
      correctOption: 'B'
    },
    {
      id: 7,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian $Oxyz$, cho hai điểm $A(${setId}; 0; 1)$ và $B(1; ${setId}; 2)$. Tọa độ của $\\vec{AB}$ là:`,
      options: [
        { id: 'A', text: `(${1 - setId}; ${setId}; 1)` },
        { id: 'B', text: `(${setId - 1}; -${setId}; -1)` },
        { id: 'C', text: `(${setId + 1}; ${setId}; 3)` },
        { id: 'D', text: `(1; 1; 1)` }
      ],
      correctOption: 'A'
    },
    {
      id: 8,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian $Oxyz$, cho $A(1; 1; 1)$, $B(0; ${setId}; 2)$, $C(${setId}; 2; 0)$. Trọng tâm $G$ của tam giác $ABC$ là:`,
      options: [
        { id: 'A', text: `$\\left( \\ds \\frac{${setId + 1}}{3}; \\ds \\frac{${setId + 3}}{3}; 1 \\right)$` },
        { id: 'B', text: `(1; 1; 1)` },
        { id: 'C', text: `(0; 0; 0)` },
        { id: 'D', text: `(${setId}; ${setId}; ${setId})` }
      ],
      correctOption: 'A'
    },
    {
      id: 9,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian $Oxyz$, cho $\\vec{a} = (1; ${setId}; -2)$ và $\\vec{b} = (-1; 2; ${setId})$. Khi đó $\\vec{a} + \\vec{b}$ bằng:`,
      options: [
        { id: 'A', text: `(0; ${setId + 2}; ${setId - 2})` },
        { id: 'B', text: `(2; ${setId - 2}; -${setId + 2})` },
        { id: 'C', text: `(0; 0; 0)` },
        { id: 'D', text: `(1; 1; 1)` }
      ],
      correctOption: 'A'
    },
    {
      id: 10,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Trong không gian $Oxyz$, tích vô hướng của $\\vec{u} = (1; 0; ${setId})$ và $\\vec{v} = (${setId}; 2; -1)$ bằng:`,
      options: [
        { id: 'A', text: '0' },
        { id: 'B', text: `${setId}` },
        { id: 'C', text: '1' },
        { id: 'D', text: '-1' }
      ],
      correctOption: 'A'
    },
    {
      id: 11,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Cho mẫu số liệu ghép nhóm dưới đây. Khoảng biến thiên của mẫu số liệu là:`,
      bbtData: {
        groups: [`[150; 155)`, `[155; 160)`, `[160; 165)`, `[165; 170)`],
        freq: [setId, setId + 2, setId + 5, setId + 1]
      },
      options: [
        { id: 'A', text: '20' },
        { id: 'B', text: '15' },
        { id: 'C', text: '5' },
        { id: 'D', text: '10' }
      ],
      correctOption: 'A'
    },
    {
      id: 12,
      type: QuestionType.MULTIPLE_CHOICE,
      content: `Một mẫu số liệu có phương sai $s^2 = ${setId * setId}$. Độ lệch chuẩn của mẫu số liệu là:`,
      options: [
        { id: 'A', text: `${setId}` },
        { id: 'B', text: `${setId * setId * setId}` },
        { id: 'C', text: `${setId * 2}` },
        { id: 'D', text: `${Math.sqrt(setId).toFixed(2)}` }
      ],
      correctOption: 'A'
    },
    {
      id: 13,
      type: QuestionType.TRUE_FALSE,
      content: `Cho hàm số $f(x) = \\ds \\frac{2x - 1}{x + 3}$. Xét tính đúng sai của các khẳng định sau:`,
      trueFalseParts: [
        { id: 'a', label: 'a', statement: `Đạo hàm của hàm số là $f'(x) = \\ds \\frac{7}{(x+3)^2}$.`, correct: true },
        { id: 'b', label: 'b', statement: `Hàm số nghịch biến trên từng khoảng xác định.`, correct: false },
        { id: 'c', label: 'c', statement: `Đường tiệm cận ngang của đồ thị hàm số là $y = 2$.`, correct: true },
        { id: 'd', label: 'd', statement: `Đồ thị hàm số đi qua điểm $M(0; -\\ds \\frac{1}{3})$.`, correct: true }
      ]
    },
    {
      id: 14,
      type: QuestionType.TRUE_FALSE,
      content: `Trong không gian $Oxyz$, cho ba điểm $A(1; 0; 0)$, $B(0; ${setId}; 0)$ và $C(0; 0; 1)$.`,
      trueFalseParts: [
        { id: 'a', label: 'a', statement: `Điểm $A$ thuộc trục hoành $Ox$.`, correct: true },
        { id: 'b', label: 'b', statement: `Vectơ $\\vec{AB} = (-1; ${setId}; 0)$.`, correct: true },
        { id: 'c', label: 'c', statement: `Tam giác $ABC$ là tam giác đều.`, correct: setId === 1 },
        { id: 'd', label: 'd', statement: `Diện tích tam giác $OAB$ bằng $\\ds \\frac{${setId}}{2}$.`, correct: true }
      ]
    },
    {
      id: 15,
      type: QuestionType.SHORT_ANSWER,
      content: `Một vật chuyển động theo phương trình $s(t) = t^3 - ${setId}t + 5$ ($t$ tính bằng giây, $s$ tính bằng mét). Vận tốc của vật tại thời điểm $t = 3$ giây bằng bao nhiêu?`,
      shortAnswerCorrect: `${27 - setId}`
    },
    {
      id: 16,
      type: QuestionType.SHORT_ANSWER,
      content: `Trong không gian $Oxyz$, cho $A(1; 0; 0)$, $B(0; ${setId}; 0)$ và $C(0; 0; 0)$. Chu vi tam giác $ABC$ bằng bao nhiêu? (làm tròn đến hàng phần mười).`,
      shortAnswerCorrect: (1 + setId + Math.sqrt(1 + setId * setId)).toFixed(1).replace('.', ',')
    },
    {
      id: 17,
      type: QuestionType.SHORT_ANSWER,
      content: `Tìm $m$ để ba điểm $A(1; 2; 3)$, $B(2; ${setId}; 4)$ và $C(3; ${2 * setId - 2}; m)$ thẳng hàng.`,
      shortAnswerCorrect: '5'
    },
    {
      id: 18,
      type: QuestionType.SHORT_ANSWER,
      content: `Trong không gian $Oxyz$, số đo góc giữa hai vectơ $\\vec{u} = (1; 1; 0)$ và $\\vec{v} = (0; 1; 1)$ bằng bao nhiêu độ?`,
      shortAnswerCorrect: '60'
    }
  ];

  return {
    id: setId,
    name: `Bộ đề thi số ${setId}`,
    questions
  };
};

export const allExamSets: ExamSet[] = Array.from({ length: 10 }, (_, i) => generateSet(i + 1));
