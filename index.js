const  GoogleSpreadsheet  = require('google-spreadsheet');
const creds = require('./credenciais.json');
const { promisify } = require('util'); 

function formatNota(value){
    let formatedNota = Math.round(value/10)
    return formatedNota
}
function formatSituacaoNota(value , Aulas){
     let media = Math.round((formatNota(value._cre1l)+formatNota(value._chk2m)+formatNota(value._ciyn3))/3);
     let formatedSituacaoFaltas = (Aulas*25)/100;
     if(value._cpzh4 > formatedSituacaoFaltas ){
             return "Reprovado por Falta"
     }else{
             if(media >=7 )
                 {
                     return "Aprovado"
                 }else{
                     if(media>=5 && media<7){
                         return "Exame Final"
                     }else{
                         return "Reprovado por Nota"
                     }
                 }
         }

}
function formatedNotaSituacaoFinal(value){
     if(value.SituacaoNotas == 'Exame Final'){
         let media = Math.round((value.P1+value.P2+value.P3)/3);
         let naf = Math.round(Math.random() * (10 - 0))
             if(5 <= Math.round((media +naf)/2))
             {
                 return 'Reprovado'
             }else{
                 return 'Aprovado'
             }
     }else{
         return 0
     }
}



const accessSpreadsheet = async () =>{
    
    const doc = new GoogleSpreadsheet('167rsrZz7er0JZYLO3C5DeYq-vsezjkFuy9_xQ-NkeIM');
    await promisify(doc.useServiceAccountAuth)(creds)

    const info = await promisify(doc.getInfo)()
    
    const worksheet = info.worksheets[0]

    const rows = await promisify(worksheet.getRows)({
        offset:1,
    })

   let str = rows[0].engenhariadesoftware;
   let TotalAulasSemestre = str.match(/[0-9]\d/);
   let ArrayTabela = [];

    rows.forEach(row => {  
        let objTabela = {  
                Aluno:row._cokwr, 
                Faltas:row._cpzh4,
                P1:formatNota(row._cre1l),
                P2:formatNota(row._chk2m),
                P3:formatNota(row._ciyn3),
                SituacaoNotas:formatSituacaoNota(row , TotalAulasSemestre),
            } 
       objTabela['NotaAprovacaoFinal'] = formatedNotaSituacaoFinal(objTabela);
        ArrayTabela.push(objTabela);      
        
      
    }); 

    var ResultFinalTabela = [];

    ArrayTabela.map(Elementos=>{
        if(Elementos.Aluno != undefined){
            if(Elementos.Aluno != 'Aluno'){
                ResultFinalTabela.push(Elementos);
            }
        }
     })   
     console.table(ResultFinalTabela)       
}   

accessSpreadsheet();
