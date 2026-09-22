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
        console.log("Erreur : les exercices terminés ne peuvent pas dépasser le total.");
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
        results: []
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



