'use client';
import { useState } from 'react';

const samples=[
  {name:'Event launch',description:'Deadlines and handoffs',text:`Maya: I’ll send the revised sponsor deck to Luis by Tuesday afternoon.
Luis: I can review the deck by Wednesday morning and leave comments.
Jordan: I’ll confirm the venue headcount with operations before Friday.
Maya: If the budget numbers arrive, I’ll update the final slide too.`},
  {name:'Product stand-up',description:'Engineering ownership',text:`Priya: I’ll fix the checkout validation bug by Thursday.
Evan: I can review Priya’s pull request before Friday morning.
Noah: I’ll publish the release notes by end of day Friday.
Priya: We need to confirm the analytics event names.`},
  {name:'Client kickoff',description:'Decisions and follow-ups',text:`Amina: I’ll send the brand assets by Monday.
Carlos: I can share the first homepage draft before next Wednesday.
Lee: I’ll schedule the stakeholder review by Friday afternoon.
Amina: We need to decide who approves final copy.`}
];
type Commitment={id:number;task:string;owner:string;due:string;confidence:number;evidence:string;confirmed:boolean};

function extract(text:string):Commitment[]{
  return text.split(/\n+/).map(s=>s.trim()).filter(Boolean).flatMap((line,index)=>{
    const [speaker='Unassigned',...rest]=line.split(':'); const statement=rest.join(':').trim();
    if(!/\b(i('|’)ll|i will|i can|we need|will)\b/i.test(statement)) return [];
    const due=statement.match(/\b(?:by|before)\s+([^.,]+)/i)?.[1]??'Not stated';
    const task=statement.replace(/\b(?:by|before)\s+[^.,]+/i,'').replace(/^(?:if [^,]+,\s*)?/i,'').replace(/^(?:i('|’)ll|i will|i can|we will)\s+/i,'').replace(/\.$/,'').trim();
    return [{id:Date.now()+index,task,owner:speaker.trim()||'Unassigned',due,confidence:due==='Not stated'?68:92,evidence:line,confirmed:false}];
  });
}

export default function Home(){
  const [transcript,setTranscript]=useState(samples[0].text); const [items,setItems]=useState<Commitment[]>([]);
  const [ran,setRan]=useState(false); const [message,setMessage]=useState('');
  const confirmed=items.filter(i=>i.confirmed); const words=transcript.trim()?transcript.trim().split(/\s+/).length:0;
  const update=(id:number,field:keyof Commitment,value:string|boolean)=>setItems(v=>v.map(i=>i.id===id?{...i,[field]:value}:i));
  function run(){const found=extract(transcript);setItems(found);setRan(true);setMessage(found.length?'':'No explicit commitments found. Add one manually or include speaker names and “I’ll” statements.');}
  function add(){setItems(v=>[...v,{id:Date.now(),task:'',owner:'Unassigned',due:'Not stated',confidence:50,evidence:'Added manually',confirmed:false}]);setRan(true);}
  function notify(text:string){setMessage(text);window.setTimeout(()=>setMessage(''),2400)}
  function copyFollowUp(){if(!confirmed.length)return notify('Confirm at least one commitment first.');const body=['Subject: Confirming our next steps','','Here’s what I captured from our meeting:',...confirmed.map(i=>`• ${i.owner} — ${i.task} (Due: ${i.due})`),'','Please reply with any corrections.'];navigator.clipboard.writeText(body.join('\n'));notify('Follow-up copied to clipboard.');}
  function exportCsv(){if(!confirmed.length)return notify('Confirm at least one commitment first.');const q=(v:string|number)=>`"${String(v).replaceAll('"','""')}"`;const csv=['Owner,Commitment,Due,Confidence,Evidence',...confirmed.map(i=>[i.owner,i.task,i.due,`${i.confidence}%`,i.evidence].map(q).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='clearcommit-confirmed.csv';a.click();URL.revokeObjectURL(a.href);notify('CSV downloaded.');}

  return <main>
    <nav><div className="brand"><span className="brandMark" aria-hidden="true"><i>C</i><b>✓</b></span><span className="wordmark"><span>Clear<strong>Commit</strong></span><small>Meeting accountability</small></span></div><div className="navMeta"><span className="liveDot"/>Private by design · nothing stored</div></nav>
    <header className="hero"><div><p className="eyebrow">FROM TALK TO OWNERSHIP</p><h1>Leave every meeting with<br/><em>the next step clear.</em></h1><p>Turn a transcript into editable, evidence-backed commitments. Review the uncertain details, confirm what’s real, then send the follow-up.</p></div><div className="how"><b>How it works</b><span><i>1</i> Paste transcript</span><span><i>2</i> Review & confirm</span><span><i>3</i> Share next steps</span></div></header>
    <section className="workspace">
      <div className="panel inputPanel">
        <div className="panelHead"><div><span className="step">01</span><div><h2>Add your transcript</h2><p>Speaker labels improve owner detection.</p></div></div></div>
        <div className="samplePicker"><div><b>Try an example</b><span>Choose a meeting type to see a realistic transcript.</span></div>{samples.map(s=><button key={s.name} className={transcript===s.text?'sample active':'sample'} onClick={()=>{setTranscript(s.text);setRan(false);setItems([])}}><strong>{s.name}</strong><small>{s.description}</small></button>)}</div>
        <label className="fieldLabel" htmlFor="transcript">Meeting conversation</label>
        <textarea id="transcript" value={transcript} placeholder={'Alex: I’ll send the proposal by Thursday.\nSam: I can review it Friday morning.'} onChange={e=>{setTranscript(e.target.value);setRan(false)}}/>
        <div className="inputFoot"><span>{words} words · {transcript.split(/\n+/).filter(Boolean).length} lines</span><button className="primary" disabled={words<4} onClick={run}>Find commitments <span>→</span></button></div>
        <aside className="tip"><b>For the best result</b><span>Use one speaker per line and keep the exact wording. ClearCommit always shows its evidence.</span></aside>
      </div>

      <div className="panel resultsPanel">
        <div className="panelHead"><div><span className="step">02</span><div><h2>Review before sharing</h2><p>Edit anything inferred, then confirm it.</p></div></div>{ran&&<span className="count">{confirmed.length}/{items.length} confirmed</span>}</div>
        <details className="reviewGuide"><summary>What does Commitment Review mean?</summary><div className="definitions"><div><b>Action</b><span>The specific task or promise that should happen next.</span></div><div><b>Owner</b><span>The person responsible, usually inferred from the speaker label.</span></div><div><b>Due date</b><span>The stated deadline. “Not stated” means the team should supply one.</span></div><div><b>Confidence</b><span>How complete the detected owner and deadline appear—not a guarantee of accuracy.</span></div><div><b>Evidence</b><span>The exact transcript line behind the proposed commitment.</span></div><div><b>Confirmed</b><span>Your human approval that the edited commitment is ready to share.</span></div></div></details>
        {!ran?<div className="empty"><div className="emptyIcon">↗</div><h3>Ready when your transcript is</h3><p>We’ll organize candidate actions here—never send or save them automatically.</p></div>:items.length===0?<div className="empty"><div className="emptyIcon muted">?</div><h3>No clear promises yet</h3><p>{message}</p><button className="secondary" onClick={add}>Add commitment manually</button></div>:
        <div className="results"><div className="summary"><div><strong>{items.length}</strong><span>found</span></div><div><strong>{items.filter(i=>i.due==='Not stated').length}</strong><span>need a date</span></div><div><strong>{confirmed.length}</strong><span>ready to share</span></div></div>
          <div className="cards">{items.map((item,index)=><article className={item.confirmed?'commitment approved':'commitment'} key={item.id}>
            <div className="cardTitle"><span>Commitment {index+1}</span><span className={item.confidence>80?'confidence high':'confidence'}>{item.confidence}% confidence</span></div>
            <label>Action<input value={item.task} onChange={e=>update(item.id,'task',e.target.value)}/></label>
            <div className="twoFields"><label>Owner<input value={item.owner} onChange={e=>update(item.id,'owner',e.target.value)}/></label><label>Due date<input value={item.due} onChange={e=>update(item.id,'due',e.target.value)}/></label></div>
            <details><summary>Show source evidence</summary><blockquote>{item.evidence}</blockquote></details>
            <div className="cardActions"><button className="remove" aria-label={`Remove commitment ${index+1}`} onClick={()=>setItems(v=>v.filter(i=>i.id!==item.id))}>Remove</button><label className="confirm"><input type="checkbox" checked={item.confirmed} onChange={e=>update(item.id,'confirmed',e.target.checked)}/><span>{item.confirmed?'Confirmed':'Mark confirmed'}</span></label></div>
          </article>)}</div><button className="addButton" onClick={add}>+ Add another commitment</button>
        </div>}
        {ran&&items.length>0&&<div className="shareBar"><div><b>Share only what you’ve confirmed</b><span>{confirmed.length?`${confirmed.length} commitment${confirmed.length===1?'':'s'} ready`:'Review the cards above'}</span></div><button onClick={copyFollowUp} disabled={!confirmed.length}>Copy follow-up</button><button className="primary small" onClick={exportCsv} disabled={!confirmed.length}>Export CSV</button></div>}
      </div>
    </section>
    {message&&items.length>0&&<div className="toast" role="status">{message}</div>}
    <footer><span><b>Honest limitation:</b> this sprint prototype uses lightweight extraction. Always verify names and dates.</span><span>Built by ctrl+alt+trio · DevFest DC 2026</span></footer>
  </main>
}

