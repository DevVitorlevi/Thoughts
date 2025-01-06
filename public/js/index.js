const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const form = document.getElementById('form')
const inputs = document.querySelectorAll('.input')
const required = document.querySelectorAll('.required')
const eye = document.querySelector('.bi-eye')


document.addEventListener('keypress', ev =>{
    if(ev.key === 'Enter'){
        ImpedirEnvio(ev)
    }
})
form.addEventListener('submit', ImpedirEnvio)
function ImpedirEnvio(ev){
    const erros = [ValidarEmail(),ValidarNome(),ValidarSenha(),ConfimaSenha()]
    if(erros.includes(false)){
        ev.preventDefault()
    }
}
function CaseError(index){
    inputs[index].style.border = '1px solid red'
    required[index].style.display = 'block'
}
function NotError(index){
    inputs[index].style.border = ''
    required[index].style.display = 'none'
}

inputs[0].addEventListener('input', ValidarNome)
inputs[1].addEventListener('input', ValidarEmail)
inputs[2].addEventListener('input',ValidarSenha)
inputs[3].addEventListener('input',ConfimaSenha)

function ValidarNome(){
    if(inputs[0].value.length == 0){
        CaseError(0)
    }else{
        NotError(0)
    }
}
function ValidarEmail(){
    if(emailRegex.test(inputs[1].value)){
        NotError(1)
    }else{
        CaseError(1)
    }
}
function ValidarSenha(){
    if(inputs[2].value.length < 8){
        CaseError(2)
    }
    else{
        NotError(2)
    }
}
function ConfimaSenha(){
    if(inputs[3].value === inputs[2].value){
        NotError(3)
    }else{
        CaseError(3)
    }
}

eye.addEventListener('click', ()=>{
    if(inputs[2].type ==='password'||inputs[3].type ==='password'){
        inputs[2].setAttribute('type','text')
        inputs[3].setAttribute('type','text')
        eye.classList.replace('bi-eye', 'bi-eye-slash')
    }else{
        inputs[2].setAttribute('type','password')
        inputs[3].setAttribute('type','password')
        eye.classList.replace('bi-eye-slash', 'bi-eye')
    }
})

