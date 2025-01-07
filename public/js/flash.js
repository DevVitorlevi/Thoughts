document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todas as mensagens flash
    const flashMessages = document.querySelectorAll('.flash-card');

    // Define um timer para remover as mensagens do DOM após 2 segundos
    setTimeout(() => {
        flashMessages.forEach(message => {
            message.remove();
        });
    }, 5000); 
});

