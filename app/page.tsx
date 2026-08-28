'use client';
import { useMemo, useState } from 'react';

const sample = `Maya: I’ll send the revised sponsor deck to Luis by Tuesday afternoon.
Luis: Great. I can review it Wednesday morning and leave comments.
Jordan: We still need a venue headcount. I’ll confirm that with operations before Friday.
Maya: If the budget numbers arrive, I’ll update the final slide too.`;
type Commitment = { task:string; owner:string; due:string; confidence:number; evidence:string };

function extractCommitments(text:string):Commitment[] {
  return text.split(/\n+/).map(line=>line.trim()).filter(Boolean).flatMap(line=>{
    const [speaker='Unassigned',...rest]=line.split(':'); const statement=rest.join(':').trim();
    if(!/\b(i('|’)ll|i will|we need|can)\b/i.test(statement)) return [];
    const due=statement.match(/\b(by|before)\s+([^.,]+)/i)?.[2]??'Not stated';
    return [{task:statement.replace(/\b(by|before)\s+[^.,]+/i,'').replace(/^(great\.\s*)?i('|’)ll\s+/i,'').replace(/^i can\s+/i,'').trim(),owner:speaker.trim(),due,confidence:due==='Not stated'?72:92,evidence:line}];
  });
}

export default function Home(){
  const [transcript,setTranscript]=useState(sample); const [hasRun,setHasRun]=useState(false);
  const commitments=useMemo(()=>hasRun?extractCommitments(transcript):[],[hasRun,transcript]);
  function exportCsv(){
    const quote=(value:string|number)=>`"${String(value).replaceAll('"','""')}"`;
    const csv=['Owner,Commitment,Due,Confidence',...commitments.map(item=>[item.owner,item.task,item.due,`${item.confidence}%`].map(quote).join(','))].join('\n');
    const link=document.createElement('a'); link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); link.download='clearcommit-actions.csv'; link.click(); URL.revokeObjectURL(link.href);
  }
  function copyFollowUp(){
    const message=['Team — here are the commitments I captured. Please reply with corrections:',...commitments.map(item=>`• ${item.owner}: ${item.task} (Due: ${item.due})`),'','These were inferred from the transcript and need confirmation.'].join('\n');
    navigator.clipboard.writeText(message);
  }
  return <main>
    <nav><div className="brand"><span className="brandMark">C</span> ClearCommit</div><span className="badge">DevFest DC · Buildathon</span></nav>
    <section className="hero"><div><p className="eyebrow">MEETINGS → ACCOUNTABILITY</p><h1>Turn conversation into<br/><em>clear commitments.</em></h1><p className="lede">Paste a messy meeting transcript. Get owners, deadlines, confidence, and evidence—ready for human confirmation.</p><div className="trust"><span>✓ Human-in-the-loop</span><span>✓ Evidence attached</span><span>✓ Honest confidence</span></div></div><div className="score"><strong>90 sec</strong><span>from transcript to follow-up</span></div></section>
    <section className="workspace">
      <div className="panel inputPanel"><div className="panelHead"><div><span className="step">01</span><h2>Meeting transcript</h2></div><button className="textButton" onClick={()=>setTranscript(sample)}>Use sample</button></div><textarea aria-label="Meeting transcript" value={transcript} onChange={e=>{setTranscript(e.target.value);setHasRun(false)}}/><div className="inputFoot"><span>{transcript.split(/\s+/).filter(Boolean).length} words</span><button className="primary" onClick={()=>setHasRun(true)}>Extract commitments <span>→</span></button></div></div>
      <div className="panel resultsPanel"><div className="panelHead"><div><span className="step">02</span><h2>Commitment review</h2></div>{hasRun&&<div className="resultActions"><span className="count">{commitments.length} found</span><button onClick={copyFollowUp}>Copy follow-up</button><button onClick={exportCsv}>Export CSV</button></div>}</div>
        {!hasRun?<div className="empty"><div className="emptyIcon">↗</div><h3>Your action items will appear here</h3><p>Every result includes the original evidence so nothing becomes a confident guess.</p></div>:<div className="cards">{commitments.map((item,index)=><article className="commitment" key={index}><div className="commitTop"><span className="owner">{item.owner.slice(0,1)}</span><div><strong>{item.owner}</strong><span className="due">Due: {item.due}</span></div><span className={item.confidence>85?'confidence high':'confidence'}>{item.confidence}%</span></div><p>{item.task}</p><details><summary>View evidence</summary><blockquote>{item.evidence}</blockquote></details></article>)}</div>}
      </div>
    </section><footer><span>Prototype limitation: owners and dates are inferred and must be confirmed.</span><span>Built for one honest, end-to-end flow.</span></footer>
  </main>;
}

