document.addEventListener('DOMContentLoaded', () => {

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

    const allGameSoundFiles = Object.values(gameSounds);
    let audioUnlocked = false;


    const trackList = [
        'musica/pista-tecnologica-1.mp3',
        'musica/pista-tecnologica-2.mp3',
        'musica/pista-tecnologica-3.mp3',
    ];
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }


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

        toggleRounds: document.getElementById('toggle-rounds-btn'),

        restartFail: document.getElementById('restart-fail-btn'),
        backToStartFail: document.getElementById('back-to-start-fail-btn'),
        restartWin: document.getElementById('restart-win-btn'),
        backToStartWin: document.getElementById('back-to-start-win-btn'),
    };

    const gameElements = {
        playerNameInput: document.getElementById('player-name'),
        question: document.getElementById('question'),
        answers: document.getElementById('answer-options'),
        roundsList: document.getElementById('rounds-list'),
        roundsContainer: document.getElementById('rounds-container'),
        audiencePoll: document.getElementById('audience-poll'),
        phoneTimer: document.getElementById('phone-timer'),
        timerDisplay: document.getElementById('timer-display'),
        finalScoreDisplay: document.getElementById('final-score-display'),
        winTitle: document.getElementById('win-title'),
        fireworksContainer: document.getElementById('fireworks-container'),
        rotatingCircle: document.getElementById('rotating-circle'),
        startScreenContent: document.querySelector('#start-screen .screen-content')
    };


    let phoneTimerInterval = null;
    let isPhoneUsed = false;
    let isAudienceUsed = false;
    let isHintUsed = false;
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let playerName = '';

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 1: Banco completo de 60 preguntas
    //    Tu antigua constante `questions` ha sido reemplazada.
    // =========================================================
    const allAvailableQuestions = [
        // --- 15 PREGUNTAS ORIGINALES DEL USUARIO ---
        { question: "¿Qué libro de la Biblia contiene los Diez Mandamientos?", answers: ["Hechos", "1 Corintios", "Exodo", "Levitico"], correctAnswer: 2 },
        { question: "¿Qué profeta fue llevado al cielo en un carro de fuego?", answers: ["Samuel", "Elias", "Enoc", "Isaias"], correctAnswer: 1 },
        { question: "¿Qué rey de Israel escribió muchos de los Salmos?", answers: ["Salomon", "Saul", "Acab", "David"], correctAnswer: 3 },
        { question: "¿Qué interpretó inicialmente Eli sobre Ana cuando la encontró orando en el templo?", answers: ["Que estaba pidiendo bendiciones", "Que estaba rezando en voz alta", "Que estaba celebrando una victoria", "Que estaba ebria"], correctAnswer: 3 },
        { question: "¿Qué profeta menor es conocido por su libro que contiene una oración que empieza;¿hasta cuando, oh Jehova clamare, y no oirás;?", answers: ["Nahum", "Habacuc", "Oseas", "Daniel"], correctAnswer: 1 },
        { question: "En Génesis, ¿cuál de los patriarcas recibió la promesa de que su descendencia sería tan numerosa como las estrellas, pero tardó años en ver cumplida la promesa?", answers: ["Jacob", "Jose", "Abraham", "Isaac"], correctAnswer: 2 },
        { question: "¿En qué libro se describe la visión de un carro de fuego que toma a Elías al cielo?", answers: ["Hechos", "2 Samuel", "1 Reyes", "2 Reyes"], correctAnswer: 3 },
        { question: "¿Cuál mujer fue jueza y líder de Israel según dice la Biblia?", answers: ["Debora", "Ana", "Ester", "Rut"], correctAnswer: 0 },
        { question: "¿Cómo se llamaba la esposa de Moises?", answers: ["Mirian", "Sefora", "Mical", "Agar"], correctAnswer: 1 },
        { question: "¿Qué profeta habló sobre un valle de huesos secos y una restauración?", answers: ["Jeremias", "Daniel", "Ezequiel", "Eliseo"], correctAnswer: 2 },
        { question: "Ella Hospedo a Sisara capitán del ejercito de Jabin, y lo mato, ¿Cuál es el nombre de esta mujer?", answers: ["Abigail", "Asael", "Ester", "Jael"], correctAnswer: 3 },
        { question: "¿Cuál es el mandamiento que resume toda la ley y los profetas?", answers: ["Amar a tus padres con todo tu corazón, alma y mente", "No Matar", "Amar al prójimo como a ti mismo", "No Juzgar"], correctAnswer: 2 },
        { question: "¿Qué color era la vaca que Dios le dijo a Moises y a Aaron que le llevaran al sacerdote Eleazar?", answers: ["Roja", "Blanca", "Negra", "Manchada"], correctAnswer: 0 },
        { question: "¿Qué pasaje describe a un mensajero preparando el camino para un linaje davídico restaurado, sin mencionar explícitamente a Jesús?", answers: ["Malaquias 2", "Isaias 11", "Miqueas 6", "Hechos 1"], correctAnswer: 1 },
        { question: "¿Cómo se llamaba el rey de Israel que sacrificó en el fuego a su hijo?", answers: ["Joaz", "Acaz", "Joacaz", "Salomon"], correctAnswer: 1 },
        // --- 45 PREGUNTAS NUEVAS ---
        { question: "¿Quién fue el primer hombre creado por Dios?", answers: ["Set", "Noé", "Adán", "Abel"], correctAnswer: 2 },
        { question: "¿Cuál era el nombre original de Abraham antes de que Dios se lo cambiara?", answers: ["Isaac", "Jacob", "Abrán", "Aram"], correctAnswer: 2 },
        { question: "¿Cuál de los hijos de Jacob fue vendido como esclavo por sus hermanos?", answers: ["Rubén", "Benjamín", "Judá", "José"], correctAnswer: 3 },
        { question: "¿Cuál fue la primera plaga que afectó a Egipto?", answers: ["Granizo", "Muerte de Primogénitos", "Agua convertida en sangre", "Ranas"], correctAnswer: 2 },
        { question: "¿Qué alimento proveyó Dios a los israelitas en el desierto después de la carne?", answers: ["Codornices", "Dátiles", "Carne de camello", "Miel"], correctAnswer: 0 },
        { question: "¿Cuántos días y noches llovió durante el diluvio universal?", answers: ["7 días y 7 noches", "40 días y 40 noches", "150 días", "12 días"], correctAnswer: 1 },
        { question: "¿Quién fue el sucesor de Moisés para guiar a Israel a la Tierra Prometida?", answers: ["Aarón", "Caleb", "Josué", "Eliseo"], correctAnswer: 2 },
        { question: "¿Qué joven pastor mató al gigante Goliat?", answers: ["Saúl", "Jonatán", "David", "Absalón"], correctAnswer: 2 },
        { question: "¿Quién fue el primer rey de Israel ungido por Samuel?", answers: ["David", "Saúl", "Salomón", "Jeroboam"], correctAnswer: 1 },
        { question: "¿Qué rey fue conocido por su gran riqueza y sabiduría, pero cayó en la idolatría?", answers: ["David", "Ezequías", "Salomón", "Acab"], correctAnswer: 2 },
        { question: "¿Qué profeta desafió a los 450 profetas de Baal en el Monte Carmelo?", answers: ["Eliseo", "Jonás", "Miqueas", "Elías"], correctAnswer: 3 },
        { question: "¿Qué ciudad cayó después de que los israelitas marcharon alrededor de ella durante siete días?", answers: ["Gabaón", "Betel", "Jericó", "Ai"], correctAnswer: 2 },
        { question: "¿Qué mujer se casó con un rey persa y salvó a su pueblo de un complot de exterminio?", answers: ["Rut", "Rebeca", "Ester", "Mical"], correctAnswer: 2 },
        { question: "¿Quién fue tragado por un gran pez por desobedecer el mandato de Dios de ir a Nínive?", answers: ["Malaquías", "Jonás", "Abdías", "Sofonías"], correctAnswer: 1 },
        { question: "¿Qué profeta fue arrojado al foso de los leones y sobrevivió?", answers: ["Jeremías", "Ezequiel", "Daniel", "Amós"], correctAnswer: 2 },
        { question: "¿En qué libro se encuentra el famoso pasaje: 'Jehová es mi pastor, nada me faltará'?", answers: ["Proverbios", "Isaías", "Salmos", "Job"], correctAnswer: 2 },
        { question: "¿Quién fue el primer mártir cristiano, apedreado por predicar?", answers: ["Pedro", "Esteban", "Santiago", "Felipe"], correctAnswer: 1 },
        { question: "¿En qué ciudad nació Jesús?", answers: ["Nazaret", "Jerusalén", "Belén", "Jericó"], correctAnswer: 2 },
        { question: "¿Quién fue el precursor de Jesús que bautizaba en el río Jordán?", answers: ["Pedro", "Juan el Amado", "Juan el Bautista", "Mateo"], correctAnswer: 2 },
        { question: "¿Cuál fue el primer milagro de Jesús, realizado en Caná de Galilea?", answers: ["Alimentar a 5000", "Calmar la tormenta", "Sanar a un leproso", "Convertir el agua en vino"], correctAnswer: 3 },
        { question: "¿Cuántos discípulos principales eligió Jesús?", answers: ["10", "15", "12", "7"], correctAnswer: 2 },
        { question: "¿Qué apóstol negó a Jesús tres veces antes de que cantara el gallo?", answers: ["Judas Iscariote", "Tomás", "Pedro", "Andrés"], correctAnswer: 2 },
        { question: "¿Quién traicionó a Jesús por 30 piezas de plata?", answers: ["Judas Iscariote", "Simón el Zelote", "Barrabás", "Poncio Pilato"], correctAnswer: 0 },
        { question: "¿Cuál es el sermón más famoso de Jesús que contiene las Bienaventuranzas?", answers: ["Sermón del Olivo", "Sermón del Llano", "Sermón de la Montaña", "Sermón de Lázaro"], correctAnswer: 2 },
        { question: "¿Quién era el gobernador romano que condenó a Jesús a la crucifixión?", answers: ["Herodes Antipas", "Agripa", "Poncio Pilato", "César Augusto"], correctAnswer: 2 },
        { question: "¿Qué apóstol era conocido como 'el mellizo' y dudó de la resurrección de Jesús?", answers: ["Tomás", "Bartolomé", "Felipe", "Santiago"], correctAnswer: 0 },
        { question: "¿Cuál fue el apóstol que inicialmente perseguía a los cristianos antes de su conversión en el camino a Damasco?", answers: ["Bernabé", "Timoteo", "Pablo", "Lucas"], correctAnswer: 2 },
        { question: "¿Qué libro narra el inicio de la Iglesia y el derramamiento del Espíritu Santo en Pentecostés?", answers: ["Romanos", "Gálatas", "Hechos de los Apóstoles", "Hebreos"], correctAnswer: 2 },
        { question: "¿Quién es el autor del libro de Apocalipsis?", answers: ["Pedro", "Pablo", "Juan", "Judas"], correctAnswer: 2 },
        { question: "¿Cuál de las epístolas de Pablo contiene el famoso capítulo sobre el amor (Capítulo 13)?", answers: ["Gálatas", "Romanos", "Efesios", "1 Corintios"], correctAnswer: 3 },
        { question: "¿Qué libro del Nuevo Testamento es conocido por su énfasis en que 'la fe sin obras es muerta'?", answers: ["Santiago", "Hebreos", "2 Pedro", "1 Juan"], correctAnswer: 0 },
        { question: "¿En qué idioma se escribió originalmente la mayor parte del Nuevo Testamento?", answers: ["Hebreo", "Latín", "Arameo", "Griego Koiné"], correctAnswer: 3 },
        { question: "¿En qué isla recibió Juan la revelación que escribió en el Apocalipsis?", answers: ["Creta", "Chipre", "Patmos", "Malta"], correctAnswer: 2 },
        { question: "¿Quién fue la madre de Samuel, quien lo dedicó al servicio de Dios en el templo?", answers: ["Séfora", "Débora", "Ana", "Rebeca"], correctAnswer: 2 },
        { question: "¿Quién fue el hombre que caminó con Dios y Dios se lo llevó sin que muriera?", answers: ["Matusalén", "Noé", "Enoc", "Elías"], correctAnswer: 2 },
        { question: "¿A quién le dio Dios el mandamiento de construir el arca para salvar a su familia y a los animales del diluvio?", answers: ["Adán", "Noé", "Moisés", "Abraham"], correctAnswer: 1 },
        { question: "¿Qué le dio Esaú a Jacob a cambio de su primogenitura?", answers: ["Una túnica", "Un terreno", "Un guisado de lentejas", "Diez ovejas"], correctAnswer: 2 },
        { question: "¿Qué mar dividió Moisés usando su vara?", answers: ["Mar Muerto", "Mar Mediterráneo", "Mar Rojo", "Mar de Galilea"], correctAnswer: 2 },
        { question: "¿Cuál es el nombre del ángel que anunció el nacimiento de Jesús a María?", answers: ["Miguel", "Rafael", "Samael", "Gabriel"], correctAnswer: 3 },
        { question: "¿Qué comida multiplicó Jesús para alimentar a 5,000 personas?", answers: ["Pan y aceite", "Uvas y vino", "Panes y peces", "Cordero y pan"], correctAnswer: 2 },
        { question: "¿Cómo se llamaba la mujer que ayudó a los espías israelitas en Jericó?", answers: ["Jael", "Dalila", "Mical", "Rahab"], correctAnswer: 3 },
        { question: "¿Cuántos libros tiene el Nuevo Testamento?", answers: ["27", "39", "12", "40"], correctAnswer: 0 },
        { question: "¿Qué hombre del Antiguo Testamento fue conocido por su extrema paciencia y sufrimiento?", answers: ["Jeremías", "Jonás", "Job", "David"], correctAnswer: 2 },
        { question: "¿Quién era la madre de Juan el Bautista?", answers: ["María", "Raquel", "Elisabet", "Lidia"], correctAnswer: 2 },
        { question: "¿Qué profeta es conocido por la profecía de las setenta semanas?", answers: ["Jeremías", "Ezequiel", "Isaías", "Daniel"], correctAnswer: 3 },
        // --- COMIENZA EL NUEVO BLOQUE DE 60 PREGUNTAS (TÍTULOS ELIMINADOS) ---
        { question: "¿Qué criatura convenció a Eva para que desobedeciera a Dios en el Edén?", answers: ["Un cuervo", "La serpiente", "Un ángel", "Un león"], correctAnswer: 1 },
        { question: "¿Cuál fue la señal del pacto de Dios con Noé después del diluvio?", answers: ["El arcoíris", "Una paloma", "Una roca", "El agua"], correctAnswer: 0 },
        { question: "¿Cuántos días ayunó Jesús en el desierto?", answers: ["7 días", "40 días", "21 días", "12 días"], correctAnswer: 1 },
        { question: "¿Cómo se llamaba la madre de Jesús?", answers: ["Elisabet", "Ana", "María", "Marta"], correctAnswer: 2 },
        { question: "¿Qué apóstol era recaudador de impuestos antes de seguir a Jesús?", answers: ["Pedro", "Mateo", "Juan", "Judas Iscariote"], correctAnswer: 1 },
        { question: "¿Quién fue el sumo sacerdote que conspiró para arrestar a Jesús?", answers: ["Herodes", "Caifás", "Pilato", "Anás"], correctAnswer: 1 },
        { question: "¿Qué ciudad se menciona como el lugar donde los seguidores de Jesús fueron llamados 'cristianos' por primera vez?", answers: ["Jerusalén", "Antioquía", "Roma", "Corinto"], correctAnswer: 1 },
        { question: "¿Qué hombre ayudó a Jesús a llevar la cruz al Calvario?", answers: ["Lázaro", "Simón de Cirene", "José de Arimatea", "Nicodemo"], correctAnswer: 1 },
        { question: "¿A quién le dijo Jesús: 'Deja que los muertos entierren a sus muertos'?", answers: ["Un fariseo", "Un discípulo", "Pedro", "Tomás"], correctAnswer: 1 },
        { question: "¿Cuántos hermanos varones se mencionan de Jesús?", answers: ["Uno", "Dos", "Cuatro", "Siete"], correctAnswer: 2 },
        { question: "¿Qué rey ordenó la matanza de todos los niños varones menores de dos años en Belén?", answers: ["Rey Acaz", "Rey Saúl", "Rey Herodes", "Rey Nabucodonosor"], correctAnswer: 2 },
        { question: "¿Cuál fue el nombre del hijo de Abraham que nació de Agar, la sierva egipcia?", answers: ["Isaac", "Jacob", "Esaú", "Ismael"], correctAnswer: 3 },
        { question: "¿Qué le ocurrió a Sodoma y Gomorra?", answers: ["Fueron inundadas", "Fueron tragadas por la tierra", "Fueron destruidas con fuego y azufre", "Fueron sitiadas por un ejército"], correctAnswer: 2 },
        { question: "¿Qué pariente de Abraham se salvó de la destrucción de Sodoma?", answers: ["Lot", "Esaú", "Isaac", "Melquisedec"], correctAnswer: 0 },
        { question: "¿Quién le cortó el cabello a Sansón, quitándole su fuerza?", answers: ["Dalila", "Rut", "Jael", "Ester"], correctAnswer: 0 },
        { question: "¿En qué río fue bautizado Jesús por Juan el Bautista?", answers: ["Río Nilo", "Río Tigris", "Río Jordán", "Mar de Galilea"], correctAnswer: 2 },
        { question: "¿Qué hizo Jesús por un hombre llamado Lázaro?", answers: ["Lo sanó de lepra", "Lo resucitó de entre los muertos", "Lo alimentó", "Lo bautizó"], correctAnswer: 1 },
        { question: "¿Cuál es el último libro del Antiguo Testamento?", answers: ["Zacarías", "Malaquías", "Ezequiel", "Oseas"], correctAnswer: 1 },
        { question: "¿Cuál es el primer libro del Nuevo Testamento?", answers: ["Hechos", "Marcos", "Lucas", "Mateo"], correctAnswer: 3 },
        { question: "¿Quién fue el primer hombre en morir a manos de su hermano?", answers: ["Abel", "Set", "Caín", "Enoc"], correctAnswer: 0 },
        { question: "¿Cómo se llamaban las dos hermanas de Lázaro?", answers: ["Sara y Rebeca", "María y Elisabet", "Marta y María", "Rut y Noemí"], correctAnswer: 2 },
        { question: "¿Qué profeta se lamentó de la destrucción de Jerusalén en el Antiguo Testamento?", answers: ["Isaías", "Jeremías", "Daniel", "Amós"], correctAnswer: 1 },
        { question: "¿Qué visión tuvo el apóstol Pedro que lo convenció de que los gentiles eran aceptados por Dios?", answers: ["Un ángel volando", "Un lienzo lleno de animales impuros", "La escalera de Jacob", "Un rollo sellado"], correctAnswer: 1 },
        { question: "¿Cuál es el tema principal de la Epístola de Santiago?", answers: ["La justificación por la fe", "La fe y las obras", "El amor de Dios", "La resurrección"], correctAnswer: 1 },
        { question: "¿Qué ciudad se menciona en el libro de Apocalipsis como la 'Gran Ramera' o 'Babilonia la Grande'?", answers: ["Persia", "Roma", "Tiro", "Esmirna"], correctAnswer: 1 },
        { question: "¿Cuál fue el regalo que Jacob le hizo a su hijo José y que provocó la envidia de sus hermanos?", answers: ["Un rebaño", "Una túnica de colores", "Una tierra fértil", "Un buey"], correctAnswer: 1 },
        { question: "¿Qué instrumento usó Gedeón, junto con sus 300 hombres, para derrotar al ejército madianita?", answers: ["Espadas y arcos", "Lanzas y escudos", "Cántaros, antorchas y trompetas", "Hondas y piedras"], correctAnswer: 2 },
        { question: "¿Qué comida comieron los israelitas por primera vez al entrar en la Tierra Prometida?", answers: ["Pan sin levadura", "Maná", "Trigo tostado", "Fruto de la tierra"], correctAnswer: 3 },
        { question: "¿Cómo se llamaba el primer hijo de Adán y Eva?", answers: ["Set", "Abel", "Caín", "Enoc"], correctAnswer: 2 },
        { question: "¿Quién era el carpintero de Nazaret que se casó con María?", answers: ["Juan", "Simón", "José", "Zacarías"], correctAnswer: 2 },
        { question: "¿Cuál era el nombre del discípulo que ocupó el lugar de Judas Iscariote entre los doce apóstoles?", answers: ["Bernabé", "Matías", "Silas", "Timoteo"], correctAnswer: 1 },
        { question: "¿Qué profeta fue contemporáneo de Daniel en Babilonia y tuvo la visión del carro de Dios?", answers: ["Esdras", "Ezequiel", "Hageo", "Nahum"], correctAnswer: 1 },
        { question: "¿Quién fue la madre de Juan el Bautista?", answers: ["María", "Elisabet", "Ana", "Rebeca"], correctAnswer: 1 },
        { question: "¿Cuál es el significado del nombre 'Emanuel', profetizado en Isaías?", answers: ["Dios es amor", "Dios es mi fuerza", "Dios con nosotros", "Paz de Dios"], correctAnswer: 2 },
        { question: "¿Qué hombre fue conocido como el 'amigo de Dios'?", answers: ["Moisés", "Noé", "David", "Abraham"], correctAnswer: 3 },
        { question: "¿Qué milagro realizó Jesús en el Monte de los Olivos poco antes de su arresto?", answers: ["Sanó a un ciego", "Multiplicó panes", "Sanó la oreja del siervo del sumo sacerdote", "Caminó sobre el agua"], correctAnswer: 2 },
        { question: "¿Qué animal le habló a Balaam cuando intentaba maldecir a Israel?", answers: ["Un caballo", "Una vaca", "Un asna", "Un camello"], correctAnswer: 2 },
        { question: "¿Cuál de las siguientes es una Epístola Pastoral de Pablo?", answers: ["Romanos", "Gálatas", "Timoteo", "Filemón"], correctAnswer: 2 },
        { question: "¿Cuántos hijos tuvo Jacob en total?", answers: ["Diez", "Once", "Doce", "Catorce"], correctAnswer: 2 },
        { question: "¿Qué hizo David después de matar a Goliat?", answers: ["Corrió al templo", "Tomó la espada de Goliat", "Lo enterró", "Huyó de Saúl"], correctAnswer: 1 },
        { question: "¿En qué ciudad profetizó Jonás, inicialmente a regañadientes?", answers: ["Samaria", "Babilonia", "Nínive", "Sodoma"], correctAnswer: 2 },
        { question: "¿Qué profeta es conocido por la 'Batalla de Armagedón' y la 'Nueva Jerusalén'?", answers: ["Isaías", "Apocalipsis", "Ezequiel", "Joel"], correctAnswer: 1 },
        { question: "¿Quién escribió la mayor parte del Nuevo Testamento (en términos de número de libros)?", answers: ["Pedro", "Juan", "Pablo", "Lucas"], correctAnswer: 2 },
        { question: "¿Cuál fue el primer libro que Pablo escribió, probablemente?", answers: ["Romanos", "Gálatas", "1 Tesalonicenses", "Hebreos"], correctAnswer: 2 },
        { question: "¿Qué se conmemora en la fiesta judía de la Pascua (Pésaj)?", answers: ["La dedicación del Templo", "La liberación de Egipto", "El día del perdón", "El diluvio"], correctAnswer: 1 },
        { question: "¿Quién era el esposo de Noemí y padre de Mahlón y Quelión?", answers: ["Booz", "Elimelec", "Obed", "Salmón"], correctAnswer: 1 },
        { question: "¿Qué le pidió Salomón a Dios cuando se le apareció en sueños?", answers: ["Riqueza", "Sabiduría", "Una larga vida", "Derrotar a sus enemigos"], correctAnswer: 1 },
        { question: "¿Qué es el 'Maná' que Dios proveyó a Israel en el desierto?", answers: ["Carne de aves", "Peces grandes", "Pan del cielo", "Agua fresca"], correctAnswer: 2 },
        { question: "¿Cuál era la profesión de Lucas, el autor del Evangelio de Lucas y Hechos?", answers: ["Pescador", "Tejedor", "Médico", "Zapatero"], correctAnswer: 2 },
        { question: "¿Qué fue lo primero que hizo Jesús después de ser bautizado?", answers: ["Comenzó a predicar", "Fue tentado en el desierto", "Hizo su primer milagro", "Eligió a sus discípulos"], correctAnswer: 1 },
        { question: "¿Qué criatura marina se comió a Jonás?", answers: ["Una ballena", "Un tiburón", "Un gran pez", "Un cocodrilo"], correctAnswer: 2 },
        { question: "¿Qué rey hizo que se construyera el Templo de Jerusalén?", answers: ["David", "Acaz", "Salomón", "Herodes"], correctAnswer: 2 },
        { question: "¿Cuál es el mandamiento que se considera el 'primero y grande'?", answers: ["Honra a tu padre y a tu madre", "No matarás", "Amarás a Dios sobre todas las cosas", "No tendrás dioses ajenos"], correctAnswer: 2 },
        { question: "¿Cuál fue el nombre original del apóstol Pedro?", answers: ["Saulo", "Felipe", "Simón", "Judas"], correctAnswer: 2 },
        { question: "¿Qué apóstol era el hermano de Pedro?", answers: ["Jacobo", "Juan", "Andrés", "Mateo"], correctAnswer: 2 },
        { question: "¿Quién fue el libertador que dirigió al pueblo de Israel fuera de Egipto?", answers: ["Josué", "Elías", "Moisés", "Aarón"], correctAnswer: 2 },
        { question: "¿Cuál fue la esposa de Abraham que dio a luz a Isaac?", answers: ["Agar", "Rebeca", "Sara", "Raquel"], correctAnswer: 2 },
        { question: "¿Cuál fue el castigo de la esposa de Lot por mirar hacia Sodoma?", answers: ["Se convirtió en ceniza", "Se convirtió en estatua de sal", "Se quedó ciega", "Fue tragada por la tierra"], correctAnswer: 1 },
        { question: "¿Cuántos libros tiene el Antiguo Testamento (en la Biblia protestante)?", answers: ["27", "39", "66", "45"], correctAnswer: 1 },
        { question: "¿Qué palabra griega se usa a menudo para referirse a la segunda venida de Cristo?", answers: ["Koinonía", "Parousía", "Agape", "Logos"], correctAnswer: 1 }
    // --- FINAL DEL NUEVO BLOQUE DE 60 PREGUNTAS ---
    ];

    // ⭐ NUEVA VARIABLE: Contendrá el set de 15 preguntas para la partida actual
    let currentRoundQuestions = [];


    const roundPoints = [
        100, 200, 300, 500, 1000,
        2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000
    ];


    function unlockAudio() {
        if (audioUnlocked) return;

        allGameSoundFiles.forEach(sound => {
            sound.volume = 0;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = 1.0;
                audioUnlocked = true;
                console.log("Audio desbloqueado por interacción del usuario.");
            }).catch(e => {
                // Posible error si el navegador aún bloquea.
            });
        });
    }
    function typeWriterEffect(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('typewriter-anim');
        void element.offsetWidth;
        element.classList.add('typewriter-anim');
    }

    function showScreen(screenId) {
        for (let key in screens) {
            if (screens[key]) {
                screens[key].classList.remove('active');
            }
        }
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }

        if (gameElements.fireworksContainer) gameElements.fireworksContainer.classList.add('hidden');
        if (gameElements.rotatingCircle) gameElements.rotatingCircle.classList.add('hidden');
    }

    function playSound(soundKey, loop = false) {

        if (!audioUnlocked && soundKey !== 'win') return;

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

    // =========================================================
    // ⭐ NUEVA FUNCIÓN: Selecciona 15 preguntas al azar sin repetición
    // =========================================================
    function selectRandomQuestions() {
        const requiredQuestions = 15;

        // 1. Crea una copia del banco completo y lo mezcla (Fisher-Yates)
        const shuffled = [...allAvailableQuestions];
        let currentIndex = shuffled.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
        }

        // 2. Selecciona las primeras 15 preguntas para la ronda
        currentRoundQuestions = shuffled.slice(0, requiredQuestions);

        if (currentRoundQuestions.length < requiredQuestions) {
            console.warn(`Advertencia: Solo se encontraron ${currentRoundQuestions.length} preguntas.`);
        }
    }

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 2: Llama a selectRandomQuestions() al reiniciar
    // =========================================================
    function resetGameState() {
        currentQuestionIndex = 0;
        isPhoneUsed = false;
        isAudienceUsed = false;
        isHintUsed = false;
        selectedAnswer = null;

        // ¡Aquí se prepara el nuevo set de 15 preguntas para la partida!
        selectRandomQuestions(); 

        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }

        if (gameElements.winTitle) {
            gameElements.winTitle.classList.remove('typewriter-anim');
            gameElements.winTitle.textContent = "";
        }
        if (gameElements.finalScoreDisplay) {
            gameElements.finalScoreDisplay.classList.remove('visible');
        }

        if (buttons.hint) buttons.hint.classList.remove('used');
        if (buttons.audience) buttons.audience.classList.remove('used');
        if (buttons.phone) buttons.phone.classList.remove('used');

        if (gameElements.roundsContainer) {
            gameElements.roundsContainer.classList.remove('minimized');
            if (buttons.toggleRounds) buttons.toggleRounds.textContent = 'Ocultar Rondas ⬅️';
        }

        stopBackgroundMusic();
        stopAllSounds();
    }

    function showFinalScreen() {
        resetGameState();
        stopBackgroundMusic();

        showScreen('win');

        playSound('win');

        const winText = "¡FELICIDADES!";
        const finalPrize = roundPoints[14].toLocaleString();

        if (gameElements.winTitle) {
            typeWriterEffect(gameElements.winTitle, winText);
        }
        if (gameElements.fireworksContainer) {
            gameElements.fireworksContainer.classList.remove('hidden');
        }
        if (gameElements.rotatingCircle) {
            gameElements.rotatingCircle.classList.remove('hidden');
        }

        setTimeout(() => {
            if (gameElements.finalScoreDisplay) {
                gameElements.finalScoreDisplay.textContent = `¡Has ganado el gran premio de ${finalPrize} Pts, ${playerName}!`;
                gameElements.finalScoreDisplay.classList.add('visible');
            }
        }, 1500);

        setTimeout(() => {
            if(buttons.restartWin) buttons.restartWin.style.display = 'inline-block';
            if(buttons.backToStartWin) buttons.backToStartWin.style.display = 'inline-block';
        }, 2500);


        if (buttons.restartWin) buttons.restartWin.style.display = 'none';
        if (buttons.backToStartWin) buttons.backToStartWin.style.display = 'none';


        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    function startGame() {
        const inputName = gameElements.playerNameInput ? gameElements.playerNameInput.value.trim() : 'Jugador Anónimo';

        if (inputName.length === 0) {
            alert("Por favor, introduce tu nombre para empezar.");
            gameElements.playerNameInput.focus();
            return;
        }

        playerName = inputName;
        resetGameState();
        playSound('start');

        if (gameElements.startScreenContent) {
            gameElements.startScreenContent.classList.add('fade-out');

            setTimeout(() => {
                showScreen('game');
                loadQuestion();
                gameElements.startScreenContent.classList.remove('fade-out');
            }, 500);
        } else {
            showScreen('game');
            loadQuestion();
        }
    }

    function toggleRounds() {
        if (!gameElements.roundsContainer || !buttons.toggleRounds) return;

        gameElements.roundsContainer.classList.toggle('minimized');

        const isMinimized = gameElements.roundsContainer.classList.contains('minimized');
        buttons.toggleRounds.textContent = isMinimized ? 'Mostrar Rondas ➡️' : 'Ocultar Rondas ⬅️';
    }

    function generateRoundsList() {
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
        if (!gameElements.roundsList) return;

        const rounds = gameElements.roundsList.querySelectorAll('li');
        rounds.forEach(li => li.classList.remove('current-round'));

        const currentRoundLi = gameElements.roundsList.querySelector(`li[data-round="${currentQuestionIndex}"]`);
        if (currentRoundLi) {
            currentRoundLi.classList.add('current-round');
            currentRoundLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 3: Usa el set de preguntas de la ronda actual
    // =========================================================
    function loadQuestion() {
        selectedAnswer = null;
        gameElements.answers.innerHTML = '';
        buttons.reveal.style.display = 'inline-block';
        buttons.next.style.display = 'none';

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

        if (buttons.hint) {
            buttons.hint.style.display = 'inline-block';
            buttons.hint.disabled = isHintUsed;
            if(isHintUsed) buttons.hint.classList.add('used'); else buttons.hint.classList.remove('used');
        }
        if (buttons.audience) {
            buttons.audience.style.display = 'inline-block';
            buttons.audience.disabled = isAudienceUsed;
            if(isAudienceUsed) buttons.audience.classList.add('used'); else buttons.audience.classList.remove('used');
        }
        if (buttons.phone) {
            buttons.phone.style.display = 'inline-block';
            buttons.phone.disabled = isPhoneUsed;
            if(isPhoneUsed) buttons.phone.classList.add('used'); else buttons.phone.classList.remove('used');
        }

        playSound('suspense', true);

        // Uso de currentRoundQuestions en lugar de questions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
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
        const previouslySelected = document.querySelector('.answer-btn.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        const selectedButton = event.target;
        selectedAnswer = parseInt(selectedButton.dataset.index);
        selectedButton.classList.add('selected');
    }

    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 4: Usa currentRoundQuestions en revealAnswer()
    // =========================================================
    function revealAnswer() {
        if (selectedAnswer === null) {
            alert("Por favor, selecciona una respuesta.");
            return;
        }

        // Uso de currentRoundQuestions
        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const answerButtons = document.querySelectorAll('.answer-btn');
        if (phoneTimerInterval !== null) {
            clearInterval(phoneTimerInterval);
            phoneTimerInterval = null;
        }
        if (gameElements.phoneTimer) {
            gameElements.phoneTimer.classList.add('hidden');
            gameElements.timerDisplay.classList.remove('timer-urgent');
        }

        if (buttons.hint) buttons.hint.disabled = true;
        if (buttons.audience) buttons.audience.disabled = true;
        if (buttons.phone) buttons.phone.disabled = true;

        stopAllSounds();

        let isCorrect = (selectedAnswer === correctIndex);

        if (isCorrect) {
            playSound('correct');
        } else {
            playSound('wrong');
        }

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
            // Uso de currentRoundQuestions.length
            if (currentQuestionIndex === currentRoundQuestions.length - 1) {
                buttons.next.textContent = "Ver Resultado Final";
            }
            buttons.next.style.display = 'inline-block';
        } else {

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
    // ⭐ MODIFICACIÓN CLAVE 5: Usa currentRoundQuestions.length en nextQuestion()
    // =========================================================
    function nextQuestion() {
        if (currentQuestionIndex === currentRoundQuestions.length - 1) {

            sendToFormSubmit(playerName, roundPoints[14]);

            showScreen('win');

            stopAllSounds();
            stopBackgroundMusic();

        } else {
            currentQuestionIndex++;
            loadQuestion();
        }
    }


    function sendToFormSubmit(player, score) {
        const finalPrize = score.toLocaleString();

        const formUrl = 'https://formsubmit.co/elias230012@gmail.com';

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = formUrl;
        form.style.display = 'none';

        const fields = {
            'Nombre': player,
            'Puntuacion': `${finalPrize} Pts`,
            'Resultado': 'VICTORIA (1,000,000 Pts)',

            '_next': window.location.href.split('#')[0] + '#win',

            '_captcha': 'false'
        };

        for (const name in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = fields[name];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();

        console.log("Resultado enviado a FormSubmit. El navegador se redirigirá con el marcador #win.");
    }
    
    // =========================================================
    // ⭐ MODIFICACIÓN CLAVE 6: Usa currentRoundQuestions en comodines
    // =========================================================
    function useHint() {
        if (isHintUsed) return;
        isHintUsed = true;
        buttons.hint.disabled = true;
        if (buttons.hint) buttons.hint.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
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
        if (isAudienceUsed) return;
        isAudienceUsed = true;
        buttons.audience.disabled = true;
        if (buttons.audience) buttons.audience.classList.add('used');

        const currentQuestion = currentRoundQuestions[currentQuestionIndex];
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
            if (timeLeft <= 10) {
                gameElements.timerDisplay.classList.add('timer-urgent');
            } else {
                gameElements.timerDisplay.classList.remove('timer-urgent');
            }

            if (timeLeft <= 0) {
                clearInterval(phoneTimerInterval);
                phoneTimerInterval = null;
                gameElements.phoneTimer.classList.add('hidden');
                gameElements.timerDisplay.classList.remove('timer-urgent');
                alert("Tiempo de llamada agotado.");
            }
        }, 1000);

        setTimeout(() => {
            const currentQuestion = currentRoundQuestions[currentQuestionIndex];
            const correctText = String.fromCharCode(65 + currentQuestion.correctAnswer);
            alert(`Tu amigo dice: 'Estoy 90% seguro de que la respuesta correcta es la ${correctText}.'`);
        }, 10000);
    }
    
    if (buttons.start) buttons.start.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });
    if (buttons.startFromRules) buttons.startFromRules.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });

    if (buttons.toggleRounds) buttons.toggleRounds.addEventListener('click', toggleRounds);

    if (buttons.showRules) buttons.showRules.addEventListener('click', () => {
        showScreen('rules');
        startBackgroundMusic();
    });

    if (buttons.backToStart) buttons.backToStart.addEventListener('click', () => { showScreen('start'); startBackgroundMusic(); });

    if (buttons.reveal) buttons.reveal.addEventListener('click', revealAnswer);
    if (buttons.next) buttons.next.addEventListener('click', nextQuestion);
    if (buttons.hint) buttons.hint.addEventListener('click', useHint);
    if (buttons.audience) buttons.audience.addEventListener('click', useAudience);
    if (buttons.phone) buttons.phone.addEventListener('click', usePhone);
    if (buttons.restartFail) buttons.restartFail.addEventListener('click', () => {
        startGame();
        buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.backToStartFail) buttons.backToStartFail.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();

        if (buttons.restartFail) buttons.restartFail.style.display = 'none';
        if (buttons.backToStartFail) buttons.backToStartFail.style.display = 'none';
    });
    if (buttons.restartWin) buttons.restartWin.addEventListener('click', () => {
        startGame();
    });

    if (buttons.backToStartWin) buttons.backToStartWin.addEventListener('click', () => {
        resetGameState();
        showScreen('start');
        startBackgroundMusic();
    });
    generateRoundsList();

    const hash = window.location.hash;

    if (hash === '#win') {
        audioUnlocked = true;
        playerName = 'Campeón';
        setTimeout(() => {
            showFinalScreen();
        }, 100);

    } else {
        showScreen('start');
        startBackgroundMusic();
    }
});