// GeoGebra configuration for the first graph
const ggbApp1 = new GGBApplet({
    appName: 'graphingC2F',
    width: 1180,
    height: 500,
    showToolBar: true,
    showAlgebraInput: true,
    showMenuBar: true,
    enableRightClick: false,
    enableShiftDragZoom: true,
    showResetIcon: true,
    //language: 'fr',
    appletOnLoad: function(api) {
        api.evalCommand('f(x) = 1.8x + 32');
        api.evalCommand('h(x) = x');
        api.evalCommand('SetColor(f, 1, 0, 0)');
        api.evalCommand('SetColor(h, 0, 1, 0)');
        api.evalCommand('ZoomIn(-50, -50, 50, 50)');
        //ggb.evalCommand('A = (0, 0)');
        //ggb.evalCommand('SetPointStyle(A, 1)');

    }
}, true);
ggbApp1.inject('celsius2fahrenheit');


const ggbApp2 = new GGBApplet({
    appName: 'graphingF2C',
    width: 1180,
    height: 500,
    showToolBar: true,
    showAlgebraInput: true,
    showMenuBar: true,
    enableRightClick: false,
    enableShiftDragZoom: true,
    showResetIcon: true,
    //language: 'fr',
    appletOnLoad: function(api) {
        api.evalCommand('f(x) = 1.8x + 32');
        api.evalCommand('g(x) = (x - 32)/1.8');
        api.evalCommand('h(x) = x');
        api.evalCommand('SetColor(f, 1, 0, 0)');
        api.evalCommand('SetColor(g, 0, 1, 0)');
        api.evalCommand('SetColor(h, 0, 0, 1)');
        api.evalCommand('ZoomIn(-50, -50, 50, 50)');
        //ggb.evalCommand('A = (0, 0)');
        //ggb.evalCommand('SetPointStyle(A, 1)');

    }
}, true);
ggbApp2.inject('fahrenheit2celsius');

// Sélectionner tous les boutons radio avec l'attribut data-correct
const questions = document.querySelectorAll('.question');
const submitButton = document.getElementById('submit-btn');
const scoreDisplay = document.getElementById('score-display');
const questionPointsList = document.getElementById('question-points');

