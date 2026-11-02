
export default function LocksPage(){
  const [list,setList]=useState([]); const [f,setF]=useState({name:"",type:"إلكتروني",sizes:"",productPrice:"",note:""})
  const load=()=>setList(JSON.parse(localStorage.getItem("quflaty_locks")||"[]")); useEffect(()=>load(),[])
  const save=()=>{ let l=JSON.parse(localStorage.getItem("quflaty_locks")||"[]"); l.push({id:Date.now(),...f,sizes:f.sizes.split(",")}); localStorage.setItem("quflaty_locks",JSON.stringify(l)); setF({name:"",type:"إلكتروني",sizes:"",productPrice:"",note:""}); load() }
  return (<div><h3>إضافة قفل</h3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"#fff",padding:15,borderRadius:12,border:"1px solid #ddd"}}>
    <input placeholder="اسم القفل H10" value={f.name} onChange={e=>setF({...f,name:e.target.value})} style={inp}/>
    <select value={f.type} onChange={e=>setF({...f,type:e.target.value})} style={inp}><option>إلكتروني</option><option>عادي</option><option>فندقي كرت</option><option>ذكي بصمة</option></select>
    <input placeholder="مقاسات 60mm,70mm,85mm" value={f.sizes} onChange={e=>setF({...f,sizes:e.target.value})} style={inp}/>
    <input placeholder="سعر القفل" type="number" value={f.productPrice} onChange={e=>setF({...f,productPrice:e.target.value})} style={inp}/>
    <input placeholder="ملاحظة" value={f.note} onChange={e=>setF({...f,note:e.target.value})} style={{...inp,gridColumn:"1/3"}}/>
    <button onClick={save} style={btn}>حفظ القفل</button>
  </div>
  <div style={{marginTop:15,display:"flex",gap:8,flexWrap:"wrap"}}>{list.map(i=><div key={i.id} style={card}>{i.name} - {i.type} - {i.productPrice} ر.س <button onClick={()=>{let l=list.filter(x=>x.id!==i.id); localStorage.setItem("quflaty_locks",JSON.stringify(l)); load()}}>❌</button></div>)}</div>
  </div>)
}
const inp={padding:10,background:"#1e1e1e",color:"#fff",border:"none",borderRadius:6}
const btn={gridColumn:"1/3",padding:12,background:"#000",color:"#fff",borderRadius:8,border:"none",cursor:"pointer"}
const card={border:"1px solid #eee",padding:8,borderRadius:8,background:"#fff"}