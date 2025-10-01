document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES Y CONSTANTES GLOBALES ---
    const screens = {
        start: document.getElementById('start-screen'),
        rules: document.getElementById('rules-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };

    const gameSounds = {
        correct: new Audio('sounds/correct.mp3'),
        wrong: new Audio('sounds/wrong.mp3'),
        suspense: new Audio('sounds/suspense.mp3'),
        win: new Audio('sounds/win.mp3'),
        start: new Audio('sounds/start_game.mp3')
    };
    
    const trackList = [
        'musica/pista-tecnologica-1.mp3',
        'musica/pista-tecnologica-2.mp3',
        'musica/pista-tecnologica-3.mp3',
    ];
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4; 
    }
    // ------------------------------------

    const buttons = {
        start: document.getElementById('start-btn'),
        showRules: document.getElementById('rules-btn'),
        backToStart: document.getElementById('back-to-start-btn'),
        startFromRules: document.getElementById('start-from-rules-btn'),
        reveal: document.getElementById('reveal-btn'),
        next: document.getElementById('next-btn'),
        hint: document.getElementById('wildcard-50-50'), 
        audience: document.getElementById('wildcard-audience'), 
        phone: document.getElementById('wildcard-call'), 
        
        restartFail: document.getElementById('restart-fail-btn'),
        backToStartFail: document.getElementById('back-to-start-fail-btn'),
        restartWin: document.getElementById('restart-win-btn'),
        backToStartWin: document.getElementById('back-to-start-win-btn'),
    };

    const gameElements = {
        playerNameInput: document.getElementById('player-name'), // NUEVO: Campo de nombre
        question: document.getElementById('question'),
        answers: document.getElementById('answer-options'),
        roundsList: document.getElementById('rounds-list'),
        audiencePoll: document.getElementById('audience-poll'),
        phoneTimer: document.getElementById('phone-timer'),
        timerDisplay: document.getElementById('timer-display'),
        finalScoreDisplay: document.getElementById('final-score-display'),
        winTitle: document.getElementById('win-title'),
        fireworksContainer: document.getElementById('fireworks-container'),
        rotatingCircle: document.getElementById('rotating-circle'),
        // NUEVO: Elemento que se va a desvanecer en la pantalla de inicio
        startScreenContent: document.querySelector('#start-screen .screen-content')
    };
    
    // --- VARIABLES DE ESTADO ---
    let phoneTimerInterval = null;
    let isPhoneUsed = false;
    let isAudienceUsed = false;
    let isHintUsed = false;
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let playerName = ''; // NUEVO: Almacena el nombre del jugador

    // --- DATOS DEL JUEGO (Preguntas y Puntos - Sin cambios) ---
    const questions = [
        { question: "¿Qué libro de la Biblia contiene los Diez Mandamientos?", answers: ["Hechos", "1 Corintios", "Exodo", "Levitico"], correctAnswer: 2 },
        { question: "¿Qué profeta fue llevado al cielo en un carro de fuego?", answers: ["Samuel", "Elias", "Enoc", "Isaias"], correctAnswer: 1 },
        { question: "¿Qué rey de Israel escribió muchos de los Salmos?", answers: ["Salomon", "Saul", "Acab", "David"], correctAnswer: 3 },
        { question: "¿Qué interpretó inicialmente Eli sobre Ana cuando la encontró orando en el templo?", answers: ["Que estaba pidiendo bendiciones", "Que estaba rezando en voz alta", "Que estaba celebrando una victoria", "Que estaba ebria"], correctAnswer: 3 },
        { question: "Pregunta 5: ¿Qué profeta menor es conocido por su libro que contiene una oración que empieza;¿hasta cuando, oh Jehova clamare, y no oirás;?", answers: ["Nahum", "Habacuc", "Oseas", "Daniel"], correctAnswer: 1 },
        { question: "Pregunta 6: En Génesis, ¿cuál de los patriarcas recibió la promesa de que su descendencia sería tan numerosa como las estrellas, pero tardó años en ver cumplida la promesa?", answers: ["Jacob", "Jose", "Abraham", "Isaac"], correctAnswer: 2 },
        { question: "Pregunta 7: ¿En qué libro se describe la visión de un carro de fuego que toma a Elías al cielo?", answers: ["Hechos", "2 Samuel", "1 Reyes", "2 Reyes"], correctAnswer: 3 },
        { question: "Pregunta 8: ¿Cuál mujer fue jueza y líder de Israel según dice la Biblia?", answers: ["Debora", "Ana", "Ester", "Rut"], correctAnswer: 0 },
        { question: "Pregunta 9: ¿Cómo se llamaba la esposa de Moises?", answers: ["Mirian", "Sefora", "Mical", "Agar"], correctAnswer: 1 },
        { question: "Pregunta 10: ¿Qué profeta habló sobre un valle de huesos secos y una restauración?", answers: ["Jeremias", "Daniel", "Ezequiel", "Eliseo"], correctAnswer: 2 },
        { question: "Pregunta 11: Ella Hospedo a Sisara capitán del ejercito de Jabin, y lo mato, ¿Cuál es el nombre de esta mujer?", answers: ["Abigail", "Asael", "Ester", "Jael"], correctAnswer: 3 },
        { question: "Pregunta 12: ¿Cuál es el mandamiento que resume toda la ley y los profetas?", answers: ["Amar a tus padres con todo tu corazón, alma y mente", "No Matar", "Amar al prójimo como a ti mismo", "No Juzgar"], correctAnswer: 2 },
        { question: "Pregunta 13: ¿Qué color era la vaca que Dios le dijo a Moises y a Aaron que le llevaran al sacerdote Eleazar?", answers: ["Roja", "Blanca", "Negra", "Manchada"], correctAnswer: 0 },
        { question: "Pregunta 14: ¿Qué pasaje describe a un mensajero preparando el camino para un linaje davídico restaurado, sin mencionar explícitamente a Jesús?", answers: ["Malaquias 2", "Isaias 11", "Miqueas 6", "Hechos 1"], correctAnswer: 1 },
        { question: "Pregunta 15: ¿Cómo se llamaba el rey de Israel que sacrificó en el fuego a su hijo?", answers: ["Joaz", "Acaz", "Joacaz", "Salomon"], correctAnswer: 1 }
    ];

    const roundPoints = [
        100, 200, 300, 500, 1000,
        2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000
    ];

    // =========================================================
    // FUNCIÓN TYPEWRITER (Sin cambios, pero crucial)
    // =========================================================
    function typeWriterEffect(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('typewriter-anim');
        void element.offsetWidth; // Forzar reflow
        element.classList.add('typewriter-anim');
        // Asegúrate de que el número de steps en el CSS sea correcto (13 para ¡FELICIDADES!)
    }
    // =========================================================
    
    // --- FUNCIÓN DE TRANSICIÓN DE PANTALLAS ---
    function showScreen(screenId) {
        for (let key in screens) {
            if (screens[key]) {
                screens[key].classList.remove('active');
            }
        }
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }
        
        // Limpiar efectos visuales al cambiar de pantalla
        if (gameElements.fireworksContainer) gameElements.fireworksContainer.classList.add('hidden');
        if (gameElements.rotatingCircle) gameElements.rotatingCircle.classList.add('hidden');
    }
    
    // --- FUNCIONES DE MANEJO DE AUDIO (Sin cambios) ---
    function playSound(soundKey, loop = false) {
        stopAllSounds();
        const sound = gameSounds[soundKey];
        if (sound) {
            sound.loop = loop;
            sound.play().catch(e => console.error("Error al reproducir el audio:", e));
        }
    }

    function stopAllSounds() {
        for (const key in gameSounds) {
            if (gameSounds[key]) {
                gameSounds[key].pause();
                gameSounds[key].currentTime = 0;
            }
        }
    }
    
    function playRandomTrack() {
        if (!backgroundMusic || trackList.length === 0) return;
        const randomIndex = Math.floor(Math.random() * trackList.length);
        const selectedTrack = trackList[randomIndex];
        backgroundMusic.src = selectedTrack;
        backgroundMusic.play().catch(error => {
            console.warn("Música de fondo no se reprodujo automáticamente.");
        });
    }

    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.removeEventListener('ended', playRandomTrack); 
        }
    }
    
    function startBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.removeEventListener('ended', playRandomTrack);
            backgroundMusic.addEventListener('ended', playRandomTrack);
            playRandomTrack();
        }
    }
    
    // --- FUNCIÓN DE INICIO DE JUEGO OPTIMIZADA (NUEVO) ---
    function startGame() {
        const inputName = gameElements.playerNameInput ? gameElements.playerNameInput.value.trim() : 'Jugador Anónimo';
        
        if (inputName.length === 0) {
            alert("Por favor, introduce tu nombre para empezar.");
            gameElements.playerNameInput.focus();
            return;
        }

        playerName = inputName; // Guarda el nombre globalmente

        stopBackgroundMusic(); 
        stopAllSounds();
        playSound('start'); // Sonido de inicio de juego

        currentQuestionIndex = 0;
        isPhoneUsed = false;
        isAudienceUsed = false;
        isHintUsed = false;
        
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        
        // Limpiar animación de victoria
        if (gameElements.winTitle) {
            gameElements.winTitle.classList.remove('typewriter-anim');
            gameElements.winTitle.textContent = "";
        }
        
        // Ejecutar el desvanecimiento de la pantalla de inicio
        if (gameElements.startScreenContent) {
            gameElements.startScreenContent.classList.add('fade-out');
            
            setTimeout(() => {
                showScreen('game'); // Cambia a la pantalla de juego
                loadQuestion();
                // Retira el desvanecimiento para el siguiente ciclo
                gameElements.startScreenContent.classList.remove('fade-out'); 
            }, 500); // 500ms coincide con la duración de la transición CSS
        } else {
             // Fallback si no hay elemento de contenido
             showScreen('game');
             loadQuestion();
        }
    }
    // --- RESTO DE FUNCIONES DEL JUEGO (Omitidas para simplificar, ya estaban correctas) ---
    
    function generateRoundsList() {
         // ... tu código de generateRoundsList ...
         if (!gameElements.roundsList) return; 

         gameElements.roundsList.innerHTML = '';
         roundPoints.slice().reverse().forEach((points, index) => {
             const roundNumber = 15 - index;
             const li = document.createElement('li');
             li.dataset.round = roundNumber - 1; 
             li.innerHTML = `<span>Ronda ${roundNumber}</span><span>${points.toLocaleString()} Pts</span>`;
             gameElements.roundsList.appendChild(li);
         });
     }

     function updateRoundsHighlight() {
         // ... tu código de updateRoundsHighlight ...
         if (!gameElements.roundsList) return;

         const rounds = gameElements.roundsList.querySelectorAll('li');
         rounds.forEach(li => li.classList.remove('current-round'));

         const currentRoundLi = gameElements.roundsList.querySelector(`li[data-round="${currentQuestionIndex}"]`);
         if (currentRoundLi) {
             currentRoundLi.classList.add('current-round');
         }
     }

     function loadQuestion() {
         // ... tu código de loadQuestion ...
         selectedAnswer = null;
         gameElements.answers.innerHTML = '';
         buttons.reveal.style.display = 'inline-block';
         buttons.next.style.display = 'none';

         // 🧹 Limpieza de Comodines/Temporizador
         if (gameElements.audiencePoll) gameElements.audiencePoll.classList.add('hidden');
         if (gameElements.phoneTimer) {
             gameElements.phoneTimer.classList.add('hidden');
             gameElements.timerDisplay.classList.remove('timer-urgent'); 
         }
         
         if (phoneTimerInterval !== null) {
             clearInterval(phoneTimerInterval);
             phoneTimerInterval = null;
         }
             
         if (buttons.restartFail) buttons.restartFail.style.display = 'none';
         if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none'; 

         // Mostrar/Ocultar y habilitar/deshabilitar botones de comodines
         if (buttons.hint) {
             buttons.hint.style.display = isHintUsed ? 'none' : 'inline-block';
             buttons.hint.disabled = isHintUsed;
             if(isHintUsed) buttons.hint.classList.add('used'); else buttons.hint.classList.remove('used'); 
         }
         if (buttons.audience) {
             buttons.audience.style.display = isAudienceUsed ? 'none' : 'inline-block';
             buttons.audience.disabled = isAudienceUsed;
             if(isAudienceUsed) buttons.audience.classList.add('used'); else buttons.audience.classList.remove('used');
         }
         if (buttons.phone) {
             buttons.phone.style.display = isPhoneUsed ? 'none' : 'inline-block';
             buttons.phone.disabled = isPhoneUsed;
             if(isPhoneUsed) buttons.phone.classList.add('used'); else buttons.phone.classList.remove('used');
         }

         // 🔊 Reproducir música de suspenso
         playSound('suspense', true); 
     
         const currentQuestion = questions[currentQuestionIndex];
         gameElements.question.textContent = currentQuestion.question;

         currentQuestion.answers.forEach((answer, index) => {
             const button = document.createElement('button');
             button.textContent = String.fromCharCode(65 + index) + ": " + answer; 
             button.classList.add('answer-btn');
             button.dataset.index = index;
             button.style.visibility = 'visible'; 
             button.addEventListener('click', selectAnswer);
             gameElements.answers.appendChild(button);
         });

         updateRoundsHighlight();
     }

     function selectAnswer(event) {
         // ... tu código de selectAnswer ...
         const previouslySelected = document.querySelector('.answer-btn.selected');
         if (previouslySelected) {
             previouslySelected.classList.remove('selected');
         }
         const selectedButton = event.target;
         selectedAnswer = parseInt(selectedButton.dataset.index);
         selectedButton.classList.add('selected');
     }

     function revealAnswer() {
         // ... tu código de revealAnswer ...
         if (selectedAnswer === null) {
             alert("Por favor, selecciona una respuesta.");
             return;
         }

         const currentQuestion = questions[currentQuestionIndex];
         const correctIndex = currentQuestion.correctAnswer;
         const answerButtons = document.querySelectorAll('.answer-btn');

         // Detener temporizador y limpiar urgencia al revelar
         if (phoneTimerInterval !== null) {
             clearInterval(phoneTimerInterval);
             phoneTimerInterval = null;
         }
         if (gameElements.phoneTimer) {
             gameElements.phoneTimer.classList.add('hidden');
             gameElements.timerDisplay.classList.remove('timer-urgent'); 
         }
         
         // Deshabilitar botones de comodines para la pregunta actual
         if (buttons.hint) buttons.hint.disabled = true;
         if (buttons.audience) buttons.audience.disabled = true;
         if (buttons.phone) buttons.phone.disabled = true;
         
         // 🔊 Detener el suspenso inmediatamente
         stopAllSounds(); 

         let isCorrect = (selectedAnswer === correctIndex);

         // 🔊 Lógica de Sonido
         if (isCorrect) {
             playSound('correct'); 
         } else {
             playSound('wrong'); 
         }

         // Lógica de Resaltado de Respuestas (omisión de detalles)
         answerButtons.forEach(button => {
             button.disabled = true;
             const buttonIndex = parseInt(button.dataset.index);
             if (buttonIndex === correctIndex) {
                 button.classList.add('correct');
             } else if (buttonIndex === selectedAnswer) {
                 button.classList.add('wrong');
             }
         });

         buttons.reveal.style.display = 'none';
         
         if (isCorrect) {
             if (currentQuestionIndex === questions.length - 1) {
                 buttons.next.textContent = "Ver Resultado Final";
             }
             buttons.next.style.display = 'inline-block';
         } else {
             // El jugador PERDIÓ (omisión de detalles)
             const winAmountIndex = (currentQuestionIndex >= 10) ? 9 : (currentQuestionIndex >= 5) ? 4 : -1;
             const finalScore = winAmountIndex >= 0 ? roundPoints[winAmountIndex] : 0;
             
             gameElements.question.textContent = "¡Respuesta Incorrecta! El juego ha terminado.";
             gameElements.answers.innerHTML = `<p style="font-size: 1.6em; color: #ff536aff;">Perdiste esta vez, pero la biblia dice en Filipenses 4:9 En cuanto a lo que habéis aprendido, recibido y oído de mí, y visto en mí, eso haced; y el Dios de la paz estará con vosotros... tu puntuacion es.: ${finalScore.toLocaleString()} Pts</p>`;
             buttons.next.style.display = 'none';
             
             if (buttons.restartFail) {
                 buttons.restartFail.style.display = 'inline-block';
                 buttons.restartFail.textContent = "Volver a Intentarlo"; 
                 buttons.restartFail.classList.add('restart-btn-fail'); 
             }
             if (buttons.backToStartFail) {
                 buttons.backToStartFail.style.display = 'inline-block';
                 buttons.backToStartFail.textContent = "Ir a Inicio"; 
                 buttons.backToStartFail.classList.add('back-to-start-fail-btn'); 
             }
         }
     } 

     // =========================================================
     // FUNCIÓN DE VICTORIA CON ENVÍO DE DATOS
     // =========================================================
     function nextQuestion() {
         if (currentQuestionIndex === questions.length - 1) {
             
             stopAllSounds(); 
             playSound('win'); 
             stopBackgroundMusic(); 
             
             showScreen('win'); 
             
             const winText = "¡FELICIDADES!";
             if (gameElements.winTitle) {
                 typeWriterEffect(gameElements.winTitle, winText);
             }
             
             if (gameElements.fireworksContainer) {
                  gameElements.fireworksContainer.classList.remove('hidden'); 
             }
             if (gameElements.rotatingCircle) {
                  gameElements.rotatingCircle.classList.remove('hidden'); 
             }

             const finalPrize = roundPoints[14].toLocaleString();
             
             if (gameElements.finalScoreDisplay) {
                 gameElements.finalScoreDisplay.textContent = `¡Has ganado el gran premio de ${finalPrize} Pts, ${playerName}!`;
                 gameElements.finalScoreDisplay.classList.remove('visible'); 
                 if (buttons.restartWin) buttons.restartWin.style.display = 'none';
                 if (buttons.backToStartWin) buttons.backToStartWin.style.display = 'none';
             }
             
             // Envía el resultado a FormSubmit
             sendToFormSubmit(playerName, roundPoints[14]);

             // Secuencia de animación de victoria
             setTimeout(() => {
                 if(gameElements.finalScoreDisplay) gameElements.finalScoreDisplay.classList.add('visible');
             }, 3000); 

             setTimeout(() => {
                 if(buttons.restartWin) buttons.restartWin.style.display = 'inline-block';
                 if(buttons.backToStartWin) buttons.backToStartWin.style.display = 'inline-block';
             }, 4000);
             
         } else {
             currentQuestionIndex++;
             loadQuestion();
         }
     } 

     // =========================================================
     // NUEVA FUNCIÓN: ENVÍO DE DATOS A FORMSUBMIT
     // Asegúrate de reemplazar 'TU_URL_FORMSUBMIT' con la URL real de tu formulario.
     // =========================================================
     function sendToFormSubmit(player, score) {
        const formData = new FormData();
        formData.append('Nombre', player);
        formData.append('Puntuacion', `${score.toLocaleString()} Pts`);
        formData.append('Resultado', 'VICTORIA (1,000,000 Pts)');

        const formUrl = 'https://formsubmit.co/el/gehali'; // <-- ¡REEMPLAZA ESTO!

        fetch(formUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Resultado enviado exitosamente a FormSubmit.");
            } else {
                console.error("Error al enviar el resultado a FormSubmit.");
            }
        })
        .catch(error => {
            console.error("Error de red al intentar enviar el formulario:", error);
        });
     }
     // =========================================================


     // --- FUNCIONES DE COMODINES (Omitidas para simplificar, ya estaban correctas) ---
     function useHint() {
         // ... tu código de useHint ...
         if (isHintUsed) return;
         isHintUsed = true;
         buttons.hint.disabled = true;
         if (buttons.hint) buttons.hint.classList.add('used');
         
         const currentQuestion = questions[currentQuestionIndex];
         const correctIndex = currentQuestion.correctAnswer;
         const answerButtons = document.querySelectorAll('.answer-btn');
         
         const incorrectIndices = [];
         answerButtons.forEach((btn, index) => {
             if (index !== correctIndex && btn.style.visibility !== 'hidden') {
                 incorrectIndices.push(index);
             }
         });

         while (incorrectIndices.length > 1) {
             const randomIndex = Math.floor(Math.random() * incorrectIndices.length);
             const indexToRemove = incorrectIndices.splice(randomIndex, 1)[0];
             answerButtons[indexToRemove].style.visibility = 'hidden';
             answerButtons[indexToRemove].disabled = true; 
         }
     }

     function useAudience() {
         // ... tu código de useAudience ...
         if (isAudienceUsed) return;
         isAudienceUsed = true;
         buttons.audience.disabled = true;
         if (buttons.audience) buttons.audience.classList.add('used');

         const currentQuestion = questions[currentQuestionIndex];
         const correctIndex = currentQuestion.correctAnswer;
         const percentages = [0, 0, 0, 0];
         let remaining = 100;

         const correctPercentage = Math.floor(Math.random() * 40) + 50; 
         percentages[correctIndex] = correctPercentage;
         remaining -= correctPercentage;

         const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
         
         for (let i = 0; i < incorrectIndices.length; i++) {
             const index = incorrectIndices[i];
             
             if (i === incorrectIndices.length - 1) {
                 percentages[index] = remaining;
             } else {
                 const maxAllocation = Math.min(remaining, Math.floor(remaining / (incorrectIndices.length - i)) * 2 || 1);
                 let randomPart = Math.floor(Math.random() * maxAllocation);
                 if (randomPart === 0 && remaining > 0) randomPart = 1;
                 
                 percentages[index] = randomPart;
                 remaining -= randomPart;
             }
         }
         
         if (!gameElements.audiencePoll) return;
         gameElements.audiencePoll.classList.remove('hidden');

         document.querySelectorAll('.poll-bar').forEach((bar, index) => {
             const pollPercentage = bar.querySelector('.poll-percentage');
             if (pollPercentage) {
                 pollPercentage.style.height = percentages[index] + '%';
                 pollPercentage.textContent = percentages[index] + '%';
             }
         });
     }

     function usePhone() {
         // ... tu código de usePhone ...
         if (isPhoneUsed) return;
         isPhoneUsed = true;
         buttons.phone.disabled = true;
         if (buttons.phone) buttons.phone.classList.add('used');

         if (!gameElements.phoneTimer || !gameElements.timerDisplay) return;
         
         gameElements.phoneTimer.classList.remove('hidden');
         let timeLeft = 60;
         gameElements.timerDisplay.textContent = timeLeft;

         if (phoneTimerInterval !== null) clearInterval(phoneTimerInterval);
         
         phoneTimerInterval = setInterval(() => {
             timeLeft--;
             gameElements.timerDisplay.textContent = timeLeft;
             
             // --- MODIFICACIÓN: Lógica de Urgencia del Temporizador ---
             if (timeLeft <= 10) {
                 gameElements.timerDisplay.classList.add('timer-urgent');
             } else {
                 gameElements.timerDisplay.classList.remove('timer-urgent');
             }
             // --------------------------------------------------------
             
             if (timeLeft <= 0) {
                 clearInterval(phoneTimerInterval);
                 phoneTimerInterval = null;
                 gameElements.phoneTimer.classList.add('hidden');
                 gameElements.timerDisplay.classList.remove('timer-urgent'); 
                 alert("Tiempo de llamada agotado.");
             }
         }, 1000);
         
         setTimeout(() => {
             const currentQuestion = questions[currentQuestionIndex];
             const correctText = String.fromCharCode(65 + currentQuestion.correctAnswer);
             alert(`Tu amigo dice: 'Estoy 90% seguro de que la respuesta correcta es la ${correctText}.'`);
         }, 10000); 
     }

    // --- EVENT LISTENERS (MANEJO DE CLICKS) ---

    // CLAVE: Usa el nuevo flujo startGame con el desvanecimiento
    if (buttons.start) buttons.start.addEventListener('click', startGame);
    if (buttons.startFromRules) buttons.startFromRules.addEventListener('click', startGame);
    
    if (buttons.showRules) buttons.showRules.addEventListener('click', () => { 
        showScreen('rules'); 
        startBackgroundMusic(); 
    });

    if (buttons.backToStart) buttons.backToStart.addEventListener('click', () => { showScreen('start'); startBackgroundMusic(); }); 
    
    if (buttons.reveal) buttons.reveal.addEventListener('click', revealAnswer);
    if (buttons.next) buttons.next.addEventListener('click', nextQuestion);
    
    // Escuchadores de comodines
    if (buttons.hint) buttons.hint.addEventListener('click', useHint);
    if (buttons.audience) buttons.audience.addEventListener('click', useAudience);
    if (buttons.phone) buttons.phone.addEventListener('click', usePhone);

    // Listener para el botón de Reinicio (dentro del juego)
    if (buttons.restartFail) buttons.restartFail.addEventListener('click', () => {
        stopAllSounds(); 
        startGame();
        buttons.restartFail.style.display = 'none'; 
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none'; 
    });

    // LISTENER PARA EL BOTÓN DE VOLVER A INICIO (después de Fallar)
    if (buttons.backToStartFail) buttons.backToStartFail.addEventListener('click', () => {
        stopAllSounds(); 
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        showScreen('start');
        startBackgroundMusic(); 
        
        if (buttons.restartFail) buttons.restartFail.style.display = 'none'; 
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none'; 
    });
    
    // Listeners de la Pantalla de Victoria
    if (buttons.restartWin) buttons.restartWin.addEventListener('click', () => {
        stopAllSounds(); 
        startGame();
    });

    if (buttons.backToStartWin) buttons.backToStartWin.addEventListener('click', () => {
        stopAllSounds(); 
        showScreen('start');
        startBackgroundMusic(); 
    });

    // --- INICIALIZACIÓN DEL JUEGO ---
    generateRoundsList();
    showScreen('start');
    startBackgroundMusic(); 
});