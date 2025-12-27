
import React from 'react';
import MathRenderer from './MathRenderer';

interface BBTProps {
  data: any;
}

const VariationTable: React.FC<BBTProps> = ({ data }) => {
  if (!data) return null;

  if (data.groups) {
    return (
      <div className="bbt-wrapper shadow-sm border-slate-400">
        <table className="bbt-table">
          <thead>
            <tr className="bg-slate-50">
              <td className="bbt-label">Nhóm</td>
              {data.groups.map((g: string, i: number) => (
                <td key={i} className="font-medium">
                  <MathRenderer content={g.replace(/,/g, ';')} />
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bbt-label">Tần số</td>
              {data.freq.map((f: number, i: number) => (
                <td key={i} className="font-bold text-slate-700">{f}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const points = (data.f || []).filter((_: any, i: number) => i % 2 === 0);
  const arrows = (data.f || []).filter((_: any, i: number) => i % 2 !== 0);

  return (
    <div className="bbt-wrapper shadow-md border-slate-400">
      <table className="bbt-table">
        <tbody>
          {/* Hàng X */}
          <tr>
            <td className="bbt-label">$x$</td>
            {data.x.map((val: string, i: number) => (
              <td key={i}><MathRenderer content={val.replace(/,/g, ';')} /></td>
            ))}
          </tr>
          
          {/* Hàng F' */}
          <tr>
            <td className="bbt-label">$f'(x)$</td>
            {data.fPrime.map((val: string, i: number) => (
              <td key={i} className="font-bold">
                <MathRenderer content={val} />
              </td>
            ))}
          </tr>

          {/* Hàng F(X) - Vẽ kiểu SGK */}
          <tr style={{ height: '140px' }}>
            <td className="bbt-label">$f(x)$</td>
            {points.map((val: any, i: number) => {
              const nextDir = arrows[i];
              const prevDir = arrows[i-1];
              
              let posClass = "flex items-center justify-center h-full";
              if (nextDir === '↗' || prevDir === '↘') posClass = "flex items-end justify-center h-full pb-4";
              if (nextDir === '↘' || prevDir === '↗') posClass = "flex items-start justify-center h-full pt-4";

              return (
                <td key={i} className="bbt-f-cell min-w-[110px]">
                  <div className={posClass}>
                    <div className="z-10 bg-white px-2 py-1 font-bold border border-transparent">
                      <MathRenderer content={String(val).replace(/,/g, ';')} />
                    </div>
                  </div>

                  {i < points.length - 1 && (
                    <svg className="absolute top-0 left-1/2 w-full h-full overflow-visible pointer-events-none" style={{ width: '100%' }}>
                      <defs>
                        <marker id={`head-${i}`} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                          <path d="M0,0 L10,5 L0,10 Z" fill="#334155" />
                        </marker>
                      </defs>
                      <line 
                        x1="10%" 
                        y1={nextDir === '↗' ? '82%' : '18%'} 
                        x2="90%" 
                        y2={nextDir === '↗' ? '18%' : '82%'} 
                        stroke="#475569" 
                        strokeWidth="1.5"
                        markerEnd={`url(#head-${i})`}
                      />
                    </svg>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VariationTable;