// Ajouter un gestionnaire d'événements au bouton "Soumettre"
submitButton.addEventListener('click', () => {
  let totalScore = 0;
  const totalPoints = Array.from(questions).reduce((sum, q) => sum + parseFloat(q.getAttribute('data-points') || 1), 0);
  const questionDetails = [];

  // Parcourir chaque question
  questions.forEach(question => {
    const type = question.getAttribute('data-type'); // Type de question (radio ou checkbox)
    const options = question.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    const correctOptions = Array.from(options).filter(option => option.hasAttribute('data-correct'));
    const maxPoints = parseFloat(question.getAttribute('data-points')) || 1; // Points max pour la question

    let partialScore = 0;

    if (type === 'radio') {
      // Traitement pour les boutons radio
      const selectedOption = Array.from(options).find(option => option.checked);
      if (selectedOption && selectedOption.hasAttribute('data-correct')) {
        partialScore = maxPoints; // Ajouter les points si la réponse sélectionnée est correcte
      }
    } else if (type === 'checkbox') {
      // Traitement pour les cases à cocher
      const selectedOptions = Array.from(options).filter(option => option.checked);
      const correctSelected = selectedOptions.filter(option => option.hasAttribute('data-correct'));
      const incorrectSelected = selectedOptions.filter(option => !option.hasAttribute('data-correct'));

      // Éviter les divisions par zéro
      const correctRatio = correctOptions.length > 0 ? correctSelected.length / correctOptions.length : 0;
      const penalty = incorrectSelected.length > 0 ? 0 : 1; // Pénalité si une mauvaise réponse est cochée

      // Calculer le score pour cette question
      partialScore = Math.max(0, correctRatio * penalty) * maxPoints;
    }

    totalScore += partialScore;
    questionDetails.push({ maxPoints, partialScore });
  });

  // Calculer le pourcentage de bonnes réponses
  const percentage = ((totalScore / totalPoints) * 100).toFixed(2);

  // Afficher le score total
  scoreDisplay.textContent = `Vous avez ${totalScore.toFixed(2)} / ${totalPoints}, soit ${percentage}% de bonnes réponses.`;

  // Afficher les points attribués par question
  questionPointsList.innerHTML = '';
  questionDetails.forEach((detail, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Question ${index + 1} : ${detail.partialScore.toFixed(2)} / ${detail.maxPoints}`;
    questionPointsList.appendChild(listItem);
  });
});




// Simulateur de pile ou face
document.addEventListener('DOMContentLoaded', function() {
    // Création de l'interface du simulateur
    const simulatorHTML = `
        <article id="coin-simulator">
            <h3>Simulateur de pile ou face</h3>
            <div class="simulator-controls">
                <label for="num-flips">Nombre de lancers :</label>
                <select id="num-flips">
                    <option value="10">10</option>
                    <option value="100">100</option>
                    <option value="1000">1 000</option>
                    <option value="10000">10 000</option>
                    <option value="100000">100 000</option>
                    <option value="1000000">1 000 000</option>
                </select>
                <button id="flip-btn">Lancer</button>
            </div>
            <div class="results">
                <p>Nombre de piles : <span id="heads-count">0</span></p>
                <p>Nombre de faces : <span id="tails-count">0</span></p>
                <p>Fréquence de pile : <span id="heads-frequency">0</span></p>
            </div>
            <div id="probability-quiz" style="display: none;">
                <p>Quelle est la probabilité d'obtenir pile ?</p>
                <ol class="resp" id="quiz-options">
                    <!-- Les options seront générées dynamiquement -->
                </ol>
                <button id="check-answer-btn">Vérifier la réponse</button>
                <p id="quiz-feedback"></p>
            </div>
        </article>
    `;

    // Insertion du simulateur dans la section "À vous de jouer"
    const yourGameSection = document.getElementById('yourgame');
    yourGameSection.insertAdjacentHTML('afterbegin', simulatorHTML);

    // Gestion des événements
    document.getElementById('flip-btn').addEventListener('click', runSimulation);

    function runSimulation() {
        const numFlips = parseInt(document.getElementById('num-flips').value);
        let heads = 0;
        let tails = 0;

        // Simulation des lancers
        for (let i = 0; i < numFlips; i++) {
            if (Math.random() < 0.5) {
                heads++;
            } else {
                tails++;
            }
        }

        // Affichage des résultats
        document.getElementById('heads-count').textContent = heads;
        document.getElementById('tails-count').textContent = tails;
        const frequency = (heads / numFlips).toFixed(6);
        document.getElementById('heads-frequency').textContent = frequency;

        // Préparation du quiz
        setupQuiz(heads, numFlips);
    }

    function setupQuiz(heads, total) {
        const quizDiv = document.getElementById('probability-quiz');
        const optionsList = document.getElementById('quiz-options');
        optionsList.innerHTML = '';

        // Calcul des options
        const correctFraction = `${heads}/${total}`;
        const correctDecimal = (heads / total).toFixed(3);
        const closeDecimal = (Math.random() < 0.5 ? 
                            (heads / total + 0.02).toFixed(3) : 
                            (heads / total - 0.02).toFixed(3));

        // Options du quiz
        const options = [
            { text: "1/2", correct: false },
            { text: correctFraction, correct: true },
            { text: "0.5", correct: false },
            { text: closeDecimal, correct: false }
        ];

        // Mélange des options
        options.sort(() => Math.random() - 0.5);

        // Création des éléments du quiz
        options.forEach((option, index) => {
            const li = document.createElement('li');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'quiz-option';
            input.id = `quiz-opt-${index}`;
            input.dataset.correct = option.correct;

            const label = document.createElement('label');
            label.htmlFor = `quiz-opt-${index}`;
            label.textContent = option.text;

            li.appendChild(input);
            li.appendChild(label);
            optionsList.appendChild(li);
        });

        // Affichage du quiz
        quizDiv.style.display = 'block';

        // Gestion de la vérification de la réponse
        document.getElementById('check-answer-btn').addEventListener('click', checkAnswer);
    }

    function checkAnswer() {
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        const feedback = document.getElementById('quiz-feedback');

        if (!selectedOption) {
            feedback.textContent = "Veuillez sélectionner une réponse.";
            feedback.style.color = 'red';
            return;
        }

        if (selectedOption.dataset.correct === 'true') {
            feedback.textContent = "Correct ! La probabilité observée est bien le rapport entre le nombre de piles et le nombre total de lancers.";
            feedback.style.color = 'green';
        } else {
            feedback.textContent = "Incorrect. La bonne réponse est le rapport entre le nombre de piles et le nombre total de lancers.";
            feedback.style.color = 'red';
        }
    }
});