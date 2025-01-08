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
    const erros = [ValidarEmail(),ValidarSenha()]
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

inputs[0].addEventListener('input', ValidarEmail)
inputs[1].addEventListener('input', ValidarSenha)



function ValidarEmail(){
    if(emailRegex.test(inputs[0].value)){
        NotError(0)
    }else{
        CaseError(0)
    }
}
function ValidarSenha(){
    if(inputs[1].value.length < 8){
        CaseError(1)
    }
    else{
        NotError(1)
    }
}
eye.addEventListener('click', ()=>{
    if(inputs[1].type ==='password'){
        inputs[1].setAttribute('type','text')
        eye.classList.replace('bi-eye', 'bi-eye-slash')
    }else{
        inputs[1].setAttribute('type','password')
        eye.classList.replace('bi-eye-slash', 'bi-eye')
    }
})

