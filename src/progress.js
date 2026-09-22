const studentsData = require("./data.js");

function normaliserNom(nom) {
  return nom.trim().replace(/\s+/g, " ").toLowerCase();
}

function validerResultat(resultat) {
  if (resultat.jour < 1 || resultat.jour > 7) {
    console.log("Erreur : le jour doit être compris entre 1 et 7.");
    return false;
  }

  if (resultat.exercicesTermines > resultat.totalExercices) {
    console.log(
      "Erreur : les exercices terminés ne peuvent pas dépasser le total.",
    );
    return false;
  }

  return true;
}

function enregistrerResultat(id, resultat) {
  const student = studentsData.find(function (student) {
    return student.id === id;
  });

  if (!student) {
    return false;
  }

  if (!validerResultat(resultat)) {
    return false;
  }

  const existingResult = student.results.find(function (result) {
    return result.jour === resultat.jour;
  });

  if (existingResult) {
    existingResult.exercicesTermines = resultat.exercicesTermines;
    existingResult.totalExercices = resultat.totalExercices;
    existingResult.challengeTermine = resultat.challengeTermine;

    return true;
  }

  student.results.push(resultat);

  return true;
}

function ajouterApprenant(id, name, city) {
  const existingStudent = studentsData.find(function (student) {
    return student.id === id;
  });

  if (existingStudent) {
    return false;
  }

  studentsData.push({
    id: id,
    name: normaliserNom(name),
    city: city,
    results: [],
  });

  return true;
}

function rechercherApprenant(recherche) {
  const rechercheNormalisee = normaliserNom(recherche);

  const resultats = studentsData.filter(function (student) {
    return normaliserNom(student.name).includes(rechercheNormalisee);
  });

  return resultats;
}

function calculerProgression(id) {
  const student = studentsData.find(function (student) {
    return student.id === id;
  });

  if (!student) {
    return 0;
  }

  let exercicesTermines = 0;
  let totalExercices = 0;

  for (let result of student.results) {
    exercicesTermines += result.exercicesTermines;
    totalExercices += result.totalExercices;
  }

  if (totalExercices === 0) {
    return 0;
  }

  const progression = (exercicesTermines / totalExercices) * 100;

  return progression;
}

function filtrerParNiveau(niveau) {
  const resultats = [];

  for (let student of studentsData) {
    const progression = calculerProgression(student.id);

    let niveauStudent;

    if (progression >= 80) {
      niveauStudent = "Solid";
    } else if (progression >= 50) {
      niveauStudent = "In Progress";
    } else {
      niveauStudent = "Needs Reinforcement";
    }

    if (niveauStudent === niveau) {
      resultats.push(student);
    }
  }

  return resultats;
}

function trierParProgression(students) {
  const resultat = [...students];

  resultat.sort(function (a, b) {
    return calculerProgression(b.id) - calculerProgression(a.id);
  });

  return resultat;
}

function afficherTableauDeBord() {
  const totalApprenants = studentsData.length;

  let sommeProgressions = 0;
  let solid = 0;
  let inProgress = 0;
  let needsReinforcement = 0;

  for (let student of studentsData) {
    const progression = calculerProgression(student.id);

    sommeProgressions += progression;

    if (progression >= 80) {
      solid++;
    } else if (progression >= 50) {
      inProgress++;
    } else {
      needsReinforcement++;
    }
  }

  let moyenne = 0;

  if (totalApprenants > 0) {
    moyenne = sommeProgressions / totalApprenants;
  }

  const apprenantsTries = trierParProgression(studentsData);

  console.log("========== TABLEAU DE BORD ==========");

  console.log("Total apprenants :", totalApprenants);
  console.log("Moyenne du groupe :", moyenne.toFixed(2) + "%");

  console.log("Solid :", solid);
  console.log("In Progress :", inProgress);
  console.log("Needs Reinforcement :", needsReinforcement);

  console.log("\n--- Progression des apprenants ---");

  for (let student of apprenantsTries) {
    const progression = calculerProgression(student.id);

    console.log(student.name, "→", progression.toFixed(2) + "%");
  }

  console.log("\n--- Jours et challenges manquants ---");

  for (let student of studentsData) {
    const joursEnregistres = student.results.map(function (result) {
      return result.jour;
    });

    const joursManquants = [];

    for (let jour = 1; jour <= 7; jour++) {
      if (!joursEnregistres.includes(jour)) {
        joursManquants.push(jour);
      }
    }

    const challengesManquants = [];

    for (let result of student.results) {
      if (!result.challengeTermine) {
        challengesManquants.push(result.jour);
      }
    }

    console.log(student.name);

    console.log("Jours manquants :", joursManquants);

    console.log("Challenges manquants :", challengesManquants);
  }
}


module.exports = {
    normaliserNom,
    validerResultat,
    ajouterApprenant,
    enregistrerResultat,
    rechercherApprenant,
    calculerProgression,
    filtrerParNiveau,
    trierParProgression,
    afficherTableauDeBord
};
