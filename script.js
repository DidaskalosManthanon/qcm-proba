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